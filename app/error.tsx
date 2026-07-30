"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleReset = () => {
    reset();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle
            size={50}
            className="text-red-600"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900">
          Oops!
        </h1>

        <h2 className="mt-3 text-2xl font-semibold text-orange-600">
          Something Went Wrong
        </h2>

        <p className="mt-5 text-gray-600">
          We encountered an unexpected error while loading this page.
          Please try again or return to the homepage.
        </p>

        {/* Development Error */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 rounded-2xl bg-red-50 p-4 text-left">
            <p className="mb-2 font-semibold text-red-700">
              Error Details
            </p>

            <pre className="overflow-auto whitespace-pre-wrap text-sm text-red-600">
              {error.message}
            </pre>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700"
          >
            <RefreshCw size={20} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-600 px-6 py-4 font-semibold text-orange-600 transition hover:bg-orange-600 hover:text-white"
          >
            <Home size={20} />
            Back Home
          </Link>
        </div>

      </div>
    </main>
  );
}