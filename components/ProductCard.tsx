"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { addToCart, type CartItemPayload } from "@/utils/cart";

export type ProductCardProps = {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  image?: string;
  stock?: number;
  featured?: boolean;
  className?: string;
  showView?: boolean;
  placeholderSrc?: string; // optional data-uri or local fallback
};

export default function ProductCard({
  id,
  name,
  description,
  category,
  price,
  image,
  stock = 0,
  featured,
  className,
  showView = true,
  placeholderSrc,
}: ProductCardProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/menu");
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      const payload: CartItemPayload = {
        id,
        name,
        price,
        image,
        quantity: 1,
      };
      await addToCart(payload);
      setAdded(true);
      // Keep "Added" visible briefly
      setTimeout(() => setAdded(false), 1400);
    } catch (err) {
      console.error("Add to cart failed:", err);
      // Minimal user feedback; replace with your toast system if available
      alert("Could not add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  // treat http(s) and data: URIs as external (render with <img>)
  const isExternal = typeof image === "string" && (/^https?:\/\//i.test(image) || /^data:/i.test(image));

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      placeholderSrc ??
      (typeof image === "string" && image.startsWith("data:")
        ? image
        : `data:image/svg+xml;utf8,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="18">Image unavailable</text></svg>'
          )}`);
  };

  return (
    <article
      className={clsx(
        "group rounded-2xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
      aria-labelledby={id ? `product-${id}-title` : undefined}
    >
      <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-gray-200">
        {image ? (
          isExternal ? (
            <img
              src={image}
              data-src={image}
              alt={name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform"
              onError={handleImgError}
              loading="lazy"
            />
          ) : (
            <Image src={image} alt={name} fill className="object-cover group-hover:scale-110 transition-transform" />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
        )}

        {stock <= 5 && stock > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">Low Stock</div>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        {featured && (
          <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">Featured</div>
        )}
      </div>

      <div>
        {category && <span className="inline-block mb-2 text-xs font-semibold text-orange-600 uppercase">{category}</span>}

        <h3 id={id ? `product-${id}-title` : undefined} className="mb-2 font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>

        {description && <p className="mb-4 text-sm text-gray-600 line-clamp-2">{description}</p>}

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-orange-600">₦{price.toLocaleString()}</span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className={clsx(
                "rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
                stock === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
              )}
              disabled={stock === 0 || adding}
              onClick={handleAddToCart}
              aria-pressed={added}
              aria-disabled={stock === 0 || adding}
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
                  Add to Cart
                </span>
              )}
            </button>

            {showView && (
              <button type="button" className="rounded-full bg-white p-2 shadow hover:bg-orange-600 hover:text-white transition" onClick={handleView} aria-label={`View ${name}`}>
                View
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}