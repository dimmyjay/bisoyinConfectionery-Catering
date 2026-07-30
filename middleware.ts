import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/orders",
];

const publicRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth",
  "/menu",
  "/catering",
  "/gallery",
  "/blog",
  "/contact",
  "/cart",
];

const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth cookie(s) - adjust names to match what you set
  const token =
    request.cookies.get("auth-token")?.value ||
    request.cookies.get("__session")?.value ||
    null;

  const role = request.cookies.get("user-role")?.value || null;

  // Helper: is this a protected route?
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If route is protected and there's no token -> redirect to sign-in
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // If authenticated user tries to visit auth pages, redirect to dashboard
  const isAuthPage =
    pathname === "/auth/sign-in" ||
    pathname === "/auth/sign-up" ||
    pathname === "/auth";

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect admin routes
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Dashboard exact and subpaths
    "/dashboard",
    "/dashboard/:path*",

    // Profile, orders (exact + subpaths)
    "/profile",
    "/profile/:path*",
    "/orders",
    "/orders/:path*",

    // Admin
    "/admin",
    "/admin/:path*",

    // Auth pages (so we can redirect logged-in users away)
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth",
  ],
};