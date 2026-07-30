// app/auth/forgot-password/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // TODO:
      // Firebase Authentication Password Reset
      // =====================================================

      /*
      import { sendPasswordResetEmail } from "firebase/auth";
      import { auth } from "@/firebase/config";

      await sendPasswordResetEmail(auth, email);
      */

      alert(
        "A password reset link has been sent to your email."
      );
    } catch (error) {
      console.error(error);
      alert("Unable to send password reset email.");
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-100 via-white to-amber-100 px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <Mail className="text-orange-600" size={36} />
          </div>

          <h1 className="text-3xl font-bold text-orange-600">
            Forgot Password?
          </h1>

          <p className="mt-3 text-gray-600">
            Enter your email address and we'll send you a
            password reset link.
          </p>

        </div>

        <form
          onSubmit={handleResetPassword}
          className="space-y-6"
        >

          <div>

            <label className="mb-2 block font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border p-4 outline-none focus:border-orange-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            <Send size={20} />

            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        <div className="mt-8 text-center">

          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 font-semibold text-orange-600 transition hover:text-orange-700"
          >
            <ArrowLeft size={18} />
            Back to Sign In
          </Link>

        </div>

      </div>

    </main>
  );
}