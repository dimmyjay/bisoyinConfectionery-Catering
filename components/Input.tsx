// components/Input.tsx

"use client";

import { ReactNode } from "react";

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  icon?: ReactNode;
  className?: string;
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  required = false,
  disabled = false,
  error,
  icon,
  className = "",
}: InputProps) {
  return (
    <div className="w-full">

      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">

        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-xl border
            border-gray-300
            bg-white
            px-4 py-3
            text-gray-900
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-orange-500
            focus:ring-2
            focus:ring-orange-200
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            ${
              icon
                ? "pl-12"
                : ""
            }
            ${className}
          `}
        />

      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}