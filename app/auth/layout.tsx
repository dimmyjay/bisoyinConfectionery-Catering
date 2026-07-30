import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Bisoyin Confectionery & Catering Services",
  description: "Sign in to your account to continue shopping",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}