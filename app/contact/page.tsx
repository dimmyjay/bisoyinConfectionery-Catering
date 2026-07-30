import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Contact Us | Bisoyin Confectionery & Catering Services",
  description:
    "Get in touch with Bisoyin Confectionery & Catering Services. We'd love to hear from you and help make your next event memorable.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em]">
            Contact Us
          </p>

          <h1 className="text-5xl font-bold md:text-6xl">
            We'd Love to Hear From You
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-orange-100">
            Whether you want to place an order, book our catering services,
            request a quotation, or ask a question, we're always ready to help.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Send Us a Message
            </h2>

            <form className="space-y-6">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 text-orange-600" />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Address
                    </h3>

                    <p className="text-gray-600">
                      Orozo, along Cajach Estate Road,
                      <br />
                      Abuja, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="mt-1 text-orange-600" />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Phone
                    </h3>

                    <a
                      href="tel:+2347035833549"
                      className="text-gray-600 transition hover:text-orange-600"
                    >
                      +234 703 583 3549
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="mt-1 text-orange-600" />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Email
                    </h3>

                    <a
                      href="mailto:helenomolara5@gmail.com"
                      className="text-gray-600 transition hover:text-orange-600"
                    >
                      helenomolara5@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="mt-1 text-orange-600" />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Business Hours
                    </h3>

                    <p className="text-gray-600">
                      Monday - Saturday
                      <br />
                      8:00 AM - 7:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Follow Us
              </h2>

              <div className="flex gap-4">
                <Link
                  href="https://facebook.com/oyin.helen.7"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook: helen omolara edema"
                  className="rounded-full bg-orange-100 p-4 text-orange-600 transition hover:bg-orange-600 hover:text-white"
                >
                  <FaFacebookF size={22} />
                </Link>

                <Link
                  href="https://instagram.com/bisoyinconfectioneryandcateringservices"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram: Bisoyin confectionery and catering services"
                  className="rounded-full bg-orange-100 p-4 text-orange-600 transition hover:bg-orange-600 hover:text-white"
                >
                  <FaInstagram size={22} />
                </Link>

                <Link
                  href="https://x.com/bisoyincatering"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X: Bisoyin catering"
                  className="rounded-full bg-orange-100 p-4 text-orange-600 transition hover:bg-orange-600 hover:text-white"
                >
                  <FaXTwitter size={22} />
                </Link>
              </div>
            </div>

            {/* Google Map */}
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <iframe
                src="https://maps.google.com/maps?q=Orozo,+along+Cajach+Estate+Road,+Abuja&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bisoyin Confectionery & Catering Services Location"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}