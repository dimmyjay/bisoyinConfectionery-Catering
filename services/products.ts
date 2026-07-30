import {
  addData,
  getData,
  updateData,
  deleteData,
  listenToData,
} from "@/firebase/database";

import {
  uploadProductImage,
} from "@/firebase/storage";

/**
 * Product Type
 */
export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  featured?: boolean;
  createdAt?: number;
  updatedAt?: number;
  // optional slug field may exist in DB
  slug?: string;
}

/**
 * Create Product (Admin)
 */
export async function createProduct(
  product: Product,
  image?: File
): Promise<string> {
  try {
    let imageUrl: string = product.image || "";

    if (image instanceof File) {
      imageUrl = await uploadProductImage(image);
    }

    const productData: Omit<Product, "id"> = {
      ...product,
      image: imageUrl,
      createdAt: Date.now(),
    };

    const productId = await addData("products", productData);
    return productId;
  } catch (error) {
    console.error("createProduct failed:", error);
    throw error;
  }
}

/**
 * Get all products
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await getData("products");
    if (!products) return [];

    const items = Object.entries(products as Record<string, any>).map(
      ([id, value]) => ({
        id,
        ...(value as Product),
      })
    );

    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return items;
  } catch (error) {
    console.error("getProducts failed:", error);
    throw error;
  }
}

// Alias for compatibility
export const getAllProducts = getProducts;

/**
 * Helper: slugify string for fallback matching
 */
function toSlug(s: string | undefined | null) {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Get single product (resilient)
 *
 * Tries:
 * 1) Direct lookup by key: /products/{id}
 * 2) Fallback: scan all products and match by product.id, product.slug, or slugified name
 *
 * This makes routes like /menu/pastry-001 work even if your DB keys are push IDs
 * and the human-friendly slug is stored inside the product value.
 */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    // 1) Try direct lookup by key first (fast)
    const product = await getData(`products/${id}`);
    if (product) {
      return { id, ...(product as Product) };
    }

    // 2) Fallback: fetch all products and search by product.id, slug, or name
    const all = await getData("products");
    if (!all) return null;

    for (const [key, value] of Object.entries(all as Record<string, any>)) {
      const p = value as any;

      // match a few possible fields
      if (String(p.id) === String(id) || String(p.slug) === String(id) || String(key) === String(id)) {
        return { id: key, ...(p as Product) };
      }

      // match slugified name (e.g., "premium-birthday-cake")
      if (p.name && toSlug(p.name) === toSlug(id)) {
        return { id: key, ...(p as Product) };
      }
    }

    return null;
  } catch (error) {
    console.error(`getProduct failed (id=${id}):`, error);
    throw error;
  }
}

/**
 * Update product
 */
export async function updateProduct(
  id: string,
  data: Partial<Product>,
  image?: File
): Promise<void> {
  try {
    let updates: Partial<Product> = { ...data };

    if (image instanceof File) {
      const imageUrl = await uploadProductImage(image);
      updates = { ...updates, image: imageUrl };
    }

    updates.updatedAt = Date.now();

    await updateData(`products/${id}`, updates);
  } catch (error) {
    console.error(`updateProduct failed (id=${id}):`, error);
    throw error;
  }
}

/**
 * Delete product
 */
export async function removeProduct(id: string): Promise<void> {
  try {
    await deleteData(`products/${id}`);
  } catch (error) {
    console.error(`removeProduct failed (id=${id}):`, error);
    throw error;
  }
}

/**
 * Real-time listener
 */
export function subscribeProducts(
  callback: (products: Product[]) => void
): () => void {
  const unsubscribe = listenToData("products", (data) => {
    if (!data) {
      callback([]);
      return;
    }

    const products: Product[] = Object.entries(data as Record<string, any>).map(
      ([id, value]) => ({ id, ...(value as Product) })
    );

    products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(products);
  });

  return unsubscribe;
}

/**
 * Get featured products helper
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const all = await getProducts();
    return all.filter((p) => !!p.featured);
  } catch (err) {
    console.error("getFeaturedProducts failed:", err);
    return [];
  }
}