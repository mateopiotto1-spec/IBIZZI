/* ============================================================
   IBIZZI · cart.js
   Estado del carrito. Persiste en LocalStorage.
   API: getCart, addItem, removeItem, updateQty, clearCart, subtotal
   Emite 'cart:updated' en cada cambio.
   ============================================================ */

import { storage, bus } from './utils.js';

const KEY = 'ibizzi_cart';

/* ---------- Lectura ---------- */

export function getCart() {
  return storage.get(KEY, []);
}

export function getItemCount() {
  return getCart().reduce((sum, i) => sum + (i.qty || 1), 0);
}

export function subtotal() {
  return getCart().reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
}

/* ---------- Modificación ---------- */

function makeKey(item) {
  // Un mismo producto con distinto talle/color = línea distinta.
  return `${item.id}|${item.size || ''}|${item.color || ''}`;
}

export function addItem(product, opts = {}) {
  const qty  = opts.qty ?? 1;
  const size = opts.size ?? null;
  const color = opts.color ?? null;

  const newItem = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.images?.[0] || '',
    size,
    color,
    qty
  };

  const cart = getCart();
  const key = makeKey(newItem);
  const existing = cart.find(i => makeKey(i) === key);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push(newItem);
  }

  storage.set(KEY, cart);
  bus.emit('cart:updated', { cart });
  return cart;
}

export function updateQty(matchKey, qty) {
  const cart = getCart();
  const item = cart.find(i => makeKey(i) === matchKey);
  if (!item) return cart;
  item.qty = Math.max(1, Math.min(99, qty));
  storage.set(KEY, cart);
  bus.emit('cart:updated', { cart });
  return cart;
}

export function removeItem(matchKey) {
  const cart = getCart().filter(i => makeKey(i) !== matchKey);
  storage.set(KEY, cart);
  bus.emit('cart:updated', { cart });
  return cart;
}

export function clearCart() {
  storage.set(KEY, []);
  bus.emit('cart:updated', { cart: [] });
}

/* Se exporta también makeKey para que los componentes puedan
   identificar cada línea del carrito de forma única. */
export { makeKey };
