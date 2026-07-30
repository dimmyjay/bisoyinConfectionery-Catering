"use client";

import { ArrowLeft } from "lucide-react";

export default function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 rounded-xl border border-orange-600 px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-600 hover:text-white"
    >
      <ArrowLeft size={20} />
      Go Back
    </button>
  );
}
