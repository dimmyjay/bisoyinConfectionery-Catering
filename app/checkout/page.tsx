"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { auth, realtimeDb } from "@/firebase/client";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { Package, Loader, CreditCard } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  note: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const dbUnsubRef = useRef<(() => void) | null>(null);

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
    note: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to auth and cart
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u ?? null);
      setAuthChecked(true);

      // detach existing cart listener
      if (dbUnsubRef.current) {
        dbUnsubRef.current();
        dbUnsubRef.current = null;
      }

      if (!u) {
        router.replace("/auth/sign-in");
        setLoadingCart(false);
        return;
      }

      // prefill customer fields from user
      setCustomer((prev) => ({
        ...prev,
        fullName: u.displayName ?? prev.fullName,
        email: u.email ?? prev.email,
      }));

      // subscribe to realtime cart /carts/{uid}
      setLoadingCart(true);
      const cartRef = ref(realtimeDb, `carts/${u.uid}`);
      const off = onValue(
        cartRef,
        (snapshot) => {
          const val = snapshot.val();
          if (!val) {
            setCartItems([]);
            setLoadingCart(false);
            return;
          }
          const items: CartItem[] = Object.values(val).map((it: any) => ({
            id: String(it.id),
            name: it.name,
            price: Number(it.price),
            quantity: Number(it.quantity),
            image: it.image,
          }));
          setCartItems(items);
          setLoadingCart(false);
        },
        (err) => {
          console.error("Failed to read cart from DB:", err);
          setCartItems([]);
          setLoadingCart(false);
        }
      );

      dbUnsubRef.current = () => off();
    });

    return () => {
      unsubAuth();
      if (dbUnsubRef.current) {
        dbUnsubRef.current();
        dbUnsubRef.current = null;
      }
    };
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const deliveryFee = cartItems.length > 0 ? 3000 : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
    if (errors[name as keyof CustomerInfo]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    
    if (!customer.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!customer.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(customer.email)) newErrors.email = "Invalid email format";
    
    if (!customer.phone.trim()) newErrors.phone = "Phone number is required";
    if (!customer.address.trim()) newErrors.address = "Delivery address is required";
    if (!customer.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customer.email,
          amount: total * 100, // Paystack requires amount in kobo
          uid: user.uid,
          customer: {
            fullName: customer.fullName,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state || "Lagos",
            note: customer.note,
          },
          cartItems: cartItems, // ✅ ROOT LEVEL: Satisfies your API validation
          metadata: {
            uid: user.uid,
            cartItems: cartItems, // ✅ METADATA LEVEL: Ensures Paystack webhook gets it
            customer: {
              fullName: customer.fullName,
              phone: customer.phone,
              address: customer.address,
              city: customer.city,
              state: customer.state || "Lagos",
              note: customer.note,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      if (data.status && data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        console.error("Payment init failed:", data);
        alert(data.message || "Unable to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong while initializing payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showLoader = !authChecked || loadingCart;

  if (showLoader) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-orange-600" size={40} />
          <p className="text-gray-600">Loading checkout…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order and proceed to secure payment.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          {/* Customer Information */}
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-8 text-2xl font-bold">Customer Information</h2>

            <div className="grid gap-6">
              <div>
                <input
                  name="fullName"
                  placeholder="Full Name *"
                  value={customer.fullName}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-4 outline-none focus:border-orange-500 ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={customer.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-4 outline-none focus:border-orange-500 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <input
                  name="phone"
                  placeholder="Phone Number *"
                  value={customer.phone}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-4 outline-none focus:border-orange-500 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <input
                  name="address"
                  placeholder="Delivery Address *"
                  value={customer.address}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-4 outline-none focus:border-orange-500 ${errors.address ? 'border-red-500' : ''}`}
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    name="city"
                    placeholder="City *"
                    value={customer.city}
                    onChange={handleChange}
                    className={`w-full rounded-xl border p-4 outline-none focus:border-orange-500 ${errors.city ? 'border-red-500' : ''}`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <input
                    name="state"
                    placeholder="State *"
                    value={customer.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-4 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <textarea
                name="note"
                rows={3}
                placeholder="Additional Note (Optional)"
                value={customer.note}
                onChange={handleChange}
                className="w-full rounded-xl border p-4 outline-none focus:border-orange-500"
              />
            </div>
          </section>

          {/* Order Summary */}
          <aside className="rounded-2xl bg-white p-8 shadow-sm h-fit sticky top-8">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            <div className="mt-8 space-y-6">
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>

                      <p className="font-semibold text-sm whitespace-nowrap">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-gray-50 p-8 text-center border-2 border-dashed border-gray-200">
                  <Package className="mx-auto mb-4 text-gray-400" size={40} />
                  <p className="text-gray-600">Your cart is empty.</p>
                  <button 
                    onClick={() => router.push("/menu")} 
                    className="mt-4 inline-block rounded-xl bg-orange-600 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              )}

              {cartItems.length > 0 && (
                <>
                  <hr className="border-gray-100" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>₦{deliveryFee.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout} 
                    disabled={isSubmitting}
                    className={`mt-6 w-full rounded-xl py-4 font-semibold text-white transition flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-orange-400 cursor-not-allowed' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Pay with Paystack
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Secure payment powered by Paystack
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}