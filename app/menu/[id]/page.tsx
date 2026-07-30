import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/services/products";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.filter((p) => !!p.id).map((p) => ({ id: p.id as string }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  // Fetch all products once and compute related lists
  const allProducts = await getProducts();

  const excludeCurrent = (p: any) => p.id !== product.id;

  const cakes = allProducts.filter((p) => (p.category ?? "").toLowerCase() === "cakes" && excludeCurrent(p)).slice(0, 4);
  const pastries = allProducts.filter((p) => (p.category ?? "").toLowerCase() === "pastries" && excludeCurrent(p)).slice(0, 4);
  const caterings = allProducts.filter((p) => (p.category ?? "").toLowerCase() === "catering" && excludeCurrent(p)).slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <div className="w-full overflow-hidden rounded-2xl bg-gray-100">
              <div className="relative h-[480px]">
                <Image
                  src={product.image ?? "/images/products/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
                <p className="mt-3 text-gray-600">{product.description}</p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="text-3xl font-bold text-orange-600">
                    ₦{product.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Category: {product.category}</div>
                  <div className="text-sm text-gray-500">In stock: {product.stock ?? 0}</div>
                </div>

                <ul className="mt-6 space-y-2">
                  <li className="text-sm text-gray-700">• Freshly prepared with care</li>
                  <li className="text-sm text-gray-700">• Customizable on request</li>
                  <li className="text-sm text-gray-700">• Fast delivery across the city</li>
                </ul>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
                <AddToCartButton
                  productId={product.id!}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                />

                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 text-gray-700 bg-white hover:shadow"
                >
                  Back to menu
                </Link>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                SKU: <span className="text-gray-600">{product.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related / Category Sections */}
        <section className="mt-10 space-y-12">
          {/* Helper to render a category block */}
          {[
            { key: "cakes", title: "More Cakes", items: cakes, desc: "Explore more of our beautifully crafted cakes." },
            { key: "pastries", title: "Fresh Pastries", items: pastries, desc: "Delicious pastries baked daily." },
            { key: "caterings", title: "Catering Packages", items: caterings, desc: "Full catering packages for every event." },
          ].map((block) => (
            <div key={block.key} className="rounded-2xl bg-white p-6 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{block.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{block.desc}</p>
                </div>

                <Link
                  href={`/menu?category=${encodeURIComponent(block.key.charAt(0).toUpperCase() + block.key.slice(1))}`}
                  className="text-sm font-semibold text-orange-600 hover:underline"
                >
                  View more
                </Link>
              </div>

              <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                {block.items.length > 0 ? (
                  block.items.map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id as string}
                      name={p.name}
                      image={p.image}
                      category={p.category}
                      price={p.price}
                      rating={5}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-gray-500">No items found in this category.</div>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}