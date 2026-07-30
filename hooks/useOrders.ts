// hooks/useOrders.ts

"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Order,
  getOrders,
  getUserOrders,
  subscribeUserOrders,
} from "@/services/orders";

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get Orders (Initial Fetch)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      let data;

      if (userId) {
        data = await getUserOrders(userId);
      } else {
        // Note: getOrders() in your service handles the nested structure for admins
        data = await getOrders();
      }

      setOrders(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // Real-time Orders Listener
  useEffect(() => {
    // If no userId is provided, we can't use subscribeUserOrders effectively 
    // unless you create a global listener in services. 
    // For now, we assume if userId exists, we listen to that user.
    
    if (!userId) {
      setLoading(false);
      return; 
    }

    const unsubscribe = subscribeUserOrders(userId, (liveOrders) => {
      setOrders(liveOrders);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  // Get Single Order
  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  // Filter Orders By Status
  const getOrdersByStatus = (status: Order["orderStatus"]) => {
    return orders.filter((order) => order.orderStatus === status);
  };

  // Order Statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (order) => order.orderStatus === "completed"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "processing"
  ).length;
  const totalSpent = orders.reduce((total, order) => total + order.total, 0);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrderById,
    getOrdersByStatus,
    totalOrders,
    completedOrders,
    pendingOrders,
    totalSpent,
  };
}
