"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartProps {
  initialItems: CartItem[];
}

export default function Cart({ initialItems }: CartProps) {
  const [items, setItems] = useState(initialItems);

  const handleIncrease = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = items.length > 0 ? 2000 : 0;

  const total = subtotal + deliveryFee;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="space-y-6 lg:col-span-2">
        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-lg">
            <ShoppingBag
              className="mx-auto mb-5 text-orange-500"
              size={70}
            />

            <h2 className="text-3xl font-bold">
              Your Cart is Empty
            </h2>

            <p className="mt-3 text-gray-500">
              Add delicious cakes, pastries and meals to
              your cart.
            </p>

            <Link
              href="/menu"
              className="mt-8 inline-block rounded-xl bg-orange-600 px-8 py-4 font-semibold text-white transition hover:bg-orange-700"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-lg md:flex-row md:items-center"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={140}
                height={140}
                className="h-36 w-full rounded-2xl object-cover md:w-36"
              />

              <div className="flex-1">
                <h3 className="text-2xl font-bold">
                  {item.name}
                </h3>

                <p className="mt-2 text-lg font-semibold text-orange-600">
                  ₦{item.price.toLocaleString()}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDecrease(item.id)}
                  className="rounded-full bg-gray-100 p-2 transition hover:bg-orange-100"
                >
                  <Minus size={18} />
                </button>

                <span className="w-8 text-center text-lg font-bold">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => handleIncrease(item.id)}
                  className="rounded-full bg-orange-600 p-2 text-white transition hover:bg-orange-700"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="rounded-full bg-red-100 p-3 text-red-600 transition hover:bg-red-600 hover:text-white"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Order Summary */}
      <div>
        <div className="sticky top-28 rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="mb-8 text-3xl font-bold">
            Order Summary
          </h2>

          <div className="space-y-5 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ₦{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                ₦{deliveryFee.toLocaleString()}
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-2xl font-bold text-orange-600">
              <span>Total</span>
              <span>
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className={`mt-10 block rounded-xl py-4 text-center font-semibold text-white transition ${
              items.length === 0
                ? "pointer-events-none bg-gray-400"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/menu"
            className="mt-4 block rounded-xl border border-orange-600 py-4 text-center font-semibold text-orange-600 transition hover:bg-orange-600 hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}