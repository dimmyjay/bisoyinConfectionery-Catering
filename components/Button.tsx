// components/Button.tsx

"use client";

import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700",
    outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white active:bg-orange-700",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseStyles = `
    flex items-center justify-center gap-2
    rounded-xl
    font-semibold
    transition-all
    duration-300
    disabled:cursor-not-allowed
    disabled:opacity-50
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-orange-500
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 size={20} className="animate-spin" />}
      {loading ? "Please wait..." : children}
    </button>
  );
}