// utils/cart.ts
import { auth, realtimeDb } from "@/firebase/client";
import { ref, get, set as dbSet } from "firebase/database";

export type CartItemPayload = {
  id?: string | number | null;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
};

export type CartItem = Required<CartItemPayload> & { id: string };

const STORAGE_KEY = "cart";

/** Simple hash for fallback id generation (stable-ish per name) */
function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    // eslint-disable-next-line no-bitwise
    h = (h << 5) - h + s.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    h |= 0;
  }
  return Math.abs(h);
}

/** Normalize payload to CartItem with string id */
function normalizeToCartItem(p: CartItemPayload): CartItem {
  const id = p.id != null ? String(p.id) : `${p.name}-${hashString(p.name)}`;
  return {
    id,
    name: p.name,
    price: Number(p.price ?? 0),
    // ✅ Fallback to empty string to satisfy Required<CartItemPayload>
    image: p.image ?? "", 
    quantity: Math.max(1, Number(p.quantity ?? 1)),
  };
}

/** Local storage helpers */
function readLocal(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: CartItemPayload[] = raw ? JSON.parse(raw) : [];
    return parsed.map(normalizeToCartItem);
  } catch {
    return [];
  }
}

/** Dispatch cart:updated asynchronously (microtask) */
function dispatchCartUpdated(detail: any) {
  try {
    queueMicrotask(() => {
      try {
        window.dispatchEvent(new CustomEvent("cart:updated", { detail }));
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }
}

/** Write local cart and notify (async) */
function writeLocal(items: CartItem[]) {
  try {
    const payload: CartItemPayload[] = items.map(({ id, name, price, image, quantity }) => ({
      id,
      name,
      price,
      image,
      quantity,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    dispatchCartUpdated(payload);
  } catch (e) {
    console.error("Failed to write cart to localStorage", e);
  }
}

/** Merge helper (by id) */
function mergeItems(items: CartItem[], payload: CartItemPayload): CartItem[] {
  const incoming = normalizeToCartItem(payload);
  const idx = items.findIndex((it) => it.id === incoming.id);
  if (idx >= 0) {
    const next = [...items];
    next[idx] = { ...next[idx], quantity: next[idx].quantity + (incoming.quantity ?? 1) };
    return next;
  }
  return [...items, incoming];
}

/** Convert server DB object (map) to CartItem[] */
function mapValToArray(val: any): CartItem[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((it) => normalizeToCartItem(it));
  }
  return Object.values(val).map((it: any) =>
    normalizeToCartItem({
      id: it.id ?? it.key ?? it.name,
      name: it.name,
      price: it.price,
      image: it.image,
      quantity: it.quantity,
    })
  );
}

/** Write cart to server path /carts/{uid} with an object keyed by item.id */
async function writeServerCart(uid: string, items: CartItem[]) {
  const cartRef = ref(realtimeDb, `carts/${uid}`);
  const payload: Record<string, any> = {};
  for (const it of items) {
    payload[it.id] = {
      id: it.id,
      name: it.name,
      price: it.price,
      image: it.image,
      quantity: it.quantity,
    };
  }
  await dbSet(cartRef, payload);
}

/** Read server cart (returns CartItem[]) */
async function readServerCart(uid: string): Promise<CartItem[]> {
  const cartRef = ref(realtimeDb, `carts/${uid}`);
  const snap = await get(cartRef);
  const val = snap.exists() ? snap.val() : null;
  return mapValToArray(val);
}

/**
 * Add an item to cart. If signed in, update the server cart at /carts/{uid};
 * otherwise update localStorage.
 *
 * Returns the updated cart items (array).
 */
export async function addToCart(payload: CartItemPayload): Promise<CartItem[]> {
  const user = auth.currentUser;
  if (user && user.uid) {
    try {
      const current = await readServerCart(user.uid);
      const merged = mergeItems(current, payload);
      await writeServerCart(user.uid, merged);
      dispatchCartUpdated(merged);
      return merged;
    } catch (e) {
      console.error("Failed to update server cart, falling back to local:", e);
      // fallthrough to local
    }
  }

  // Guest/local flow
  const currentLocal = readLocal();
  const merged = mergeItems(currentLocal, payload);
  writeLocal(merged);
  return merged;
}

/** Get cart (server if signed-in, otherwise local) */
export async function getCart(): Promise<CartItem[]> {
  const user = auth.currentUser;
  if (user && user.uid) {
    try {
      return await readServerCart(user.uid);
    } catch (e) {
      console.error("Failed to read server cart, falling back to local:", e);
      return readLocal();
    }
  }
  return readLocal();
}

/** Synchronous helper for UI to read local cart only */
export function getCartLocal(): CartItem[] {
  return readLocal();
}

/** Overwrite cart (server if signed-in, otherwise local) */
export async function setCart(items: CartItemPayload[] | CartItem[]) {
  const normalized = (items as CartItemPayload[]).map(normalizeToCartItem);
  const user = auth.currentUser;
  if (user && user.uid) {
    try {
      await writeServerCart(user.uid, normalized);
      dispatchCartUpdated(normalized);
      return normalized;
    } catch (e) {
      console.error("Failed to write server cart, falling back to local:", e);
    }
  }
  writeLocal(normalized);
  return normalized;
}

/** Update quantity for an item by id (string or numeric). qty must be >= 0; if 0, remove item. */
export async function updateQuantity(id: string | number, qty: number) {
  const idStr = String(id);
  const user = auth.currentUser;
  if (user && user.uid) {
    try {
      const current = await readServerCart(user.uid);
      const updated = current
        .map((it) => (it.id === idStr ? { ...it, quantity: Math.max(0, qty) } : it))
        .filter((it) => it.quantity > 0);
      await writeServerCart(user.uid, updated);
      dispatchCartUpdated(updated);
      return updated;
    } catch (e) {
      console.error("Failed to update server cart, falling back to local:", e);
    }
  }

  const local = readLocal();
  const updatedLocal = local
    .map((it) => (it.id === idStr ? { ...it, quantity: Math.max(0, qty) } : it))
    .filter((it) => it.quantity > 0);
  writeLocal(updatedLocal);
  return updatedLocal;
}

/** Remove an item by id */
export async function removeFromCart(id: string | number) {
  return updateQuantity(id, 0);
}

/** Clear the cart */
export async function clearCart() {
  const user = auth.currentUser;
  if (user && user.uid) {
    try {
      await writeServerCart(user.uid, []);
      dispatchCartUpdated([]);
      return [];
    } catch (e) {
      console.error("Failed to clear server cart, falling back to local:", e);
    }
  }
  writeLocal([]);
  return [];
}

/** Convenience: count and total (reads local version only) */
export function getCartCountLocal(): number {
  const items = readLocal();
  return items.reduce((s, it) => s + it.quantity, 0);
}

export function getCartTotalLocal(): number {
  const items = readLocal();
  return items.reduce((s, it) => s + it.price * it.quantity, 0);
}
