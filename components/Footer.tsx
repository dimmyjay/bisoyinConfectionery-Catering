"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Top Section */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Company */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            {/* 👇 REPLACE "/logo.png" WITH YOUR ACTUAL LOGO FILE PATH IN THE PUBLIC FOLDER */}
            <Image
              src="/logo2.png"
              alt="Bisoyin Confectionery & Catering Logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />

            <div>
              <h2 className="text-xl font-bold text-white">
                Bisoyin
              </h2>

              <p className="text-sm text-orange-400">
                Confectionery & Catering
              </p>
            </div>
          </div>

          <p className="leading-7 text-gray-400">
            Bringing sweetness and unforgettable catering
            services to every celebration. We specialize in
            cakes, pastries, snacks, meals and event catering
            with exceptional quality.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-3">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Menu", "/menu"],
              ["Gallery", "/gallery"],
              ["Catering", "/catering"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ].map(([title, url]) => (
              <li key={title}>
                <Link
                  href={url}
                  className="flex items-center gap-2 transition hover:text-orange-400"
                >
                  <ChevronRight size={16} />
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-white">
            Contact
          </h3>

          <div className="space-y-5">
            <div className="flex gap-3">
              <MapPin className="mt-1 text-orange-500" />
              <span>
                Orozo, along Cajach Estate Road,
                <br />
                Abuja, Nigeria
              </span>
            </div>

            <div className="flex gap-3">
              <Phone className="text-orange-500" />
              <a
                href="tel:+2347035833549"
                className="transition hover:text-orange-400"
              >
                +234 703 583 3549
              </a>
            </div>

            <div className="flex gap-3">
              <Mail className="text-orange-500" />
              <a
                href="mailto:helenomolara5@gmail.com"
                className="transition hover:text-orange-400"
              >
                helenomolara5@gmail.com
              </a>
            </div>

            <div className="flex gap-3">
              <Clock className="text-orange-500" />
              <span>
                Mon - Sat
                <br />
                8:00 AM - 7:00 PM
              </span>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-white">
            Newsletter
          </h3>

          <p className="mb-5 text-gray-400">
            Subscribe to receive updates on our latest cakes,
            pastries, catering offers and special discounts.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Your Email Address"
              required
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition focus:border-orange-500"
            />

            <button
              type="button"
              className="w-full rounded-xl bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Subscribe
            </button>
          </div>

          {/* Social */}
          <div className="mt-6 flex gap-4">
            <a
              href="https://facebook.com/oyin.helen.7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="rounded-full bg-gray-800 p-3 transition hover:bg-orange-600"
            >
              <FaFacebookF size={20} />
            </a>

            <a
              href="https://instagram.com/bisoyinconfectionery"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="rounded-full bg-gray-800 p-3 transition hover:bg-orange-600"
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="https://x.com/bisoyincatering"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="rounded-full bg-gray-800 p-3 transition hover:bg-orange-600"
            >
              <FaXTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-6 md:flex-row">
          <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
            <p className="text-sm text-gray-500">
              © {year} Bisoyin Confectionery & Catering Services. All rights reserved.
            </p>
            <p className="text-xs text-gray-600">
              Designed & Developed by{" "}
              <a
                href="https://wa.me/2347038784017"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-orange-400 transition hover:text-orange-300"
              >
                TechTune International
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="transition hover:text-orange-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-orange-400"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}