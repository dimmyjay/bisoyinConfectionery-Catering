"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Loader, SearchX } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

type Product = {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  stock: number;
  featured?: boolean;
};

const menuCategories = [
  { title: "Cakes", slug: "cakes", description: "Birthday cakes, wedding cakes, cupcakes, and custom cakes." },
  { title: "Pastries", slug: "pastries", description: "Meat pies, chicken pies, sausage rolls, doughnuts, and more." },
  { title: "Small Chops", slug: "small-chops", description: "Puff puff, spring rolls, samosas, chicken wings, and other party favorites." },
  { title: "Meals", slug: "meals", description: "Delicious rice dishes, jollof, fried rice, pasta, and other savory main courses." },
  { title: "Desserts", slug: "desserts", description: "Sweet treats, fruit salads, ice cream, and other delightful after-meal options." },
  { title: "Drinks", slug: "drinks", description: "Refreshing beverages, smoothies, juices, cocktails, and soft drinks for your events." },
  { title: "Catering Services", slug: "catering-services", description: "Professional catering for weddings, corporate events, and parties." },
];

const pageSize = 8;

function slugify(input?: string) {
  if (!input) return "uncategorized";
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Base64 SVG Placeholder for missing images
const PLACEHOLDER_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=";

export default function MenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase().trim() || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const resultsSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      try {
        const response = await fetch("/api/generate-products", {
          method: "POST",
        });
        
        if (!response.ok) throw new Error("Failed to load");
        
        const prods = await response.json();
        
        if (!mounted) return;
        
        const normalized = prods.map((p: any) => ({ 
          ...p, 
          category: p.category ? String(p.category) : "Uncategorized" 
        }));
        
        setProducts(normalized);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // Scroll to results section when search query changes
  useEffect(() => {
    if (searchQuery && resultsSectionRef.current) {
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [searchQuery]);

  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const c of menuCategories) counts[c.slug] = pageSize;
    setVisibleCounts(counts);
  }, [products.length]);

  // ✅ Filter products based on search query during grouping
  const grouped: Record<string, Product[]> = products.reduce((acc, p) => {
    const slug = slugify(p.category);
    if (!acc[slug]) acc[slug] = [];
    
    const matchesSearch = 
      searchQuery === "" || 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery);

    if (matchesSearch) {
      acc[slug].push(p);
    }
    return acc;
  }, {} as Record<string, Product[]>);

  const openCategory = (slug: string) => {
    setSelectedCategory(slug);
    setTimeout(() => {
      const el = sectionRefs.current[slug];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const loadMore = (slug: string) => {
    setVisibleCounts((prev) => ({ ...prev, [slug]: (prev[slug] || pageSize) + pageSize }));
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    router.push("/menu");
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center py-20">
        <Loader className="animate-spin text-orange-600" size={40} />
      </main>
    );
  }

  // Calculate total visible items for search feedback
  const totalVisibleItems = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <main className="min-h-screen">
      <section className="bg-orange-50 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-600">Our Menu</p>
          <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">Freshly Prepared. Beautifully Served.</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">Discover our cakes, pastries, small chops, meals, and professional catering services.</p>
          
          {/* Show active search indicator in hero */}
          {searchQuery && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-200">
              <span className="text-sm text-gray-600">Searching for:</span>
              <span className="font-semibold text-orange-600">"{searchQuery}"</span>
              <button onClick={clearSearch} className="ml-2 text-gray-400 hover:text-red-500 transition">✕</button>
            </div>
          )}
        </div>
      </section>

      {/* Only show categories browse section if there is NO active search */}
      {!searchQuery && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-bold mb-6">Browse Categories</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {menuCategories.map((c) => {
                const items = grouped[c.slug] || [];
                const firstItem = items[0];
                
                return (
                  <article key={c.slug} className="group rounded-2xl border bg-white p-6 shadow-sm hover:-translate-y-1 transition cursor-pointer">
                    <div
                      className="relative h-44 mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center"
                      onClick={() => openCategory(c.slug)}
                    >
                      {firstItem?.image ? (
                        <Image
                          src={firstItem.image}
                          alt={c.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <span className="text-gray-400 font-medium">{c.title}</span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold">{c.title}</h3>
                    <p className="text-sm text-orange-600 font-semibold mt-1">{items.length} {items.length === 1 ? "item" : "items"}</p>
                    <p className="text-gray-600 mt-3 text-sm">{c.description}</p>

                    <div className="mt-4 flex gap-3">
                      <button onClick={() => openCategory(c.slug)} className="rounded-lg bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700 transition">View Items</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section ref={resultsSectionRef} className="py-12 bg-gray-50 min-h-[50vh]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                {searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : selectedCategory 
                    ? menuCategories.find(c => c.slug === selectedCategory)?.title 
                    : "All Products"
                }
              </h2>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-1">Found {totalVisibleItems} item{totalVisibleItems !== 1 ? 's' : ''}</p>
              )}
            </div>
            
            {(selectedCategory || searchQuery) && (
              <button 
                onClick={searchQuery ? clearSearch : clearCategoryFilter} 
                className="rounded-lg border px-4 py-2 hover:bg-gray-100 transition"
              >
                {searchQuery ? "Clear Search" : "Back to categories"}
              </button>
            )}
          </div>

          {/* No Results State */}
          {searchQuery && totalVisibleItems === 0 ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <SearchX className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-bold text-gray-900">No items found</h3>
              <p className="mt-2 text-gray-600">We couldn't find anything matching "{searchQuery}". Try a different keyword.</p>
              <button onClick={clearSearch} className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 transition">
                View Full Menu
              </button>
            </div>
          ) : (
            <>
              {(selectedCategory ? menuCategories.filter(c => c.slug === selectedCategory) : menuCategories).map((cat) => {
                const allItems = grouped[cat.slug] || [];
                const visible = allItems.slice(0, visibleCounts[cat.slug] || pageSize);
                
                if (visible.length === 0 && !selectedCategory) return null;

                return (
                  <div 
                    key={cat.slug} 
                    // ✅ Fixed: Use curly braces to ensure the callback returns void instead of the assigned value
                    ref={(el) => { sectionRefs.current[cat.slug] = el; }} 
                    className="mb-12"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-2xl font-semibold">{cat.title}</h3>
                      <p className="text-sm text-gray-600">{allItems.length} items</p>
                    </div>

                    {visible.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visible.map((p) => (
                          <div key={p.id ?? p.name}>
                            <ProductCard {...p} showView={false} placeholderSrc={PLACEHOLDER_SVG} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-white p-8 text-center text-gray-500">No items in this category.</div>
                    )}

                    {allItems.length > (visibleCounts[cat.slug] || pageSize) && (
                      <div className="mt-6 text-center">
                        <button onClick={() => loadMore(cat.slug)} className="rounded-lg bg-white border px-6 py-2 hover:bg-gray-50 transition">Load more</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
