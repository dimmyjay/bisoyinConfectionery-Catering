"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Globe } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase/config";

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Set auth cookie
  const setAuthCookie = async (token: string) => {
    try {
      const response = await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Failed to set auth cookie");
      }

      return true;
    } catch (error) {
      console.error("Failed to set auth cookie:", error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const token = await userCredential.user.getIdToken();

      // Set the auth cookie and wait for it
      const cookieSet = await setAuthCookie(token);

      if (!cookieSet) {
        setError("Failed to save login. Please try again.");
        setLoading(false);
        return;
      }

      // Add a small delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ✅ Redirect to homepage
      router.push("/");
    } catch (error: any) {
      console.error("Sign in error:", error);

      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email. Please sign up.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed login attempts. Please try again later.");
          break;
        default:
          setError("Sign in failed. Please try again.");
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const token = await result.user.getIdToken();

      // Set the auth cookie and wait for it
      const cookieSet = await setAuthCookie(token);

      if (!cookieSet) {
        setError("Failed to save login. Please try again.");
        setGoogleLoading(false);
        return;
      }

      // Add a small delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ✅ Redirect to homepage
      router.push("/");
    } catch (error: any) {
      console.error("Google sign in error:", error);

      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Sign in cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          setError("Pop-up was blocked. Please allow pop-ups and try again.");
          break;
        case "auth/account-exists-with-different-credential":
          setError("An account already exists with this email.");
          break;
        default:
          setError("Google sign in failed. Please try again.");
      }
    }

    setGoogleLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-100 via-white to-amber-100 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-orange-600">Welcome Back</h1>
          <p className="mt-3 text-gray-600">
            Sign in to continue shopping with
            <br />
            <span className="font-semibold">
              Bisoyin Confectionery & Catering Services
            </span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 mb-6"
        >
          <Globe size={20} />
          {googleLoading ? "Signing in..." : "Sign in with Google"}
        </button>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-sm text-gray-500">Or with email</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              disabled={loading || googleLoading}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading || googleLoading}
                className="w-full rounded-xl border border-gray-300 p-4 pr-14 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || googleLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-orange-600"
                disabled={loading || googleLoading}
              />
              <span className="text-gray-700">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={20} />
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
