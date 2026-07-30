"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, Loader } from "lucide-react";
import { getProducts, deleteProduct } from "@/services/products";

interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  featured?: boolean;
  createdAt?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch all products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  // Handle delete product
  const handleDeleteProduct = async (productId: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(productId);
    try {
      await deleteProduct(productId);

      // Update local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setFilteredProducts((prev) => prev.filter((p) => p.id !== productId));

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "cake":
        return "bg-pink-100 text-pink-700";
      case "pastry":
        return "bg-purple-100 text-purple-700";
      case "small chops":
        return "bg-orange-100 text-orange-700";
      case "meal":
        return "bg-green-100 text-green-700";
      case "drinks":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock > 20) return "bg-green-100 text-green-700";
    if (stock > 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-orange-600" size={40} />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage all cakes, meals, pastries and catering products.
              <span className="ml-2 font-semibold text-gray-900">
                ({filteredProducts.length} total)
              </span>
            </p>
          </div>

          <Link
            href="/dashboard/products/add"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-semibold text-white transition hover:bg-orange-700"
          >
            <Plus size={20} />
            Add Product
          </Link>

        </div>

        {/* Search */}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="relative">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search by product name, category, or description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />

          </div>

        </div>

        {/* Products */}

        {filteredProducts.length > 0 ? (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            <table className="w-full">

              <thead className="bg-orange-600 text-white">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map((product) => (

                  <tr
                    key={product.id}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-200">

                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full text-gray-400">
                              No image
                            </div>
                          )}

                        </div>

                        <div>

                          <h2 className="font-semibold text-gray-900">
                            {product.name}
                          </h2>

                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getCategoryColor(
                          product.category
                        )}`}
                      >
                        {product.category}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-semibold">
                      ₦{product.price.toLocaleString()}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getStockStatus(
                          product.stock
                        )}`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-3">

                        <Link
                          href={`/dashboard/products/edit/${product.id}`}
                          className="rounded-lg bg-blue-100 p-3 text-blue-600 transition hover:bg-blue-200"
                          title="Edit Product"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() =>
                            handleDeleteProduct(product.id || "")
                          }
                          disabled={deleting === product.id}
                          className="rounded-lg bg-red-100 p-3 text-red-600 transition hover:bg-red-200 disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deleting === product.id ? (
                            <Loader size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
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
            <p className="text-gray-600 mb-6">
              {searchQuery ? "No products found matching your search." : "No products yet."}
            </p>
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              <Plus size={20} />
              Add First Product
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}