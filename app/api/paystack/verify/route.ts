// app/api/paystack/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ref, push, set } from "firebase/database";
import { realtimeDb } from "@/firebase/client";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    console.log("🔍 [1] Verify Route Hit. Reference:", reference);

    if (!reference) {
      return NextResponse.redirect(new URL("/orders?status=error&msg=no_ref", req.url));
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("💳 [2] Paystack API Response Status:", result.status);

    if (!response.ok || !result.status || result.data.status !== "success") {
      console.error("❌ [3] Payment failed or not successful:", result.data?.gateway_response);
      return NextResponse.redirect(new URL(`/orders?status=failed&ref=${reference}`, req.url));
    }

    const data = result.data;
    const metadata = data.metadata || {};
    const uid = metadata.uid;

    console.log("👤 [4] Extracted UID from metadata:", uid);

    if (!uid) {
      console.error("❌ [5] NO UID FOUND IN METADATA. Order cannot be saved.");
      console.log("Full Metadata:", metadata);
      return NextResponse.redirect(new URL("/orders?status=error&msg=no_uid", req.url));
    }

    const newOrder = {
      id: `order-${Date.now()}`,
      userId: uid,
      customerName: metadata.customer?.fullName || data.customer?.first_name || "Unknown",
      email: data.customer.email,
      phone: metadata.customer?.phone || "",
      address: metadata.customer?.address || "",
      city: metadata.customer?.city || "",
      state: metadata.customer?.state || "",
      note: metadata.customer?.note || "",
      items: metadata.cartItems || [],
      total: data.amount / 100, // Convert kobo back to Naira
      paymentReference: reference,
      paymentStatus: "success" as const,
      orderStatus: "processing" as const,
      createdAt: Date.now(),
    };

    console.log("💾 [6] Saving order to Firebase for user:", uid);
    
    // Save to Firebase
    await push(ref(realtimeDb, `orders/${uid}`), newOrder);
    
    // Clear cart
    await set(ref(realtimeDb, `carts/${uid}`), null);
    
    console.log("✅ [7] Order saved successfully! Redirecting...");

    return NextResponse.redirect(new URL("/orders?status=success&ref=" + reference, req.url));

  } catch (error) {
    console.error("💥 [8] CRITICAL ERROR in Verify Route:", error);
    return NextResponse.redirect(new URL("/orders?status=error", req.url));
  }
}