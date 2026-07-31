"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  LayoutDashboard,
  Package,
  User,
  LogOut,
  ChevronDown,
  LogIn
} from "lucide-react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, signOutUser, realtimeDb } from "@/firebase/client";
import { ref, onValue } from "firebase/database";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Menu", href: "/menu" },
  { name: "Catering", href: "/catering" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // cart count state
  const [cartCount, setCartCount] = useState<number>(0);

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to server cart for signed-in users; handle guest localStorage cart otherwise
  useEffect(() => {
    let dbOff: (() => void) | null = null;

    function updateGuestCartCountFromLocalStorage() {
      try {
        const raw = localStorage.getItem("cart");
        if (!raw) {
          setCartCount(0);
          return;
        }
        const items = JSON.parse(raw) as Array<{ id: string | number; quantity?: number }>;
        const count = items.reduce((s, it) => s + (it.quantity ?? 1), 0);
        setCartCount(count);
      } catch (e) {
        console.error("Failed to parse local cart:", e);
        setCartCount(0);
      }
    }

    if (user?.uid) {
      const cartRef = ref(realtimeDb, `carts/${user.uid}`);
      dbOff = onValue(
        cartRef,
        (snapshot) => {
          const val = snapshot.val();
          
          queueMicrotask(() => {
            if (!val) {
              setCartCount(0);
              return;
            }
            let count = 0;
            if (typeof val === "object") {
              const vals = Object.values(val) as any[];
              for (const it of vals) {
                const q = Number(it?.quantity ?? 0);
                if (!isNaN(q)) count += q;
              }
            }
            setCartCount(count);
          });
        },
        (err) => {
          queueMicrotask(() => {
            console.error("Cart listener error:", err);
            setCartCount(0);
          });
        }
      );
    } else {
      updateGuestCartCountFromLocalStorage();

      const onStorage = (e: StorageEvent) => {
        if (e.key === "cart") updateGuestCartCountFromLocalStorage();
      };

      const onCartUpdated = (e: Event) => {
        queueMicrotask(() => {
          try {
            const ce = e as CustomEvent;
            if (ce?.detail) {
              const items = ce.detail as Array<{ id: string | number; quantity?: number }>;
              const count = items.reduce((s, it) => s + (it.quantity ?? 1), 0);
              setCartCount(count);
            } else {
              updateGuestCartCountFromLocalStorage();
            }
          } catch (err) {
            updateGuestCartCountFromLocalStorage();
          }
        });
      };

      window.addEventListener("storage", onStorage);
      window.addEventListener("cart:updated", onCartUpdated as EventListener);

      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("cart:updated", onCartUpdated as EventListener);
      };
    }

    return () => {
      if (dbOff) dbOff();
    };
  }, [user]);

  // close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (accountOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAccountOpen(false);
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const toggleMenu = () => setMenuOpen((s) => !s);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setAccountOpen(false);
      await signOutUser();
      setUser(null);
      setCartCount(0);
      router.push("/auth/sign-in");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitials = (displayName?: string | null) => {
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo2.png"
            alt="Bisoyin Confectionery & Catering Logo"
            width={56}
            height={56}
            className="h-14 w-14 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bisoyin</h1>
            <p className="-mt-1 text-xs font-medium text-orange-600">Confectionery & Catering</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`relative font-medium transition-colors ${
                pathname === link.href 
                  ? "text-orange-600" 
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-orange-600 rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* ✅ Expandable Search Bar */}
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <input
                type="text"
                placeholder="Search cakes, pastries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-48 text-gray-700 placeholder-gray-500"
                autoFocus
              />
              <button type="submit" className="text-orange-600 hover:text-orange-700">
                <Search size={18} />
              </button>
              <button type="button" onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </form>
          ) : (
            <button 
              type="button" 
              aria-label="Search" 
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full bg-gray-100 p-2.5 transition hover:bg-orange-100 text-gray-600 hover:text-orange-600"
            >
              <Search size={18} />
            </button>
          )}

          {/* Cart Link */}
          <Link href="/cart" className="relative rounded-full bg-gray-100 p-2.5 transition hover:bg-orange-100 text-gray-600 hover:text-orange-600 group" aria-label="Shopping Cart">
            <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
            <span className={`absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white shadow-sm ${cartCount === 0 ? "hidden" : ""}`}>
              {cartCount}
            </span>
          </Link>

          {/* Profile / Sign In */}
          {user ? (
            <div className="relative" ref={containerRef}>
              <button 
                onClick={() => setAccountOpen((s) => !s)} 
                aria-haspopup="true" 
                aria-expanded={accountOpen} 
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-1.5 pr-3 py-1 transition hover:border-orange-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName || "User avatar"} width={30} height={30} className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-xs">{getInitials(user.displayName)}</div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden xl:block">{user.displayName?.split(' ')[0] || "Account"}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {accountOpen && (
                <div className="absolute right-0 z-50 mt-3 w-60 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5">
                  <div className="mb-2 border-b border-gray-100 pb-2 px-2 pt-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName || "Welcome!"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <Link 
                      href="/profile" 
                      onClick={() => setAccountOpen(false)} 
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-700"
                    >
                      <User size={16} className="text-gray-400" />
                      My Profile
                    </Link>
                    
                    <Link 
                      href="/orders" 
                      onClick={() => setAccountOpen(false)} 
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-700"
                    >
                      <Package size={16} className="text-gray-400" />
                      My Orders
                    </Link>

                    <Link 
                      href="/dashboard" 
                      onClick={() => setAccountOpen(false)} 
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-700"
                    >
                      <LayoutDashboard size={16} className="text-gray-400" />
                      Dashboard
                    </Link>
                  </div>

                  <div className="mt-1.5 border-t border-gray-100 pt-1.5">
                    <button 
                      onClick={handleLogout} 
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {loggingOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ✅ REPLACED: Clean text link instead of button */
            <Link 
              href="/auth/sign-in" 
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-orange-600 px-2 py-1"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          )}

          {/* Divider before Order Now */}
          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <Link href="/menu" className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 shadow-sm hover:shadow-md">
            Order Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button type="button" aria-label="Toggle Menu" aria-expanded={menuOpen} onClick={toggleMenu} className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-full transition">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ✅ Mobile Menu with Scroll Support */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-20 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto border-t bg-white lg:hidden shadow-xl">
          <div className="space-y-2 p-5 pb-8">
            {/* ✅ Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100 transition"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600">
                <Search size={18} />
              </button>
            </form>

            <div className="space-y-0.5">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${pathname === link.href ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50 text-gray-700"}`}>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
                <span className="flex items-center gap-2">
                  <ShoppingCart size={16} />
                  Shopping Cart
                </span>
                <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-600 px-1.5 text-[10px] font-bold text-white ${cartCount === 0 ? "hidden" : ""}`}>{cartCount}</span>
              </Link>

              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
                    <User size={16} /> My Profile
                  </Link>
                  <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
                    <Package size={16} /> My Orders
                  </Link>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  
                  <button 
                    onClick={async () => { setMenuOpen(false); await handleLogout(); }} 
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                /* ✅ REPLACED: Clean text-style link for mobile too */
                <Link 
                  href="/auth/sign-in" 
                  onClick={() => setMenuOpen(false)} 
                  className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  <LogIn size={16} /> Sign In
                </Link>
              )}

              <Link 
                href="/menu" 
                onClick={() => setMenuOpen(false)} 
                className="flex items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white hover:bg-orange-700 transition shadow-sm mt-2"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
