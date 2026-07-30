// app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image"; // ✅ Added Image import

export const metadata: Metadata = {
  title: "About Us | Bisoyin Confectionery & Catering Services",
  description:
    "Learn more about Bisoyin Confectionery & Catering Services, our passion for quality baking, delicious meals, and exceptional catering services.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-amber-50 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-600">
            About Us
          </p>

          <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
            Every Meal is Made with Love.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
            Bisoyin Confectionery & Catering Services is committed to creating
            delicious cakes, pastries, meals, and catering experiences that
            leave lasting memories. We combine quality ingredients, creativity,
            and excellent customer service to make every occasion special.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Our Story
            </h2>

            <p className="mb-4 text-gray-600">
              What started as a passion for baking has grown into a trusted
              confectionery and catering brand known for quality, freshness, and
              attention to detail.
            </p>

            <p className="mb-4 text-gray-600">
              We specialize in cakes, pastries, small chops, delicious meals,
              desserts, event catering, and custom food services for weddings,
              birthdays, corporate events, and other celebrations.
            </p>

            <p className="text-gray-600">
              Every order is prepared with care because we believe great food
              brings people together.
            </p>
          </div>

          {/* ✅ REPLACED PLACEHOLDER WITH ACTUAL IMAGE */}
          <div className="relative h-96 w-full overflow-hidden rounded-3xl bg-gray-100 shadow-xl">
            <Image
              // 💡 TIP: To use your own image, place it in your `public/images/` folder 
              // and change the src to: src="/images/about/business.jpg"
              src="/images/about/business.jpg"
              alt="Bisoyin Confectionery & Catering professional kitchen and baking"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-600">
              To provide delicious, high-quality confectioneries and catering
              services that exceed customer expectations while delivering
              excellent value and unforgettable experiences.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Our Vision</h3>
            <p className="text-gray-600">
              To become one of the most trusted confectionery and catering
              brands by consistently delivering quality, creativity, and
              outstanding customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Why Choose Us?
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Fresh Ingredients", desc: "We source only the highest quality, freshest ingredients for every bake." },
              { title: "Professional Service", desc: "Our experienced team ensures your event runs smoothly from start to finish." },
              { title: "Affordable Pricing", desc: "Premium quality catering and confectionery that fits perfectly within your budget." },
              { title: "Fast & Safe Delivery", desc: "Reliable, hygienic, and prompt delivery right to your venue's doorstep." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:shadow-lg hover:-translate-y-1"
              >
                <h3 className="mb-2 font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-orange-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold">
            Let's Make Your Next Event Special
          </h2>

          <p className="mt-4 text-lg text-orange-100">
            Whether you need a custom cake, delicious pastries, or complete
            catering services, we're ready to serve you.
          </p>

          <a 
            href="/contact"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-semibold text-orange-600 transition hover:bg-orange-50 shadow-lg"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </main>
  );
}