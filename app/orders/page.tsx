"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader, Package, Download, ShoppingCart, CheckCircle, Clock, XCircle, Wifi, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
// ✅ Import the base Order type and rename it to BaseOrder
import { subscribeUserOrders, type Order as BaseOrder } from "@/services/orders";
import { setCart } from "@/utils/cart";
import { useSearchParams } from "next/navigation";

// ✅ Extend the base Order type to include your custom 'deliveredAt' field
interface Order extends BaseOrder {
  deliveredAt?: number;
}

const TrackingSteps = ({ status }: { status: string }) => {
  const steps = [
    { key: "processing", label: "Processing", icon: Clock, desc: "Order received" },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle, desc: "Preparing items" },
    { key: "completed", label: "Delivered", icon: MapPin, desc: "Goods received" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-4 py-3 rounded-xl w-fit mt-4">
        <XCircle size={20} />
        <span>This order has been cancelled</span>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between w-full max-w-lg mt-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        
        return (
          <div key={step.key} className="flex flex-col items-center relative flex-1">
            {index < steps.length - 1 && (
              <div className={`absolute top-5 left-1/2 w-full h-1 -z-0 transition-colors duration-500 ${
                index < currentStepIndex ? "bg-green-600" : "bg-gray-200"
              }`} />
            )}
            
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 z-10 ${
              isActive 
                ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200" 
                : "bg-white border-gray-300 text-gray-400"
            }`}>
              <Icon size={20} />
            </div>
            
            <div className="text-center mt-3 px-2">
              <span className={`block text-sm font-bold transition-colors ${
                isActive ? "text-gray-900" : "text-gray-400"
              }`}>
                {step.label}
              </span>
              <span className={`block text-xs mt-1 transition-colors ${
                isCurrent ? "text-green-600 font-medium" : "text-gray-500"
              }`}>
                {step.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  // ✅ Now uses the extended Order type
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      alert("🎉 Payment successful! Your order is now being processed.");
    } else if (status === "failed") {
      alert("❌ Payment verification failed. Please contact support.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setOrders([]);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserOrders(user.uid, (liveOrders) => {
      // Cast to Order[] to satisfy the extended type
      setOrders(liveOrders as Order[]);
      setLoading(false);
    });

    return () => { unsubscribe(); };
  }, [user?.uid]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDownloadReceipt = (order: Order) => {
    const receiptContent = `
==================================================
       BISOYIN CONFECTIONERY & CATERING
==================================================
                  OFFICIAL RECEIPT
==================================================
Order ID:      ${order.id || "N/A"}
Date:          ${formatDate(order.createdAt)}
Delivered:     ${order.deliveredAt ? formatDate(order.deliveredAt) : "Pending"}
Payment Ref:   ${order.paymentReference || "N/A"}
--------------------------------------------------
CUSTOMER DETAILS
Name:          ${order.customerName}
Phone:         ${order.phone}
Address:       ${order.address}, ${order.city}, ${order.state}
--------------------------------------------------
ORDER ITEMS
${order.items.map((item: any) => 
  `${item.name.padEnd(30)} x${item.quantity.toString().padStart(2)} = ₦${(item.price * item.quantity).toLocaleString()}`
).join("\n")}
--------------------------------------------------
TOTAL AMOUNT:                ₦${order.total.toLocaleString()}
Order Status:   ${order.orderStatus.toUpperCase()}
==================================================
    `;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = `Receipt-${order.id || "order"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  const handleOrderAgain = async (order: Order) => {
    try {
      const cartItems = order.items.map((item: any) => ({
        id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image,
      }));
      await setCart(cartItems);
      window.location.href = "/cart";
    } catch (err) {
      alert("Could not add items to cart. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <Loader className="animate-spin text-orange-600" size={40} />
        <p className="text-gray-600 mt-4">Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-600 flex items-center gap-2">
              Track your orders in real-time.
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Wifi size={12} className="animate-pulse" /> Live
              </span>
            </p>
          </div>
          <Link href="/menu" className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 flex items-center gap-2 w-fit">
            <ShoppingCart size={18} /> Order More
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-2xl font-bold text-gray-900">No Orders Yet</h2>
            <Link href="/menu" className="mt-8 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-white p-8 shadow-sm overflow-hidden border border-gray-100">
                
                {/* DELIVERY CONFIRMATION BANNER */}
                {order.orderStatus === "completed" && order.deliveredAt && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800">
                    <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-bold">Successfully Delivered!</p>
                      <p className="text-sm text-green-700">Your goods were received on {formatDate(order.deliveredAt)}.</p>
                    </div>
                  </div>
                )}

                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-gray-100 pb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">Order #{(order.id || "UNKNOWN").slice(-8).toUpperCase()}</h2>
                    <p className="mt-1 text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                    <TrackingSteps status={order.orderStatus} />
                  </div>
                  <div className="text-right min-w-[150px]">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <span className="text-3xl font-bold text-orange-600">₦{order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-8 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Order Items</h3>
                  {order.items.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-gray-400"><Package size={20} /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</p>
                      </div>
                      <p className="font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                  <button onClick={() => handleDownloadReceipt(order)} className="rounded-xl border border-orange-600 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 flex items-center gap-2">
                    <Download size={18} /> Download Receipt
                  </button>
                  <button onClick={() => handleOrderAgain(order)} className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 flex items-center gap-2">
                    <ShoppingCart size={18} /> Order Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
