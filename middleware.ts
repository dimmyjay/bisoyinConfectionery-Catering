// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/orders"];
const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ ALWAYS ALLOW AUTH PAGES TO PREVENT LOCKOUT
  if (
    pathname.startsWith("/auth") ||
    pathname === "/auth/sign-in" ||
    pathname === "/auth/sign-up"
  ) {
    return NextResponse.next();
  }

  // Read auth cookie (Ensure you are setting this cookie upon login!)
  const token = request.cookies.get("auth-token")?.value;

  // Helper: is this a protected route?
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If route is protected and there's no token -> redirect to sign-in
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // Protect admin routes
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAdminRoute) {
    const role = request.cookies.get("user-role")?.value;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/auth/:path*", // Include auth to allow the redirect logic above to work
  ],
};
