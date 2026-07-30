// app/api/paystack/initialize/route.ts
import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      console.error("❌ PAYSTACK_SECRET_KEY missing");
      return NextResponse.json(
        { success: false, message: "Payment configuration error" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      email,
      amount, // Amount sent from client (in kobo)
      uid, // User ID passed directly from checkout
      customer, // Customer details passed directly from checkout
      cartItems,
      metadata = {},
      callback_url,
    } = body as {
      email?: string;
      amount?: number;
      uid?: string;
      customer?: any;
      cartItems?: Array<{ id: string; price?: number; quantity?: number }>;
      metadata?: any;
      callback_url?: string;
    };

    // ✅ Validation checks
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "cartItems is required and must be a non-empty array." },
        { status: 400 }
      );
    }

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "User ID (uid) is required for order tracking." },
        { status: 400 }
      );
    }

    // Use amount from client if provided, otherwise calculate server-side
    let finalAmountKobo = amount;
    
    if (!finalAmountKobo) {
      const subtotalNaira = cartItems.reduce((sum, it) => {
        const price = Number(it.price ?? 0);
        const qty = Number(it.quantity ?? 1);
        return sum + price * qty;
      }, 0);

      const deliveryFeeNaira = subtotalNaira > 0 ? 3000 : 0;
      const totalNaira = subtotalNaira + deliveryFeeNaira;
      
      // Convert to kobo
      finalAmountKobo = Math.round(totalNaira * 100);
    }

    // ✅ Build comprehensive metadata for Paystack
    const paystackMetadata = {
      ...metadata,
      uid,           // Critical: Links payment to user in Firebase
      customer,      // Critical: Contains address, phone, etc.
      cartItems,     // Critical: Items being purchased
    };

    // ✅ Ensure callback points to VERIFY route, not just any callback
    const origin = req.nextUrl?.origin ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resolvedCallbackUrl = callback_url ?? `${origin}/api/paystack/verify`;

    console.log("💳 Initializing Paystack transaction:", {
      email,
      amountKobo: finalAmountKobo,
      uid,
      callbackUrl: resolvedCallbackUrl,
    });

    const payload: Record<string, any> = {
      email,
      amount: finalAmountKobo,
      metadata: paystackMetadata,
      callback_url: resolvedCallbackUrl, // 👈 THIS IS THE FIX
    };

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Paystack API Error:", data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Unable to initialize payment.",
          details: data,
        },
        { status: response.status }
      );
    }

    console.log("✅ Paystack transaction initialized successfully");
    return NextResponse.json(data);
  } catch (error) {
    console.error("💥 Paystack Initialize Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}