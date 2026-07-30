// app/loading.tsx

import { Loader2, Cake } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="text-center">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 shadow-lg">
          <Cake
            size={48}
            className="text-orange-600"
          />
        </div>

        {/* Spinner */}
        <Loader2
          className="mx-auto mb-6 animate-spin text-orange-600"
          size={40}
        />

        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-900">
          Preparing Something Delicious...
        </h2>

        <p className="mt-3 text-gray-600">
          Please wait while we load your experience.
        </p>

        {/* Progress Animation */}
        <div className="mx-auto mt-8 h-2 w-64 overflow-hidden rounded-full bg-orange-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-orange-600" />
        </div>
      </div>
    </main>
  );
}