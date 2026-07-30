"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Package,
  Heart,
  User,
  CreditCard,
  ArrowRight,
  Loader,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getUserOrders } from "@/services/orders";

interface Order {
  id: string;
  customerName: string;
  createdAt: number;
  orderStatus: "processing" | "confirmed" | "completed" | "cancelled";
  total: number;
}

export default function DashboardContent() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users to sign-in after auth check completes
  useEffect(() => {
    if (!authLoading && !user) {
      // Use replace so back doesn't go back to protected page
      router.replace("/auth/sign-in");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.uid) return;

    const loadOrders = async () => {
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.uid]);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = orders.slice(0, 2);

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: Package,
      color: "bg-orange-100 text-orange-600",
      href: "/orders",
    },
    {
      title: "Cart Items",
      value: "0",
      icon: ShoppingBag,
      color: "bg-green-100 text-green-600",
      href: "/cart",
    },
    {
      title: "Wishlist",
      value: "0",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      href: "/wishlist",
    },
    {
      title: "Total Spent",
      value: `₦${totalSpent.toLocaleString()}`,
      icon: CreditCard,
      color: "bg-blue-100 text-blue-600",
      href: "/orders",
    },
  ];

  const quickLinks = [
    {
      title: "Browse Menu",
      description: "Explore our delicious meals and pastries.",
      href: "/menu",
    },
    {
      title: "Book Catering",
      description: "Request catering for weddings and events.",
      href: "/catering",
    },
    {
      title: "My Orders",
      description: "Track your previous and current orders.",
      href: "/orders",
    },
    {
      title: "My Profile",
      description: "Manage your account information.",
      href: "/profile",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show loader while auth is checking, orders loading, or while redirecting unauthenticated users
  const shouldShowLoader = authLoading || loading || (!authLoading && !user);

  if (shouldShowLoader) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-orange-600" size={40} />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-4xl font-bold">
            Welcome Back 👋 {profile?.name ? profile.name.split(" ")[0] : ""}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-orange-100">
            Manage your orders, shopping cart, profile, and explore everything
            Bisoyin Confectionery & Catering Services has to offer.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-5 inline-flex rounded-xl p-4 ${stat.color}`}>
                  <Icon size={28} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
                <p className="mt-2 text-gray-600">{stat.title}</p>
              </Link>
            );
          })}
        </div>

        <section className="mt-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">{item.title}</h3>
                  <ArrowRight className="transition group-hover:translate-x-2" />
                </div>
                <p className="mt-4 text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                <User className="text-orange-600" size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name || "User"}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Customer since{" "}
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : "now"}
                </p>
              </div>
            </div>
            <Link
              href="/profile"
              className="rounded-xl bg-orange-600 px-8 py-4 font-semibold text-white transition hover:bg-orange-700"
            >
              Edit Profile
            </Link>
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/orders" className="font-semibold text-orange-600 hover:text-orange-700">
              View All
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 text-left">Order ID</th>
                    <th className="py-4 text-left">Date</th>
                    <th className="py-4 text-left">Status</th>
                    <th className="py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-5 font-mono text-sm">{order.id?.slice(0, 8).toUpperCase()}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-sm capitalize ${getStatusColor(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="text-right font-semibold">₦{order.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 text-gray-400" size={40} />
              <p className="text-gray-600">No orders yet. Start shopping!</p>
              <Link
                href="/menu"
                className="mt-4 inline-block rounded-xl bg-orange-600 px-6 py-2 font-semibold text-white hover:bg-orange-700"
              >
                Browse Menu
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}