import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow Next/Image to load avatars, cloud storage images, and external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      // Unsplash hosts used by the seeded/sample images
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // ✅ Pixabay images (free stock photos)
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
      // Add any other external hosts you expect to load images from:
      // { protocol: "https", hostname: "example-cdn.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
