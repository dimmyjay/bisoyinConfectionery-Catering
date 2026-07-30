// components/Hero.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-100">

      {/* Background Blur */}

      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="mx-auto grid min-h-[90vh] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            🎂 Freshly Baked Every Day
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-gray-900 md:text-7xl">

            Delicious Cakes,
            <span className="block text-orange-600">
              Pastries &
            </span>

            Catering Services

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">

            Welcome to <strong>Bisoyin Confectionery & Catering
            Services</strong>, where every bite tells a story.
            We create premium cakes, pastries, snacks, meals and
            offer professional catering services for weddings,
            birthdays, corporate events and every special occasion.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              href="/menu"
              className="inline-flex items-center gap-3 rounded-xl bg-orange-600 px-8 py-4 font-semibold text-white transition hover:bg-orange-700"
            >
              <ShoppingBag size={22} />
              Order Now
            </Link>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 rounded-xl border-2 border-orange-600 px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-600 hover:text-white"
            >
              View Gallery
              <ArrowRight size={20} />
            </Link>

          </div>

          {/* Statistics */}

          <div className="mt-16 grid grid-cols-3 gap-8">

            <div>
              <h2 className="text-4xl font-bold text-orange-600">
                500+
              </h2>

              <p className="mt-2 text-gray-600">
                Happy Customers
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-orange-600">
                100+
              </h2>

              <p className="mt-2 text-gray-600">
                Events Catered
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-orange-600">
                5★
              </h2>

              <p className="mt-2 text-gray-600">
                Customer Rating
              </p>
            </div>

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="relative"
        >

          <img
            src="/images/hero.jpg"
            alt="Bisoyin Confectionery"
            className="h-[650px] w-full rounded-[40px] object-cover shadow-2xl"
          />

          {/* Floating Card */}

          <div className="absolute left-6 top-8 rounded-2xl bg-white p-5 shadow-xl">

            <div className="flex items-center gap-3">

              <Star
                className="fill-yellow-400 text-yellow-400"
                size={22}
              />

              <div>

                <h3 className="font-bold text-gray-900">
                  Premium Quality
                </h3>

                <p className="text-sm text-gray-500">
                  Fresh Ingredients Daily
                </p>

              </div>

            </div>

          </div>

          <div className="absolute bottom-8 right-6 rounded-2xl bg-orange-600 p-6 text-white shadow-xl">

            <h3 className="text-3xl font-bold">
              24/7
            </h3>

            <p className="mt-2">
              Online Orders
            </p>

          </div>

        </motion.div>

      </div>

    </section>
  );
}