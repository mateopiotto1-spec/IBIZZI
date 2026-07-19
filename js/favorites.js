/* ============================================================
   IBIZZI · favorites.js
   Estado de favoritos. Persistencia en LocalStorage.
   ============================================================ */

import { storage, bus } from './utils.js';

const KEY = 'ibizzi_favorites';

export function getFavorites() {
  return storage.get(KEY, []);
}

export function isFavorite(id) {
  return getFavorites().includes(Number(id));
}

export function toggleFavorite(id) {
  const list = getFavorites();
  const num = Number(id);
  const idx = list.indexOf(num);
  if (idx === -1) list.push(num);
  else list.splice(idx, 1);
  storage.set(KEY, list);
  bus.emit('favorites:updated', { list });
  return list.includes(num);
}

/** Devuelve los productos favoritos filtrando el array completo. */
export function filterFavorites(products) {
  const favs = getFavorites();
  return products.filter(p => favs.includes(p.id));
}
