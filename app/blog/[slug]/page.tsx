"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Share2, Check, Copy } from "lucide-react";
import { notFound, useParams } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Now guaranteed to be clean HTML string from Groq
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/generate?slug=${slug}`);
        const data = await response.json();
        
        const foundPost = data.posts?.[0];
        
        if (foundPost && foundPost.slug === slug) {
          setPost(foundPost);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to load blog post:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    // Try native sharing first (works great on mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
        console.log("Share cancelled or failed, falling back to clipboard");
        copyToClipboard();
      }
    } else {
      // Fallback for desktop browsers
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      alert("Failed to copy link. Please copy it manually.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading article...</p>
        </div>
      </main>
    );
  }

  if (!post) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Article Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "/bisoyinblog.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 pb-16 pt-32">
          <div className="mx-auto max-w-4xl px-6">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors font-medium"
            >
              <ArrowLeft size={18} /> Back to Blog
            </Link>
            
            <span className="inline-block bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              {post.category}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          {/* Social Share Bar */}
          <div className="flex items-center justify-between mb-12 pb-8 border-b border-gray-100">
            <p className="text-gray-500 text-sm">Share this article:</p>
            <button 
              onClick={handleShare}
              className={`flex items-center gap-2 font-semibold transition-all duration-300 ${
                isCopied 
                  ? "text-green-600 bg-green-50 px-4 py-2 rounded-lg" 
                  : "text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-lg"
              }`}
              aria-label={isCopied ? "Link copied" : "Share article"}
            >
              {isCopied ? <Check size={18} /> : <Share2 size={18} />} 
              {isCopied ? "Link Copied!" : "Share"}
            </button>
          </div>

          {/* Main Content - Rendered beautifully with rich HTML */}
          <div className="prose prose-lg prose-orange max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed font-medium mb-8 italic border-l-4 border-orange-500 pl-6">
              {post.excerpt}
            </p>
            
            {/* ✅ Safely render the clean HTML generated by Groq */}
            <div 
              className="text-gray-700 leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Enjoyed this article?</h3>
            <p className="text-gray-600 mb-6">Explore more delicious recipes, baking tips, and catering ideas on our blog.</p>
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg"
            >
              Read More Articles <ArrowLeft className="rotate-180" size={18} />
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}