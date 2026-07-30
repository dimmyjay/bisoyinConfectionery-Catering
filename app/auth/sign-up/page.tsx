// app/auth/sign-up/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Globe } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "@/firebase/config";

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user starts typing
  };

  const validateForm = (): boolean => {
    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return false;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return false;
    }

    if (form.phone.length < 10) {
      setError("Please enter a valid phone number.");
      return false;
    }

    if (!form.password) {
      setError("Password is required.");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (!form.confirmPassword) {
      setError("Please confirm your password.");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create user with email and password
      const credential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = credential.user;

      // Update profile with full name
      await updateProfile(user, {
        displayName: form.fullName,
      });

      // Save user data to Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        uid: user.uid,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: "customer",
        createdAt: new Date().toISOString(),
        profileImage: null,
        location: "",
        linkedIn: "",
        website: "",
        summary: "",
        education: "",
        experience: [],
        skills: [],
        achievements: [],
        certifications: [],
        languages: [],
        hobbies: [],
        balance: 0,
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Sign up error:", error);

      // Firebase error handling
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Please sign in instead.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please use a stronger password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/operation-not-allowed":
          setError("Email/password registration is not enabled.");
          break;
        case "auth/too-many-requests":
          setError("Too many registration attempts. Please try again later.");
          break;
        default:
          setError("Unable to create account. Please try again.");
      }
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const user = credential.user;

      // Save or update user data in Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        uid: user.uid,
        fullName: user.displayName || "",
        email: user.email,
        phone: "",
        role: "customer",
        createdAt: new Date().toISOString(),
        profileImage: user.photoURL || null,
        location: "",
        linkedIn: "",
        website: "",
        summary: "",
        education: "",
        experience: [],
        skills: [],
        achievements: [],
        certifications: [],
        languages: [],
        hobbies: [],
        balance: 0,
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google sign up error:", error);

      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Sign up cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          setError("Pop-up was blocked. Please allow pop-ups and try again.");
          break;
        case "auth/account-exists-with-different-credential":
          setError("An account already exists with this email.");
          break;
        default:
          setError("Google sign up failed. Please try again.");
      }
    }

    setGoogleLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-100 via-white to-amber-100 px-6 py-8">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-orange-600">Create Account</h1>
          <p className="mt-3 text-gray-600">
            Join Bisoyin Confectionery &
            <br />
            Catering Services today.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 mb-6"
        >
          <Globe size={20} />
          {googleLoading ? "Creating Account..." : "Sign up with Google"}
        </button>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-sm text-gray-500">Or with email</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading || googleLoading}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              disabled={loading || googleLoading}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+234 800 000 0000"
              disabled={loading || googleLoading}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
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

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                disabled={loading || googleLoading}
                className="w-full rounded-xl border border-gray-300 p-4 pr-14 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading || googleLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="terms"
              required
              disabled={loading || googleLoading}
              className="accent-orange-600 mt-1"
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-orange-600 hover:text-orange-700">
                Terms & Conditions
              </Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-medium text-orange-600 hover:text-orange-700">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={20} />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
