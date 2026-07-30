// app/api/paystack/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Firebase Realtime Database
import { database } from "@/firebase/config";
import { ref, update } from "firebase/database";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    // Read the raw body
    const rawBody = await req.text();

    // Verify Paystack Signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    const signature = req.headers.get("x-paystack-signature");

    if (!signature || hash !== signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Paystack Signature",
        },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    /**
     * ======================================================
     * Payment Successful
     * ======================================================
     */

    if (event.event === "charge.success") {
      const payment = event.data;

      const metadata = payment.metadata || {};

      const orderId = metadata.orderId;

      if (orderId) {
        await update(ref(database, `orders/${orderId}`), {
          paymentStatus: "Paid",
          orderStatus: "Processing",
          paymentReference: payment.reference,
          amount: payment.amount / 100,
          paidAt: payment.paid_at,
          channel: payment.channel,
          gatewayResponse: payment.gateway_response,
          updatedAt: Date.now(),
        });
      }

      console.log("Payment verified:", payment.reference);
    }

    /**
     * ======================================================
     * Refund
     * ======================================================
     */

    if (event.event === "refund.processed") {
      const refund = event.data;

      console.log("Refund Processed:", refund.reference);
    }

    /**
     * ======================================================
     * Transfer
     * ======================================================
     */

    if (event.event === "transfer.success") {
      console.log("Transfer Successful");
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Webhook Failed",
      },
      {
        status: 500,
      }
    );
  }
}