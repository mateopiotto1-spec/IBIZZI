/* ============================================================
   IBIZZI · products.js
   Tarjeta de producto reutilizable + renderers de grillas.
   ============================================================ */

import { qs, qsa, fetchJSON, formatPrice, calcDiscount } from './utils.js';
import { addItem } from './cart.js';
import { toggleFavorite, isFavorite } from './favorites.js';

const DATA_URL = 'data/products.json';

let _products = null;

/** Carga (o reutiliza caché) el array de productos. */
export async function loadProducts() {
  if (_products) return _products;
  _products = await fetchJSON(DATA_URL);
  return _products;
}

/* ---------- Tarjeta ---------- */

export function productCardHTML(product) {
  const discount = product.discount || calcDiscount(product.price, product.oldPrice);
  const outOfStock = product.stock <= 0 || product.status === 'out_of_stock';
  const hasVariants = (product.sizes?.length > 1) || (product.colors?.length > 1);
  const second = product.images[1] || product.images[0];
  const fav = isFavorite(product.id);

  return `
    <article class="product-card ${outOfStock ? 'is-sold' : ''}" data-product-id="${product.id}">
      <a href="product.html?slug=${product.slug}" class="product-card-media" aria-label="${product.name}">
        <img class="product-card-img product-card-img-1" src="${product.images[0]}" alt="${product.name}" loading="lazy">
        <img class="product-card-img product-card-img-2" src="${second}" alt="" loading="lazy" aria-hidden="true">

        <div class="product-card-badges">
          ${product.new ? '<span class="label label-new">Nuevo</span>' : ''}
          ${discount > 0 ? `<span class="label label-sale">-${discount}%</span>` : ''}
          ${outOfStock ? '<span class="label label-sold">Agotado</span>' : ''}
        </div>

        <button class="product-card-fav ${fav ? 'is-active' : ''}" type="button" aria-label="Guardar en favoritos" data-fav="${product.id}">
          <svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z"
              fill="${fav ? 'currentColor' : 'none'}"/>
          </svg>
        </button>
      </a>

      <div class="product-card-body">
        <span class="product-card-brand">${product.brand}</span>
        <a href="product.html?slug=${product.slug}" class="product-card-name">${product.name}</a>
        <div class="product-card-prices">
          ${product.oldPrice ? `<span class="product-card-old">${formatPrice(product.oldPrice, product.currency)}</span>` : ''}
          <span class="product-card-price">${formatPrice(product.price, product.currency)}</span>
        </div>
        <div class="product-card-actions">
          <a href="product.html?slug=${product.slug}" class="btn btn-secondary btn-sm btn-block">Ver producto</a>
          ${!hasVariants && !outOfStock
            ? `<button class="btn btn-primary btn-sm btn-block product-card-add" data-add="${product.id}">Agregar</button>`
            : ''}
        </div>
      </div>
    </article>
  `;
}

/** Renderiza array de productos en un contenedor de grilla. */
export function renderGrid(container, products) {
  if (!container) return;
  if (!products.length) {
    container.innerHTML = `<p class="text-muted text-center" style="grid-column:1/-1;padding:2rem 0;">No hay productos para mostrar.</p>`;
    return;
  }
  container.innerHTML = products.map(productCardHTML).join('');
  wireCardActions(container);
}

/** Wireup para botones favoritos y agregar-al-carrito. */
export function wireCardActions(scope = document) {
  qsa('[data-fav]', scope).forEach(btn => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(btn.dataset.fav);
      const active = toggleFavorite(id);
      btn.classList.toggle('is-active', active);
      const svgPath = btn.querySelector('svg path');
      if (svgPath) svgPath.setAttribute('fill', active ? 'currentColor' : 'none');
    });
  });

  qsa('[data-add]', scope).forEach(btn => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(btn.dataset.add);
      const products = await loadProducts();
      const product = products.find(p => p.id === id);
      if (!product) return;
      addItem(product, {
        qty: 1,
        size: product.sizes?.[0] || null,
        color: product.colors?.[0]?.name || null
      });
      // Feedback visual breve
      btn.textContent = 'Agregado';
      setTimeout(() => (btn.textContent = 'Agregar'), 1200);
    });
  });
}

/* ---------- Filtros de utilidad ---------- */

export function filterFeatured(products) {
  return products.filter(p => p.featured);
}
export function filterByCategory(products, category) {
  if (!category) return products;
  const c = category.toLowerCase();
  return products.filter(p => p.category.toLowerCase() === c);
}
export function filterNew(products) {
  return products.filter(p => p.new);
}
export function filterSale(products) {
  return products.filter(p => (p.discount && p.discount > 0) || (p.oldPrice && p.oldPrice > p.price));
}

/* ---------- Home sections ---------- */

export async function renderHomeSections() {
  try {
    const products = await loadProducts();

    // Destacados
    renderGrid(qs('#home-featured'), filterFeatured(products).slice(0, 8));

    // Relojes
    renderGrid(qs('#home-watches'), filterByCategory(products, 'Relojes'));

    // Zuecos Nike Mind
    renderGrid(qs('#home-sneakers'), filterByCategory(products, 'Zuecos Nike Mind'));

  } catch (err) {
    console.error('Error cargando productos:', err);
  }
}
