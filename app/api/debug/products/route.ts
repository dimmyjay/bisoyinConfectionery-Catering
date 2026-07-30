// app/api/debug/products/route.ts
import { NextResponse } from "next/server";
import { getProducts } from "@/services/products";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({
      ok: true,
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("debug/products error", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}