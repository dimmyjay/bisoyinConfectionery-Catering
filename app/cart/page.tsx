"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Loader } from "lucide-react";

import { auth, realtimeDb } from "@/firebase/client";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { ref, onValue, set as dbSet } from "firebase/database";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingServerCart, setLoadingServerCart] = useState(true);
  const dbUnsubscribeRef = useRef<(() => void) | null>(null);

  // Subscribe to auth changes and attach/detach DB listener accordingly
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      // detach any existing db listener
      if (dbUnsubscribeRef.current) {
        dbUnsubscribeRef.current();
        dbUnsubscribeRef.current = null;
      }

      if (u?.uid) {
        subscribeServerCart(u.uid);
      } else {
        setCartItems([]);
        setLoadingServerCart(false);
      }
    });

    return () => {
      unsubAuth();
      if (dbUnsubscribeRef.current) {
        dbUnsubscribeRef.current();
        dbUnsubscribeRef.current = null;
      }
    };
  }, []);

  function subscribeServerCart(uid: string) {
    setLoadingServerCart(true);
    const cartRef = ref(realtimeDb, `carts/${uid}`);

    const off = onValue(
      cartRef,
      (snapshot) => {
        const val = snapshot.val();
        
        // ✅ FIX: Defer state update to avoid "setState in render" conflict with Navbar
        queueMicrotask(() => {
          if (val) {
            const items: CartItem[] = Object.values(val).map((it: any) => ({
              id: String(it.id),
              name: it.name,
              price: Number(it.price),
              quantity: Number(it.quantity),
              image: it.image,
            }));
            setCartItems(items);
          } else {
            setCartItems([]);
          }
          setLoadingServerCart(false);
        });
      },
      (err) => {
        console.error("Failed to read cart from DB:", err);
        queueMicrotask(() => {
          setCartItems([]);
          setLoadingServerCart(false);
        });
      }
    );

    dbUnsubscribeRef.current = () => off();
  }

  // Helper: persist cart to DB (object keyed by item id)
  async function persistCartToServer(uid: string, items: CartItem[]) {
    const cartRef = ref(realtimeDb, `carts/${uid}`);
    const payload: Record<string, CartItem> = {};
    for (const it of items) {
      payload[String(it.id)] = it;
    }
    await dbSet(cartRef, payload);
  }

  // Quantity change handler - only allowed when signed in
  const handleQuantityChange = (id: string, delta: number) => {
    if (!user?.uid) {
      router.push("/auth/sign-in");
      return;
    }

    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      // Persist asynchronously
      persistCartToServer(user.uid, updated).catch((e) => console.error(e));
      return updated;
    });
  };

  // Remove item handler - only allowed when signed in
  const handleRemoveItem = (id: string) => {
    if (!user?.uid) {
      router.push("/auth/sign-in");
      return;
    }

    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      persistCartToServer(user.uid, updated).catch((e) => console.error(e));
      return updated;
    });
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 3000 : 0;
  const total = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">Review your order before proceeding to payment.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          {/* Cart Items */}
          <section className="space-y-6">
            {loadingServerCart ? (
              <div className="rounded-2xl bg-white p-8 text-center">
                <Loader className="mx-auto mb-4 animate-spin text-orange-600" size={36} />
                <p className="text-gray-600">Loading your cart…</p>
              </div>
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm md:flex-row">
                  <div className="relative h-40 w-full overflow-hidden rounded-xl md:w-40">
                    <Image 
                      src={item.image ?? "/images/products/placeholder.png"} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">{item.name}</h2>
                      <p className="mt-2 font-semibold text-orange-600">₦{item.price.toLocaleString()}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="h-10 w-10 rounded-lg border text-lg font-semibold hover:bg-gray-100"
                        >
                          −
                        </button>

                        <span className="w-8 text-center text-lg font-semibold">{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="h-10 w-10 rounded-lg border text-lg font-semibold hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(item.id)} 
                        className="text-red-500 transition hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center">
                <Package className="mx-auto mb-4 text-gray-400" size={40} />
                <p className="text-gray-600">
                  {user ? "Your cart is empty." : "Sign in to see and persist your cart."}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Link
                    href="/menu"
                    className="inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
                  >
                    Browse Menu
                  </Link>
                  {!user && (
                    <button
                      onClick={() => router.push("/auth/sign-in")}
                      className="inline-block rounded-xl border border-orange-600 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Order Summary */}
          <aside className="rounded-2xl bg-white p-8 shadow-sm h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryFee.toLocaleString()}</span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
              className={`mt-8 w-full rounded-xl px-6 py-4 text-center font-semibold text-white transition ${
                cartItems.length === 0 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              Proceed to Checkout
            </button>

            <Link 
              href="/menu" 
              className="mt-4 block rounded-xl border border-orange-600 px-6 py-4 text-center font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Continue Shopping
            </Link>

            {user ? (
              <p className="mt-4 text-sm text-gray-600">
                Signed in as <strong>{user.email}</strong>
              </p>
            ) : (
              <p className="mt-4 text-sm text-gray-600">
                Sign in to persist your cart across devices.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}