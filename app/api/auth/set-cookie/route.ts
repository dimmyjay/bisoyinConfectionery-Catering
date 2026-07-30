import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Create response
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Set auth token cookie (httpOnly for security)
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Set cookie error:", error);
    return NextResponse.json(
      { error: "Failed to set auth cookie" },
      { status: 500 }
    );
  }
}
