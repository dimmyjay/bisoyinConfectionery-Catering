"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { auth, realtimeDb } from "@/firebase/client";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { ref, set as dbSet } from "firebase/database";

export default function PaymentResultPage() {
  const search = useSearchParams();
  const router = useRouter();
  const status = search.get("status");
  const reference = search.get("reference");
  const message = search.get("message");

  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

  // Listen for auth so we can clear server cart if signed in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
    });
    return () => unsub();
  }, []);

  // On success: clear localStorage and server cart (if auth)
  useEffect(() => {
    if (status !== "success") return;

    let mounted = true;
    async function clearCart() {
      setClearing(true);
      try {
        // Clear localStorage cart (guest fallback)
        try {
          localStorage.removeItem("cart");
          localStorage.removeItem("cart:lastUpdated");
        } catch (e) {
          // ignore
        }

        // If signed-in, clear server cart
        if (authUser?.uid) {
          const cartRef = ref(realtimeDb, `carts/${authUser.uid}`);
          await dbSet(cartRef, null);
        }

        if (mounted) setCleared(true);
      } catch (err) {
        console.error("Failed to clear cart after payment:", err);
      } finally {
        if (mounted) setClearing(false);
      }
    }

    // small delay to allow auth to initialize
    const t = setTimeout(() => clearCart(), 300);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [status, authUser]);

  // Nothing to show if status missing
  if (!status) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <div className="rounded-2xl bg-white p-10 shadow-xl text-center max-w-lg">
          <p className="text-gray-700">No payment status found.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => router.push("/")} className="rounded-md border px-4 py-2">
              Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // UI blocks
  const SuccessHeader = () => (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* glowing circle with check */}
        <div className="flex items-center justify-center h-40 w-40 rounded-full bg-gradient-to-tr from-green-100 to-green-200 shadow-2xl transform transition-transform animate-pop">
          <svg className="h-20 w-20 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="11" fill="url(#g)"></circle>
            <path d="M7 13l3 3 7-8" stroke="#065f46" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* shining sparkles (absolutely positioned) */}
        <div className="pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="sparkle"
              style={{
                // spread sparkles around the circle
                left: `${10 + i * 8}%`,
                top: `${-10 - (i % 3) * 6}%`,
                animationDelay: `${i * 120}ms`,
                transform: `translateX(${(i % 2 ? 1 : -1) * (i * 2)}px)`,
              }}
            />
          ))}
        </div>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Successful</h1>
      <p className="mt-3 text-gray-600 max-w-xl">
        Thank you — your payment was processed successfully.
      </p>
      <p className="mt-2 text-sm text-gray-500">Reference: <strong className="text-gray-700">{reference}</strong></p>
    </div>
  );

  const FailureHeader = () => (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center h-36 w-36 rounded-full bg-red-50 shadow-md">
        <svg className="h-16 w-16 text-red-600" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" fill="#fff" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Not Completed</h1>
      <p className="mt-3 text-gray-600 max-w-xl">Your payment could not be confirmed. Please try again.</p>
      {message && <p className="mt-2 text-sm text-gray-500">Reason: {message}</p>}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="relative max-w-3xl w-full rounded-3xl bg-white/80 backdrop-blur-md border border-gray-100 shadow-2xl p-8">
        {/* subtle top decorative gradient */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 opacity-80 blur-sm" />

        <div className="flex flex-col items-center gap-6">
          {status === "success" ? <SuccessHeader /> : <FailureHeader />}

          <div className="w-full mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
            {status === "success" ? (
              <>
                <button
                  onClick={() => router.push("/orders")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3 text-white font-semibold shadow hover:scale-[1.02] transition-transform"
                >
                  View Orders
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-gray-700 bg-white hover:shadow transition"
                >
                  Back to Home
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/cart")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-white font-semibold shadow hover:scale-[1.02] transition-transform"
                >
                  Back to Cart
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-gray-700 bg-white hover:shadow transition"
                >
                  Back to Home
                </button>
              </>
            )}
          </div>

          {/* clearing state */}
          {status === "success" && (
            <div className="mt-4 text-center">
              {clearing ? (
                <div className="flex items-center gap-3 text-gray-600">
                  <Loader className="animate-spin text-orange-600" size={20} />
                  <span>Clearing your cart…</span>
                </div>
              ) : cleared ? (
                <span className="text-sm text-green-600">Your cart has been cleared.</span>
              ) : (
                <span className="text-sm text-gray-500">Finalizing…</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Styles for sparkles/pop/pulse */}
      <style jsx>{`
        .sparkle {
          position: absolute;
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.6) 30%, transparent 60%),
                      linear-gradient(45deg, rgba(255,255,200,0.9), rgba(255,200,120,0.7));
          box-shadow: 0 6px 20px rgba(255,200,120,0.18);
          opacity: 0;
          transform: translateY(8px) scale(0.6);
          animation: sparkleUp 1300ms cubic-bezier(.2,.9,.2,1) forwards;
        }

        @keyframes sparkleUp {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.4) rotate(0deg);
            filter: blur(1px);
          }
          25% {
            opacity: 1;
            transform: translateY(-6px) scale(1.05) rotate(12deg);
            filter: blur(0);
          }
          60% {
            opacity: 0.9;
            transform: translateY(-16px) scale(0.95) rotate(-8deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-34px) scale(0.6) rotate(20deg);
          }
        }

        /* pop/pulse on the main circle */
        .animate-pop {
          animation: popIn 750ms cubic-bezier(.2,.9,.2,1);
        }

        @keyframes popIn {
          0% {
            transform: scale(0.6);
            filter: blur(6px);
            opacity: 0;
          }
          60% {
            transform: scale(1.06);
            filter: blur(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}