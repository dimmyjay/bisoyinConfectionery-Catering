"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { addToCart, type CartItemPayload } from "@/utils/cart";
import clsx from "clsx";

interface AddToCartButtonProps {
  productId: string | number;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
  className?: string;
}

/**
 * Client-side button that adds the product to cart.
 * - Uses utils/addToCart which handles signed-in (Realtime DB tx) and guest (localStorage) cases.
 * - Shows "Adding…" while in progress and "Added" briefly on success.
 * - Does NOT navigate by default; caller can provide their own behavior.
 */
export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (adding) return;
    setAdding(true);
    try {
      const payload: CartItemPayload = {
        id: productId,
        name,
        price,
        quantity,
        image,
      };
      await addToCart(payload);
      setAdded(true);
      // keep "Added" visible briefly
      setTimeout(() => setAdded(false), 1600);
    } catch (err) {
      console.error("Add to cart failed:", err);
      // Minimal user feedback; replace with your toast system if available
      alert("Could not add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={adding}
      aria-pressed={added}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-300",
        // primary style
        "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md hover:brightness-105 disabled:opacity-60",
        className
      )}
    >
      {adding ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="0" />
          </svg>
          Adding…
        </span>
      ) : added ? (
        <span className="inline-flex items-center gap-2">
          <Check size={16} />
          Added
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <ShoppingCart size={16} />
          Add to cart
        </span>
      )}
    </button>
  );
}