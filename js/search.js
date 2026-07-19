/* ============================================================
   IBIZZI · search.js
   Buscador con sugerencias en tiempo real (debounce 200ms)
   ============================================================ */

import { qs, debounce, formatPrice } from './utils.js';
import { loadProducts } from './products.js';

function match(product, q) {
  const hay = [
    product.name, product.brand, product.category,
    product.subcategory, ...(product.tags || [])
  ].join(' ').toLowerCase();
  return hay.includes(q);
}

async function performSearch(query) {
  const box = qs('#search-suggestions');
  if (!box) return;

  if (!query || query.length < 2) {
    box.innerHTML = `
      <p class="text-muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.16em;">
        Sugerencias populares
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem;">
        <a class="label" href="products.html?category=zuecos%20nike%20mind">Zuecos Nike Mind</a>
        <a class="label" href="products.html?category=relojes">Relojes</a>
        <a class="label" href="products.html?filter=new">Nuevos</a>
        <a class="label" href="products.html?filter=sale">Oferta</a>
      </div>`;
    return;
  }

  const products = await loadProducts();
  const q = query.toLowerCase();
  const results = products.filter(p => match(p, q)).slice(0, 5);

  if (!results.length) {
    box.innerHTML = `<p class="text-muted">Sin resultados para "${query}"</p>`;
    return;
  }

  box.innerHTML = results.map(p => `
    <a href="product.html?slug=${p.slug}" class="search-suggestion">
      <img src="${p.images[0]}" alt="" style="width:48px;height:48px;object-fit:cover;">
      <span style="flex:1;">
        <span style="display:block;color:#F5F5F5;">${p.name}</span>
        <span style="font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:.16em;">${p.brand}</span>
      </span>
      <strong>${formatPrice(p.price, p.currency)}</strong>
    </a>`).join('') + `
    <a href="products.html?q=${encodeURIComponent(query)}" class="btn btn-secondary btn-sm btn-block" style="margin-top:1rem;">Ver todos los resultados</a>`;
}

export function initSearch() {
  const input = qs('#search-input');
  if (!input) return;
  const handler = debounce((e) => performSearch(e.target.value), 200);
  input.addEventListener('input', handler);
  // Estado inicial
  performSearch('');
}
