import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://bisoyin-confectionery.vercel.app"),
  title: {
    default: "Bisoyin Confectionery & Catering Services",
    template: "%s | Bisoyin Confectionery",
  },
  description: "Bisoyin Confectionery & Catering Services offers delicious cakes, pastries, snacks, meals, catering services, event packages, and online ordering for every occasion.",
  keywords: ["Bisoyin", "Confectionery", "Catering", "Cake Shop", "Birthday Cakes", "Wedding Cakes", "Small Chops", "Pastries", "Meals", "Food Delivery", "Event Catering", "Nigeria", "Osogbo"],
  authors: [{ name: "Bisoyin Confectionery" }],
  creator: "Bisoyin Confectionery",
  publisher: "Bisoyin Confectionery",
  applicationName: "Bisoyin Confectionery",
  category: "Food",
  openGraph: {
    title: "Bisoyin Confectionery & Catering Services",
    description: "Freshly baked cakes, pastries, catering services, and event packages made with excellence.",
    url: "https://bisoyin-confectionery.vercel.app",
    siteName: "Bisoyin Confectionery",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Bisoyin Confectionery & Catering Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bisoyin Confectionery & Catering Services",
    description: "Order delicious cakes, pastries, snacks and catering services online.",
    images: ["/images/hero.jpg"],
  },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/favicon.ico" },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ea580c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}