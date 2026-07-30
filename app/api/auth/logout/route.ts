// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const hostname = req.nextUrl.hostname; // e.g. localhost or example.com
  const cookieNames = ["auth-token", "__session", "user-role"];

  const res = NextResponse.json({ ok: true });

  for (const name of cookieNames) {
    // Clear cookie without domain (matches how you set it earlier)
    res.cookies.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Try clearing with exact hostname (in case cookie was set with domain)
    try {
      res.cookies.set({
        name,
        value: "",
        maxAge: 0,
        path: "/",
        domain: hostname,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    } catch {}

    // Try clearing with dot-prefixed domain (e.g. .example.com)
    if (!hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
      try {
        res.cookies.set({
          name,
          value: "",
          maxAge: 0,
          path: "/",
          domain: `.${hostname}`,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      } catch {}
    }
  }

  return res;
}