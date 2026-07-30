// components/PaystackButton.tsx

"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

interface PaystackButtonProps {
  email: string;
  amount: number;
  customerName?: string;
  phone?: string;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
}

export default function PaystackButton({
  email,
  amount,
  customerName,
  phone,
  onSuccess,
  onError,
}: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          customerName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to initialize payment"
        );
      }

      // Redirect customer to Paystack payment page

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("Payment URL not found");
      }

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Payment failed";

      console.error(message);

      onError?.(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >

      {loading ? (
        <>
          <Loader2
            size={22}
            className="animate-spin"
          />

          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard size={22} />

          Pay ₦{amount.toLocaleString()}
        </>
      )}

    </button>
  );
}