"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader, Grid3X3 } from "lucide-react";
import { getData } from "@/firebase/database";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  image: string;
  price?: number;
  createdAt?: number;
}

const galleryCategories = [
  "All",
  "Cakes",
  "Pastries",
  "Small Chops",
  "Meals",
  "Desserts",
  "Drinks",
  "Catering Services",
];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch products from menu API
        const menuResponse = await fetch("/api/generate-products", { 
          method: "POST" 
        });
        
        let menuItems: GalleryItem[] = [];
        if (menuResponse.ok) {
          const menuData = await menuResponse.json();
          menuItems = menuData.map((item: any) => ({
            id: item.id || `menu-${item.name}`,
            title: item.name,
            description: item.description,
            category: item.category,
            image: item.image,
            price: item.price,
            createdAt: Date.now(),
          }));
        }

        // 2. Safely fetch from Firebase gallery
        let customGalleryItems: GalleryItem[] = [];
        try {
          const galleryData = await getData("gallery");
          
          if (galleryData && typeof galleryData === 'object') {
            customGalleryItems = Object.entries(galleryData)
              .map(([id, item]: any) => ({
                id,
                ...(item as Omit<GalleryItem, 'id'>),
              }))
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          }
        } catch (dbError) {
          // Graceful fallback: If permissions deny access, we just log it and continue
          console.warn("Could not load custom gallery from Firebase (likely permissions):", dbError);
        }

        // 3. Combine both sources, avoiding duplicates
        const allItems = [...customGalleryItems];
        
        menuItems.forEach((menuItem) => {
          const exists = allItems.some(
            (item) => item.title === menuItem.title && item.category === menuItem.category
          );
          if (!exists) {
            allItems.push(menuItem);
          }
        });

        // Sort by most recent
        const sortedItems = allItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setGalleryItems(sortedItems);
        setFilteredItems(sortedItems);
      } catch (error) {
        console.error("Failed to load gallery:", error);
        setGalleryItems([]);
        setFilteredItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  // Filter items by category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(
        galleryItems.filter(
          (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }
  }, [selectedCategory, galleryItems]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em]">
            Our Gallery
          </p>

          <h1 className="text-5xl font-bold md:text-6xl">
            Every Picture Tells a Delicious Story
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-orange-100">
            Explore our finest cakes, pastries, small chops, meals, desserts, 
            catering events, and unforgettable moments we've created for our wonderful customers.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Grid3X3 className="text-orange-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">
                Filter by Category
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {galleryCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105"
                      : "border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600 hover:shadow-md"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredItems.length}
              </span>{" "}
              {filteredItems.length === 1 ? "item" : "items"}
              {selectedCategory !== "All" && (
                <span className="text-orange-600 font-medium"> in {selectedCategory}</span>
              )}
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin text-orange-600" size={40} />
                <p className="text-gray-600">Loading gallery...</p>
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-72 overflow-hidden bg-gray-200">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-gray-400 bg-gray-100">
                        <Grid3X3 size={48} />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-bold text-orange-600 shadow-lg">
                        {item.category}
                      </span>
                    </div>

                    {/* Price Tag (if available) */}
                    {item.price && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                          ₦{item.price.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </p>
                      
                      <Link
                        href="/menu"
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Order Now →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 p-16 text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Grid3X3 className="text-orange-600" size={48} />
              </div>
              <p className="text-lg text-gray-600 mb-2">
                No gallery items found{" "}
                {selectedCategory !== "All" && `in ${selectedCategory}`}.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Check back soon for new additions!
              </p>

              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
                >
                  View All Items
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Stats */}
      {!loading && galleryItems.length > 0 && (
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <p className="text-5xl font-bold text-orange-600 mb-2">
                  {galleryItems.length}+
                </p>
                <p className="text-gray-600 font-medium">Gallery Items</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <p className="text-5xl font-bold text-orange-600 mb-2">
                  {new Set(galleryItems.map((item) => item.category)).size}
                </p>
                <p className="text-gray-600 font-medium">Categories</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <p className="text-5xl font-bold text-orange-600 mb-2">
                  5000+
                </p>
                <p className="text-gray-600 font-medium">Happy Customers</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gray-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Let's Make Your Event Memorable
          </h2>

          <p className="text-lg text-gray-300 mb-8">
            Whether you're celebrating a birthday, wedding, corporate event, or
            any special occasion, we're ready to create something beautiful and
            delicious just for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catering"
              className="inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold transition hover:bg-orange-600 shadow-lg hover:shadow-xl"
            >
              Book Our Services
            </Link>
            <Link
              href="/menu"
              className="inline-block rounded-full border-2 border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-gray-900"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}