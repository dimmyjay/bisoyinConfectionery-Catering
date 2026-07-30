// components/CheckoutForm.tsx

"use client";

import { useState } from "react";
import { CreditCard, Truck, User, Phone, Mail, MapPin } from "lucide-react";

export interface CheckoutData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  note: string;
}

interface CheckoutFormProps {
  total: number;
  loading?: boolean;
  onSubmit: (data: CheckoutData) => Promise<void> | void;
}

export default function CheckoutForm({
  total,
  loading = false,
  onSubmit,
}: CheckoutFormProps) {
  const [form, setForm] = useState<CheckoutData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl bg-white p-8 shadow-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900">
        Checkout Details
      </h2>

      {/* Customer */}

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            <User size={18} />
            Full Name
          </label>

          <input
            required
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            <Mail size={18} />
            Email
          </label>

          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            <Phone size={18} />
            Phone Number
          </label>

          <input
            required
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+234..."
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            <MapPin size={18} />
            State
          </label>

          <input
            required
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Osun State"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
          />
        </div>

      </div>

      {/* Address */}

      <div>
        <label className="mb-2 flex items-center gap-2 font-medium">
          <Truck size={18} />
          Delivery Address
        </label>

        <input
          required
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Street address"
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          City
        </label>

        <input
          required
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Osogbo"
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Order Note (Optional)
        </label>

        <textarea
          rows={5}
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Extra instructions..."
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
        />
      </div>

      {/* Summary */}

      <div className="rounded-2xl bg-orange-50 p-6">

        <div className="flex items-center justify-between text-lg">

          <span>Total Amount</span>

          <span className="text-3xl font-bold text-orange-600">
            ₦{total.toLocaleString()}
          </span>

        </div>

        <p className="mt-3 text-gray-600">
          After clicking the button below, you'll be redirected
          securely to Paystack to complete your payment.
        </p>

      </div>

      {/* Submit */}

      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 py-4 text-lg font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        <CreditCard size={22} />

        {loading
          ? "Processing..."
          : "Continue to Paystack"}
      </button>
    </form>
  );
}