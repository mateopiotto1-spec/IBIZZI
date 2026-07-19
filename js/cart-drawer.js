/* ============================================================
   IBIZZI · cart-drawer.js
   UI del drawer lateral. Se abre al agregar producto.
   ============================================================ */

import { qs, formatPrice, lockScroll, unlockScroll, bus } from './utils.js';
import { getCart, subtotal, updateQty, removeItem, makeKey } from './cart.js';

let recommendations = [];

export function openCartDrawer() {
  const drawer = qs('#cart-drawer');
  const overlay = qs('#overlay');
  if (!drawer) return;
  render();
  drawer.classList.add('is-open');
  overlay?.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  lockScroll();
}

export function closeCartDrawer() {
  const drawer = qs('#cart-drawer');
  const overlay = qs('#overlay');
  if (!drawer) return;
  drawer.classList.remove('is-open');
  overlay?.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  unlockScroll();
}

function render() {
  const body = qs('#cart-drawer-body');
  const footer = qs('#cart-drawer-footer');
  const subtotalEl = qs('#cart-drawer-subtotal');
  const cart = getCart();
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <p class="text-secondary">Todavía no agregaste productos.</p>
        <a href="products.html" class="btn btn-secondary btn-sm" style="margin-top:1rem;">EXPLORAR PRODUCTOS</a>
      </div>`;
    footer?.setAttribute('hidden', '');
    return;
  }

  body.innerHTML = `
    <ul class="cart-items">
      ${cart.map(item => cartItemHTML(item)).join('')}
    </ul>
    ${recommendations.length ? completeYourOrderHTML() : ''}
  `;

  footer?.removeAttribute('hidden');
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal());

  wireItemActions();
}

function cartItemHTML(item) {
  const key = makeKey(item);
  return `
    <li class="cart-item" data-key="${key}">
      <a href="product.html?slug=${item.slug}" class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </a>
      <div class="cart-item-info">
        <a href="product.html?slug=${item.slug}" class="cart-item-name">${item.name}</a>
        <span class="cart-item-brand">${item.brand}</span>
        <div class="cart-item-meta">
          ${item.size ? `<span>Talle: ${item.size}</span>` : ''}
          ${item.color ? `<span>·</span><span>${item.color}</span>` : ''}
        </div>
        <div class="cart-item-bottom">
          <div class="qty-picker" role="group" aria-label="Cantidad">
            <button type="button" class="qty-btn" data-act="dec" aria-label="Disminuir">−</button>
            <span class="qty-value" aria-live="polite">${item.qty}</span>
            <button type="button" class="qty-btn" data-act="inc" aria-label="Aumentar">+</button>
          </div>
          <strong class="cart-item-price">${formatPrice(item.price * item.qty)}</strong>
        </div>
      </div>
      <button type="button" class="cart-item-remove" data-act="remove" aria-label="Eliminar">
        <svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6l-12 12"/></svg>
      </button>
    </li>`;
}

function completeYourOrderHTML() {
  return `
    <div class="cart-complete">
      <h4 class="cart-complete-title">Completá tu compra</h4>
      <div class="cart-complete-list">
        ${recommendations.slice(0, 3).map(p => `
          <a href="product.html?slug=${p.slug}" class="cart-complete-item">
            <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
            <div>
              <span class="cart-complete-name">${p.name}</span>
              <span class="cart-complete-price">${formatPrice(p.price, p.currency)}</span>
            </div>
          </a>`).join('')}
      </div>
    </div>`;
}

function wireItemActions() {
  document.querySelectorAll('.cart-item').forEach(li => {
    const key = li.dataset.key;
    const qtyValue = li.querySelector('.qty-value');
    li.querySelector('[data-act="inc"]')?.addEventListener('click', () => {
      const q = parseInt(qtyValue.textContent, 10) + 1;
      updateQty(key, q);
    });
    li.querySelector('[data-act="dec"]')?.addEventListener('click', () => {
      const q = parseInt(qtyValue.textContent, 10) - 1;
      updateQty(key, q);
    });
    li.querySelector('[data-act="remove"]')?.addEventListener('click', () => {
      removeItem(key);
    });
  });
}

export function setDrawerRecommendations(products) {
  recommendations = products;
}

export function initCartDrawer() {
  const closeBtn = qs('#cart-drawer-close');
  const overlay = qs('#overlay');
  closeBtn?.addEventListener('click', closeCartDrawer);
  overlay?.addEventListener('click', closeCartDrawer);

  bus.on('cart:updated', () => {
    render();
  });

  // Abrir automáticamente al agregar (no en la carga inicial)
  let firstUpdate = true;
  bus.on('cart:updated', () => {
    if (firstUpdate) { firstUpdate = false; return; }
    openCartDrawer();
  });
}
