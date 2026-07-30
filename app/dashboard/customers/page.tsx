"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Mail, Phone, User, Loader } from "lucide-react";
import { getData } from "@/firebase/database";

interface Customer {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string; // Changed to required string since we default it below
  orders: number;
  totalSpent: number;
  createdAt: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all customers and their order data
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        // Get all users
        const usersData = await getData("users");
        // Get all orders
        const ordersData = await getData("orders");

        if (!usersData) {
          setCustomers([]);
          setLoading(false);
          return;
        }

        // Transform users to customers with order stats
        const customersList = Object.entries(usersData)
          .map(([uid, userData]: any) => {
            // Calculate order stats for this user
            const userOrders = ordersData
              ? Object.values(ordersData).filter(
                  (order: any) => order.userId === uid
                )
              : [];

            const totalSpent = userOrders.reduce(
              (sum: number, order: any) => sum + (order.total || 0),
              0
            );

            return {
              id: `CUS-${uid.slice(0, 8).toUpperCase()}`,
              uid,
              name: userData.name || "Unknown User",
              email: userData.email || "",
              // ✅ Ensure phone is always a string to avoid undefined errors
              phone: userData.phone || "N/A", 
              orders: userOrders.length,
              totalSpent,
              createdAt: userData.createdAt || Date.now(),
            };
          })
          .sort(
            (a, b) => b.createdAt - a.createdAt
          );

        setCustomers(customersList);
        setFilteredCustomers(customersList);
      } catch (error) {
        console.error("Failed to load customers:", error);
        setCustomers([]);
        setFilteredCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = customers.filter((customer) => {
      const lowerQuery = query.toLowerCase();
      return (
        customer.name.toLowerCase().includes(lowerQuery) ||
        customer.email.toLowerCase().includes(lowerQuery) ||
        // ✅ Safe navigation operator (?.) prevents crash if phone is missing
        customer.phone?.toLowerCase().includes(lowerQuery)
      );
    });

    setFilteredCustomers(filtered);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-orange-600" size={40} />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Customers
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage all registered customers.
            <span className="ml-2 font-semibold text-gray-900">
              ({filteredCustomers.length} total)
            </span>
          </p>
        </div>

        {/* Search */}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search customer by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />

          </div>

        </div>

        {/* Customers Table */}

        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">

            <table className="w-full">

              <thead className="bg-orange-600 text-white">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left">
                    Orders
                  </th>

                  <th className="px-6 py-4 text-left">
                    Total Spent
                  </th>

                  <th className="px-6 py-4 text-left">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.map((customer) => (

                  <tr
                    key={customer.uid}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                          <User className="text-orange-600" size={22} />
                        </div>

                        <div>

                          <h2 className="font-semibold text-gray-900">
                            {customer.name}
                          </h2>

                          <p className="text-sm text-gray-500">
                            {customer.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <div className="space-y-2">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={16} />
                          {customer.email}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={16} />
                          {customer.phone}
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5 font-semibold">
                      {customer.orders}
                    </td>

                    <td className="px-6 py-5 font-semibold text-green-600">
                      ₦{customer.totalSpent.toLocaleString()}
                    </td>

                    <td className="px-6 py-5">
                      {formatDate(customer.createdAt)}
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-center">

                        <button
                          className="rounded-lg bg-blue-100 p-3 text-blue-600 transition hover:bg-blue-200"
                          title="View Customer Details"
                        >
                          <Eye size={18} />
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
            <User className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">
              {searchQuery ? "No customers found matching your search." : "No customers yet."}
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
