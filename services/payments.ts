// services/payments.ts

import { updatePaymentStatus } from "./orders";

// ===============================
// Paystack Response Type
// ===============================

export interface PaymentResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    authorization_url: string;
    access_code: string;
  };
}

// ===============================
// Initialize Paystack Payment
// ===============================

export async function initializePayment(
  email: string,
  amount: number,
  metadata?: any
) {
  try {
    const response = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        // Paystack accepts amount in kobo
        amount: amount * 100,
        metadata,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Payment initialization failed");
    }

    return data;
  } catch (error) {
    console.error("Initialize payment error:", error);
    throw error;
  }
}

// ===============================
// Verify Paystack Payment
// ===============================

export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(`/api/paystack/verify?reference=${reference}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Payment verification failed");
    }

    return data;
  } catch (error) {
    console.error("Verify payment error:", error);
    throw error;
  }
}

// ===============================
// Complete Successful Payment
// ===============================

export async function completePayment(
  userId: string, // ✅ Added userId
  orderId: string,
  reference: string
) {
  try {
    await updatePaymentStatus(
      userId,      // ✅ Correctly aligned
      orderId,     // ✅ Correctly aligned
      "success",   // ✅ Correctly aligned
      reference    // ✅ Correctly aligned
    );

    return true;
  } catch (error) {
    console.error("Complete payment error:", error);
    throw error;
  }
}

// ===============================
// Mark Failed Payment
// ===============================

export async function failedPayment(
  userId: string, // ✅ Added userId
  orderId: string,
  reference?: string
) {
  try {
    await updatePaymentStatus(
      userId,      // ✅ Correctly aligned
      orderId,     // ✅ Correctly aligned
      "failed",    // ✅ Correctly aligned
      reference    // ✅ Correctly aligned
    );

    return true;
  } catch (error) {
    console.error("Failed payment update error:", error);
    throw error;
  }
}
