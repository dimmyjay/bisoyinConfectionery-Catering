"use client";

import { useEffect, useState } from "react";
import { Eye, CheckCircle, Truck, XCircle, Search, Loader } from "lucide-react";
import { getData, updateData } from "@/firebase/database";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
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
  deliveredAt?: number; // ✅ Added to track delivery time
  note?: string;
  createdAt?: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await getData("orders");
        
        if (!ordersData) {
          setOrders([]);
          setFilteredOrders([]);
          setLoading(false);
          return;
        }

        const ordersList: Order[] = [];
        
        // Handle nested structure: orders/{userId}/{orderId}
        Object.entries(ordersData).forEach(([userId, userOrders]: [string, any]) => {
          if (typeof userOrders === "object" && userOrders !== null) {
            Object.entries(userOrders).forEach(([orderId, orderDetails]: [string, any]) => {
              ordersList.push({
                id: orderId,
                userId: userId,
                ...orderDetails,
              });
            });
          }
        });

        const sortedOrders = ordersList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        order.email.toLowerCase().includes(query.toLowerCase()) ||
        order.phone.includes(query)
    );
    setFilteredOrders(filtered);
  };

  // ✅ UPDATED: Records the exact time when marked as "completed"
  const handleUpdateStatus = async (
    orderId: string,
    userId: string,
    newStatus: Order["orderStatus"]
  ) => {
    setUpdating(orderId);
    try {
      const updates: any = { orderStatus: newStatus };
      
      // If the admin marks it as completed, save the current timestamp
      if (newStatus === "completed") {
        updates.deliveredAt = Date.now();
      }

      const path = userId === "unknown" ? `orders/${orderId}` : `orders/${userId}/${orderId}`;
      await updateData(path, updates);

      // Update local state immediately for smooth UI
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o)));
      setFilteredOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o)));
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-orange-600" size={40} />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-2 text-gray-600">
            View and manage all customer orders.
            <span className="ml-2 font-semibold text-gray-900">({filteredOrders.length} total)</span>
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order ID, customer name, email, or phone..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-orange-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Payment</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-5 font-semibold">{order.id.slice(0, 8).toUpperCase()}...</td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </td>
                    <td className="px-6 py-5">{order.phone}</td>
                    <td className="px-6 py-5 font-semibold">₦{order.total.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus === "success" ? "Paid" : order.paymentStatus === "pending" ? "Pending" : "Failed"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => handleUpdateStatus(order.id, order.userId, "confirmed")} 
                          className="rounded-lg bg-blue-100 p-3 text-blue-600 hover:bg-blue-200 transition disabled:opacity-50" 
                          title="Mark as Confirmed"
                          disabled={updating === order.id || order.orderStatus === "confirmed" || order.orderStatus === "completed" || order.orderStatus === "cancelled"}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(order.id, order.userId, "completed")} 
                          className="rounded-lg bg-green-100 p-3 text-green-600 hover:bg-green-200 transition disabled:opacity-50" 
                          title="Mark as Completed (Delivered)"
                          disabled={updating === order.id || order.orderStatus === "completed" || order.orderStatus === "cancelled"}
                        >
                          <Truck size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(order.id, order.userId, "cancelled")} 
                          className="rounded-lg bg-red-100 p-3 text-red-600 hover:bg-red-200 transition disabled:opacity-50" 
                          title="Cancel Order"
                          disabled={updating === order.id || order.orderStatus === "cancelled"}
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-12 shadow-sm text-center">
            <Search className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">{searchQuery ? "No orders found matching your search." : "No orders yet."}</p>
          </div>
        )}
      </div>
    </main>
  );
}