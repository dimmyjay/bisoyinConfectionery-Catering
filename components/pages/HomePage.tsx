"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/Button";
import { Cake, ChefHat, Truck, Star } from "lucide-react";
import { getFeaturedProducts, Product } from "@/services/products";
import { Loader } from "lucide-react";

const staticFeatured: Product[] = [
  {
    id: "cake-001",
    name: "Premium Birthday Cake",
    description:
      "Beautiful custom cakes made for birthdays, weddings and special occasions.",
    price: 100000,
    image: "/images/cake.jpg",
    category: "Cakes",
    stock: 10,
    featured: true,
  },
  // {
  //   id: "pastry-001",
  //   name: "Fresh Pastries",
  //   description:
  //     "Delicious pastries prepared fresh with quality ingredients.",
  //   price: 12000,
  //   image: "/images/pastries.jpg",
  //   category: "Pastries",
  //   stock: 8,
  //   featured: true,
  // },
  {
    id: "catering-001",
    name: "Event Catering Package",
    description:
      "Complete catering solutions for weddings, birthdays and corporate events.",
    price: 300000,
    image: "/images/catering.jpg",
    category: "Catering",
    stock: 5,
    featured: true,
  },
];

const services = [
  {
    icon: Cake,
    title: "Custom Cakes",
    description:
      "Creative cakes designed specially for your memorable occasions.",
  },
  {
    icon: ChefHat,
    title: "Professional Catering",
    description:
      "Amazing meals and services for weddings, parties and events.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "Fast and safe delivery directly to your location.",
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getFeaturedProducts();
        if (mounted && data && data.length > 0) {
          setFeaturedProducts(data);
        } else if (mounted) {
          // fallback to static if DB empty
          setFeaturedProducts(staticFeatured);
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
        if (mounted) setFeaturedProducts(staticFeatured);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Our Featured Products
              </h2>
              <p className="mt-3 text-gray-600">
                Taste the best cakes, pastries and treats.
              </p>
            </div>

            <Link href="/menu">
              <Button>View Menu</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-orange-600" size={32} />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="bg-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold text-gray-900">
            Why Choose Bisoyin?
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-3xl bg-white p-8 shadow-lg"
                >
                  <Icon size={45} className="text-orange-600" />
                  <h3 className="mt-5 text-xl font-bold">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-gray-600">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Star
            size={45}
            className="mx-auto text-orange-500"
            fill="currentColor"
          />
          <h2 className="mt-6 text-4xl font-bold">
            Making Every Celebration Sweeter
          </h2>
          <p className="mt-5 text-gray-600 text-lg">
            From beautifully decorated cakes to professional catering services,
            Bisoyin Confectionery brings quality, creativity and unforgettable
            taste to every event.
          </p>
        </div>
      </section>

      {/* Call To Action */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto rounded-3xl bg-orange-600 p-12 text-center text-white">
          <h2 className="text-4xl font-bold">
            Plan Your Next Event With Us
          </h2>
          <p className="mt-4 text-orange-100">
            Order delicious treats or book our catering services today.
          </p>

          <Link href="/contact">
            <button className="mt-8 rounded-full bg-white px-8 py-4 font-semibold text-orange-600">
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}