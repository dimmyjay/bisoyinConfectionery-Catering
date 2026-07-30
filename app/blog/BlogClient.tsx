"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  ArrowRight, 
  Loader2,
  Mail,
  CheckCircle2,
  X
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

const categories = ["All", "Wedding", "Catering", "Baking", "Cakes", "Small Chops", "Food Tips", "Events", "Recipes"];

export default function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const autoRefreshTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial load
    loadPosts();
    
    // Setup auto-refresh timer (every 2 minutes = 120,000ms)
    autoRefreshTimer.current = setInterval(() => {
      setIsGenerating(true);
      loadPosts();
      setIsGenerating(false);
    }, 120000);
    
    // Cleanup on unmount
    return () => {
      if (autoRefreshTimer.current) {
        clearInterval(autoRefreshTimer.current);
      }
    };
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog/generate");
      const data = await response.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section with Animation */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 py-32 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm font-semibold">Fresh Content Weekly</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Food Inspiration &<br />
            <span className="text-amber-200">Helpful Tips</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-3xl text-xl text-orange-100 leading-relaxed">
            Discover expert advice on cakes, pastries, catering, event planning, 
            and everything delicious for your special occasions.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2">
              <Search className="absolute left-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles, tips, recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 outline-none rounded-2xl"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100 py-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter size={18} className="text-orange-600 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                    : "bg-orange-50 text-gray-700 hover:bg-orange-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results (${filteredPosts.length})` : "Latest Articles"}
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/bisoyinblog.jpg";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-orange-600 shadow-lg">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.readTime}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 font-bold text-orange-600 group-hover:gap-3 transition-all"
                    >
                      Read Article <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-orange-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or category filter</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-amber-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 mx-auto">
                <Mail size={32} />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Never Miss Our Latest Updates
              </h2>
              
              <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
                Subscribe to receive baking tips, food inspiration, promotions, 
                and exciting updates directly in your inbox.
              </p>

              {subscribed ? (
                <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl inline-flex">
                  <CheckCircle2 className="text-green-400" size={24} />
                  <span className="font-semibold text-lg">Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mx-auto max-w-xl flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-6 py-4 rounded-xl text-gray-900 outline-none focus:ring-4 focus:ring-orange-300/50"
                  />
                  <button 
                    type="submit"
                    className="bg-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-black transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    Subscribe Now
                  </button>
                </form>
              )}
              
              <p className="mt-6 text-sm text-orange-200">
                🎁 Get 10% off your first order when you subscribe!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Order Something Delicious?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our menu and discover amazing cakes, pastries, and catering services for your next event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg hover:shadow-xl"
            >
              View Menu
            </Link>
            <Link
              href="/contact"
              className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-orange-600 hover:text-orange-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}