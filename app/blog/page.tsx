// app/blog/page.tsx
import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog | Bisoyin Confectionery & Catering Services",
  description:
    "Read our latest articles, food tips, baking inspiration, catering ideas, and event planning guides.",
};

export default function BlogPage() {
  return <BlogClient />;
}