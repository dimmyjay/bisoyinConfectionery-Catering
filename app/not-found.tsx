import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import GoBackButton from "@/components/GoBackButton";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-6">
      <div className="w-full max-w-2xl text-center">

        {/* 404 */}

        <h1 className="text-8xl font-extrabold text-orange-600 md:text-9xl">
          404
        </h1>

        {/* Icon */}

        <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
          <SearchX
            size={50}
            className="text-orange-600"
          />
        </div>

        {/* Heading */}

        <h2 className="mt-8 text-4xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-gray-600">
          Sorry, the page you are looking for doesn't exist,
          has been moved, or the link you followed is incorrect.
        </p>

        {/* Actions */}

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-4 font-semibold text-white transition hover:bg-orange-700"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <GoBackButton />

        </div>

        {/* Helpful Links */}

        <div className="mt-16 rounded-3xl bg-white p-8 shadow-lg">

          <h3 className="mb-6 text-2xl font-bold text-gray-900">
            You may be looking for
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">

            <Link
              href="/menu"
              className="rounded-xl bg-orange-50 p-5 transition hover:bg-orange-100"
            >
              <h4 className="font-semibold text-gray-900">
                Our Menu
              </h4>

              <p className="mt-2 text-sm text-gray-600">
                Browse cakes, pastries, meals and snacks.
              </p>
            </Link>

            <Link
              href="/catering"
              className="rounded-xl bg-orange-50 p-5 transition hover:bg-orange-100"
            >
              <h4 className="font-semibold text-gray-900">
                Catering Services
              </h4>

              <p className="mt-2 text-sm text-gray-600">
                Book us for weddings, birthdays and events.
              </p>
            </Link>

            <Link
              href="/gallery"
              className="rounded-xl bg-orange-50 p-5 transition hover:bg-orange-100"
            >
              <h4 className="font-semibold text-gray-900">
                Gallery
              </h4>

              <p className="mt-2 text-sm text-gray-600">
                Explore our delicious creations.
              </p>
            </Link>

            <Link
              href="/contact"
              className="rounded-xl bg-orange-50 p-5 transition hover:bg-orange-100"
            >
              <h4 className="font-semibold text-gray-900">
                Contact Us
              </h4>

              <p className="mt-2 text-sm text-gray-600">
                Reach out for inquiries and orders.
              </p>
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}
