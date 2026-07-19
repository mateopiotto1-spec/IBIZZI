/* ============================================================
   IBIZZI · recommendations.js
   Renderiza "Completá tu look" y "También te puede interesar"
   ============================================================ */

import { qs, formatPrice } from './utils.js';
import { loadProducts, productCardHTML, wireCardActions } from './products.js';
import { setDrawerRecommendations } from './cart-drawer.js';

function findByIds(products, ids) {
  if (!ids?.length) return [];
  return ids
    .map(id => products.find(p => p.id === id))
    .filter(p => p && p.stock > 0);
}

export async function renderRecommendations(product) {
  const products = await loadProducts();

  const complementary = findByIds(products, product.complementaryProducts);
  const recommended   = findByIds(products, product.recommendedProducts);

  const compContainer = qs('#complementary-list');
  const recContainer  = qs('#recommended-list');

  if (compContainer) {
    compContainer.innerHTML = complementary.map(productCardHTML).join('');
    wireCardActions(compContainer);
  }
  if (recContainer) {
    recContainer.innerHTML = recommended.map(productCardHTML).join('');
    wireCardActions(recContainer);
  }

  // Pasamos algunas al cart drawer para el bloque "Completá tu compra"
  setDrawerRecommendations([...complementary, ...recommended].slice(0, 6));
}

/** Carrusel horizontal simple con flechas para desktop. */
export function initCarousel(scrollerSelector) {
  const scroller = qs(scrollerSelector);
  if (!scroller) return;
  const wrapper = scroller.closest('.carousel');
  if (!wrapper) return;
  const prev = wrapper.querySelector('.carousel-prev');
  const next = wrapper.querySelector('.carousel-next');

  const step = () => scroller.clientWidth * 0.8;
  prev?.addEventListener('click', () => scroller.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => scroller.scrollBy({ left:  step(), behavior: 'smooth' }));
}
