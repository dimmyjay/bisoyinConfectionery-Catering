// app/api/paystack/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(req: NextRequest) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY missing");
      return NextResponse.redirect(new URL("/payment/result?status=error&message=config", req.url));
    }

    const url = new URL(req.url);
    const reference = url.searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(new URL("/payment/result?status=failed&message=no_reference", req.url));
    }

    // Verify with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      console.error("Paystack verify failed:", verifyData);
      return NextResponse.redirect(
        new URL(`/payment/result?status=failed&reference=${encodeURIComponent(reference)}&message=${encodeURIComponent(verifyData.message ?? "verify_failed")}`, req.url)
      );
    }

    const status = verifyData?.data?.status ?? "failed";

    if (status === "success") {
      // Optionally: create/mark order paid here using verifyData (recommended).
      return NextResponse.redirect(new URL(`/payment/result?status=success&reference=${encodeURIComponent(reference)}`, req.url));
    } else {
      return NextResponse.redirect(new URL(`/payment/result?status=failed&reference=${encodeURIComponent(reference)}&paystack_status=${encodeURIComponent(status)}`, req.url));
    }
  } catch (err) {
    console.error("Paystack callback error:", err);
    return NextResponse.redirect(new URL(`/payment/result?status=error&message=server_error`, req.url));
  }
}