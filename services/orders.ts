// services/orders.ts

import {
  addData,
  getData,
  updateData,
  listenToData,
  deleteData,
} from "@/firebase/database";

// ===============================
// Order Types
// ===============================

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  items: OrderItem[];
  total: number;
  paymentReference?: string;
  paymentStatus: "pending" | "success" | "failed";
  orderStatus: "processing" | "confirmed" | "completed" | "cancelled";
  note?: string;
  createdAt?: number;
}

// ===============================
// Create Order
// ===============================

export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "paymentStatus" | "orderStatus">
) {
  try {
    const orderId = await addData("orders", {
      ...order,
      paymentStatus: "pending",
      orderStatus: "processing",
      createdAt: Date.now(),
    });
    return orderId;
  } catch (error) {
    console.error("Create order failed:", error);
    throw error;
  }
}

// ===============================
// Get All Orders (Admin)
// ===============================

export async function getOrders() {
  try {
    const rawOrders = await getData("orders");
    if (!rawOrders) return [];

    const allOrders: Order[] = [];
    
    // Handle nested structure: { "userId": { "pushId": { orderData } } }
    Object.entries(rawOrders).forEach(([userId, userOrdersObj]) => {
      if (typeof userOrdersObj === "object" && userOrdersObj !== null) {
        Object.entries(userOrdersObj).forEach(([pushId, orderData]) => {
          allOrders.push({
            id: pushId,
            ...(orderData as any),
          });
        });
      }
    });

    return allOrders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error("Get orders failed:", error);
    throw error;
  }
}

// ===============================
// Get Customer Orders (FIXED)
// ===============================

export async function getUserOrders(userId: string) {
  try {
    console.log("🔍 [getUserOrders] Fetching orders for userId:", userId);
    
    // 1. Fetch directly from the user's specific orders node
    const rawOrders = await getData(`orders/${userId}`);
    
    console.log("📦 [getUserOrders] Raw data from Firebase:", rawOrders);

    if (!rawOrders) {
      console.warn("⚠️ [getUserOrders] No orders found for this user in Firebase.");
      return [];
    }

    // 2. Convert the nested object { "-pushId": { orderData } } into an array
    const ordersArray = Object.entries(rawOrders).map(([pushId, value]) => ({
      id: pushId, // The Firebase push key becomes the order ID
      ...(value as any),
    }));

    console.log("✅ [getUserOrders] Successfully mapped orders:", ordersArray.length);

    // 3. Sort by newest first
    return ordersArray.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
  } catch (error) {
    console.error("❌ [getUserOrders] Get user orders failed:", error);
    throw error;
  }
}

// ===============================
// Get Single Order
// ===============================

export async function getOrder(orderId: string, userId: string) {
  try {
    const order = await getData(`orders/${userId}/${orderId}`);
    if (!order) return null;

    return {
      id: orderId,
      ...order,
    } as Order;
  } catch (error) {
    console.error("Get order failed:", error);
    throw error;
  }
}

// ===============================
// Update Order Status
// ===============================

export async function updateOrderStatus(
  userId: string,
  orderId: string,
  status: Order["orderStatus"]
) {
  try {
    await updateData(`orders/${userId}/${orderId}`, {
      orderStatus: status,
    });
  } catch (error) {
    console.error("Update order status failed:", error);
    throw error;
  }
}

// ===============================
// Update Payment Status
// ===============================

export async function updatePaymentStatus(
  userId: string,
  orderId: string,
  paymentStatus: Order["paymentStatus"],
  reference?: string
) {
  try {
    const updates: any = { paymentStatus };
    if (reference) updates.paymentReference = reference;
    if (paymentStatus === "success") updates.orderStatus = "confirmed";

    await updateData(`orders/${userId}/${orderId}`, updates);
  } catch (error) {
    console.error("Update payment failed:", error);
    throw error;
  }
}

// ===============================
// Delete Order
// ===============================

export async function deleteOrder(userId: string, orderId: string) {
  try {
    if (deleteData) {
      await deleteData(`orders/${userId}/${orderId}`);
    } else {
      const { deleteData: del } = await import("@/firebase/database");
      await del(`orders/${userId}/${orderId}`);
    }
  } catch (error) {
    console.error("Delete order failed:", error);
    throw error;
  }
}

// ===============================
// Real-time User Orders Listener
// ===============================

export function subscribeUserOrders(
  userId: string,
  callback: (orders: Order[]) => void
) {
  return listenToData(`orders/${userId}`, (data) => {
    if (!data) {
      callback([]);
      return;
    }

    const orders = Object.entries(data)
      .map(([pushId, value]) => ({
        id: pushId,
        ...(value as Order),
      }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    callback(orders);
  });
}