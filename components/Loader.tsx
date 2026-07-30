// components/Loader.tsx

"use client";

import { Cake, Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Loader({
  text = "Loading...",
  fullScreen = false,
  size = "md",
}: LoaderProps) {

  const sizes = {
    sm: {
      icon: 24,
      logo: 50,
    },

    md: {
      icon: 36,
      logo: 70,
    },

    lg: {
      icon: 48,
      logo: 90,
    },
  };

  const content = (
    <div className="flex flex-col items-center justify-center">

      {/* Brand Icon */}

      <div
        className={`mb-5 flex items-center justify-center rounded-full bg-orange-100`}
        style={{
          width: sizes[size].logo,
          height: sizes[size].logo,
        }}
      >
        <Cake
          size={sizes[size].logo / 2}
          className="text-orange-600"
        />
      </div>

      {/* Spinner */}

      <Loader2
        size={sizes[size].icon}
        className="animate-spin text-orange-600"
      />

      {/* Text */}

      <p className="mt-4 text-center font-medium text-gray-600">
        {text}
      </p>

      {/* Progress */}

      <div className="mt-5 h-2 w-48 overflow-hidden rounded-full bg-orange-100">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-orange-600" />
      </div>

    </div>
  );


  if (fullScreen) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {content}
      </main>
    );
  }


  return (
    <div className="flex w-full items-center justify-center py-10">
      {content}
    </div>
  );
}