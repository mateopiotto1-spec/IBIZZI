// ============================================================
//  SCRIPT.JS — Lógica principal de la tienda
// ============================================================

const state = {
  currentPage: 'inicio',
  searchQuery: '',
  filters: {
    category: '',
    subcategory: '',
    size: '',
    status: ''
  },
  selectedProduct: null,
  selectedSize: null,
  selectedImageIndex: 0
};

/* ============================================================
   ELEMENTOS DOM
   ============================================================ */
const menuBtn        = document.getElementById('menuBtn');
const navOverlay     = document.getElementById('navOverlay');
const navBackdrop    = document.getElementById('navBackdrop');
const searchToggle   = document.getElementById('searchToggle');
const searchWrapper  = document.getElementById('searchWrapper');
const searchInput    = document.getElementById('searchInput');
const searchClear    = document.getElementById('searchClear');
const filtersToggle  = document.getElementById('filtersToggle');
const filtersPanel   = document.getElementById('filtersPanel');
const productsGrid   = document.getElementById('productsGrid');
const productCount   = document.getElementById('productCount');
const filterCategory = document.getElementById('filterCategory');
const filterSubcat   = document.getElementById('filterSubcat');
const filterSize     = document.getElementById('filterSize');
const filterStatus   = document.getElementById('filterStatus');
const filtersReset   = document.getElementById('filtersReset');
const scrollTopBtn   = document.getElementById('scrollTop');
const navLinks       = document.querySelectorAll('[data-nav]');
const pageSections   = document.querySelectorAll('.page-section');
const modalOverlay   = document.getElementById('productModal');
const modalBackdrop  = document.getElementById('modalBackdrop');
const modalClose     = document.getElementById('modalClose');

const ropaSubmenuToggle = document.getElementById('ropaSubmenuToggle');
const ropaSubmenuItem   = document.querySelector('.nav-item-with-submenu');
const submenuLinks      = document.querySelectorAll('[data-category][data-subcategory]');

/* ============================================================
   UTILIDADES
   ============================================================ */
const formatPrice = (n) =>
  '$\u00A0' + n.toLocaleString('es-AR', { minimumFractionDigits: 0 });

const categoryLabel = (cat, subcat) => {
  const labels = {
    ropa: 'Ropa',
    calzados: 'Calzados',
    gorras: 'Gorras',
    accesorios: 'Accesorios',
    remeras: 'Remeras',
    "remeras-manga-larga": "Remeras manga larga",
    buzos: 'Buzos',
  };

  let out = labels[cat] || cat;
  if (subcat) out += ' — ' + (labels[subcat] || subcat);
  return out;
};

/* ============================================================
   NAVEGACIÓN / PÁGINAS
   ============================================================ */
function navigateTo(page) {
  state.currentPage = page;

  pageSections.forEach(s => s.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.nav === page);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  closeMenu();
}

/* ============================================================
   MENÚ HAMBURGUESA
   ============================================================ */
function openMenu() {
  menuBtn.classList.add('active');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuBtn.classList.remove('active');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';

  if (ropaSubmenuItem) {
    ropaSubmenuItem.classList.remove('open');
  }
  if (ropaSubmenuToggle) {
    ropaSubmenuToggle.setAttribute('aria-expanded', 'false');
  }
}

function toggleMenu() {
  if (navOverlay.classList.contains('open')) closeMenu();
  else openMenu();
}

menuBtn.addEventListener('click', toggleMenu);
navBackdrop.addEventListener('click', closeMenu);

if (ropaSubmenuToggle && ropaSubmenuItem) {
  ropaSubmenuToggle.addEventListener('click', () => {
    const isOpen = ropaSubmenuItem.classList.toggle('open');
    ropaSubmenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.nav;
    navigateTo(page);

    if (['tienda', 'ropa', 'calzados', 'gorras', 'accesorios'].includes(page)) {
      navigateTo('tienda');

      if (page !== 'tienda') {
        filterCategory.value = page;
        state.filters.category = page;
        updateSubcategoryOptions();
        renderProducts();
      } else {
        resetFilters();
        renderProducts();
      }
    }
  });
});

submenuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const category = link.dataset.category;
    const subcategory = link.dataset.subcategory;

    navigateTo('tienda');

    filterCategory.value = category;
    state.filters.category = category;

    updateSubcategoryOptions();

    filterSubcat.value = subcategory;
    state.filters.subcategory = subcategory;

    renderProducts();
    closeMenu();
  });
});

/* ============================================================
   BARRA DE BÚSQUEDA
   ============================================================ */
searchToggle.addEventListener('click', () => {
  const open = searchWrapper.classList.toggle('open');
  if (open) {
    setTimeout(() => searchInput.focus(), 300);
  }
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  state.searchQuery = q;
  searchClear.classList.toggle('visible', q.length > 0);

  if (q.length > 0 && state.currentPage !== 'tienda') {
    navigateTo('tienda');
  }
  renderProducts();
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  state.searchQuery = '';
  searchClear.classList.remove('visible');
  searchInput.focus();
  renderProducts();
});

/* ============================================================
   FILTROS
   ============================================================ */
filtersToggle.addEventListener('click', () => {
  const open = filtersPanel.classList.toggle('open');
  filtersToggle.classList.toggle('active', open);
});

function updateSubcategoryOptions() {
  const cat = state.filters.category;
  const subcatGroup = filterSubcat.closest('.filter-group');

  if (cat === 'ropa') {
    subcatGroup.style.display = '';
  } else {
    subcatGroup.style.display = 'none';
    filterSubcat.value = '';
    state.filters.subcategory = '';
  }
}

filterCategory.addEventListener('change', () => {
  state.filters.category = filterCategory.value;
  updateSubcategoryOptions();
  renderProducts();
});

filterSubcat.addEventListener('change', () => {
  state.filters.subcategory = filterSubcat.value;
  renderProducts();
});

filterSize.addEventListener('change', () => {
  state.filters.size = filterSize.value;
  renderProducts();
});

filterStatus.addEventListener('change', () => {
  state.filters.status = filterStatus.value;
  renderProducts();
});

filtersReset.addEventListener('click', resetFilters);

function resetFilters() {
  state.filters = { category: '', subcategory: '', size: '', status: '' };
  state.searchQuery = '';
  filterCategory.value = '';
  filterSubcat.value = '';
  filterSize.value = '';
  filterStatus.value = '';
  searchInput.value = '';
  searchClear.classList.remove('visible');
  updateSubcategoryOptions();
  renderProducts();
}

/* ============================================================
   FILTRAR PRODUCTOS
   ============================================================ */
function filterProducts() {
  return products.filter(p => {
    const { category, subcategory, size, status } = state.filters;
    const q = state.searchQuery;

    if (category && p.category !== category) return false;
    if (subcategory && p.subcategory !== subcategory) return false;
    if (status && p.status !== status) return false;
    if (size && !p.sizes.includes(size)) return false;

    if (q) {
      const searchable = [p.name, p.category, p.subcategory, p.description]
        .filter(Boolean).join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });
}

/* ============================================================
   RENDERIZAR PRODUCTOS
   ============================================================ */
function renderProducts() {
  const filtered = filterProducts();
  productCount.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-results">
        <p>No se encontraron productos</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filtered.map(p => createProductCard(p)).join('');

  productsGrid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const product = products.find(p => p.id === id);
      if (product) openModal(product);
    });
  });
}
function createProductCard(p) {
  const isAgotado = p.status === 'agotado';

  const badge = isAgotado
    ? `<span class="product-badge badge-agotado">Agotado</span>`
    : '';

  const dropBadge = p.drop
    ? `<span class="product-badge badge-drop">${p.drop}</span>`
    : '';

  let priceHTML = '';

  if (p.status === 'proximamente') {
    priceHTML = ``;
  } else if (p.oldPrice) {
    priceHTML = `
      <p class="product-price">
        <span style="text-decoration: line-through; opacity: 0.6; font-weight: 300;">
          ${formatPrice(p.oldPrice)}
        </span>
        <span style="margin-left: 8px; font-weight: 600;">
          ${formatPrice(p.price)}
        </span>
      </p>
    `;
  } else {
    priceHTML = `<p class="product-price">${formatPrice(p.price)}</p>`;
  }

  const tagClass = p.tag === '25% OFF'
    ? 'product-badge badge-tag badge-tag--discount'
    : 'product-badge badge-tag';
  const tagBadge = p.tag
    ? `<span class="${tagClass}">${p.tag}</span>`
    : '';
  const sizesHTML = p.sizes.length
    ? `<div class="product-sizes-preview">
        ${p.sizes.slice(0, 5).map(s => `<span class="size-chip">${s}</span>`).join('')}
        ${p.sizes.length > 5 ? `<span class="size-chip">+${p.sizes.length - 5}</span>` : ''}
       </div>`
    : '';

  const subcatLabel = p.subcategory
    ? `${categoryLabel(p.category)} / ${categoryLabel('', p.subcategory).replace(' — ', '')}`
    : categoryLabel(p.category);

  return `
    <article class="product-card" data-id="${p.id}" role="button" tabindex="0">
      <div class="product-img ${isAgotado ? 'agotado' : ''}">
        <div class="product-badges">
          <div class="product-badges__left">${badge}${dropBadge}</div>
          <div class="product-badges__right">${tagBadge}</div>
        </div>
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <p class="product-category">${subcatLabel}</p>
        <h3 class="product-name">${p.name}</h3>
        ${priceHTML}
        ${sizesHTML}
      </div>
    </article>
  `;
}

/* ============================================================
   MODAL DE DETALLE DE PRODUCTO
   ============================================================ */
function openModal(product) {
  state.selectedProduct = product;
  state.selectedSize    = null;
  state.selectedImageIndex = 0;

  renderModal(product);

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  state.selectedProduct = null;
}

modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeMenu();
  }
});

function renderModal(p) {
 const isAgotado      = p.status === 'agotado';
const isProximamente = p.status === 'proximamente';

const statusBadge = {
  stock:   '<span class="modal-status-badge stock">En stock</span>',
  agotado: '<span class="modal-status-badge agotado">Agotado</span>'
}[p.status] || '';

const priceHTML = isProximamente
  ? ``
  : p.oldPrice
    ? `<p class="modal-price">
        <span style="text-decoration: line-through; opacity: 0.6; font-weight: 300;">${formatPrice(p.oldPrice)}</span>
        <span style="margin-left: 8px;">${formatPrice(p.price)}</span>
      </p>`
    : `<p class="modal-price">${formatPrice(p.price)}</p>`;

  const sizesHTML = p.sizes.map((s) =>
    `<button class="modal-size-btn" data-size="${s}">${s}</button>`
  ).join('');

  const galleryThumbsHTML = p.images && p.images.length > 1
    ? p.images.map((img, i) =>
        `<img class="gallery-thumb ${i === 0 ? 'active' : ''}" src="${img}" alt="Vista ${i+1}" data-index="${i}" />`
      ).join('')
    : '';

  const btnClass = (isAgotado || isProximamente) ? 'btn-whatsapp disabled' : 'btn-whatsapp';
  const btnText  = isAgotado ? 'AGOTADO' : isProximamente ? 'PRÓXIMAMENTE DISPONIBLE' : 'LO QUIERO COMPRAR YA';

  const waNote = (isAgotado || isProximamente)
    ? ''
    : `<p class="btn-whatsapp-note">Te contactaremos por WhatsApp</p>`;

  const subcatLabel = p.subcategory
    ? `${categoryLabel(p.category)} / ${categoryLabel(p.subcategory)}`
    : categoryLabel(p.category);
      const colorHTML = p.variants && p.variants.length
  ? `
    <div>
      <p class="modal-sizes-label">Colores</p>
      <div class="modal-colors">
        ${p.variants.map(v => `
          <button
            class="modal-color-btn ${v.color === p.color ? 'selected' : ''}"
            data-slug="${v.slug}"
            title="${v.color}"
            style="background:${v.colorHex};"
          ></button>
        `).join('')}
      </div>
    </div>
  `
  : '';
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-gallery">
      <img id="modalMainImg" class="modal-gallery-main" src="${p.images[0]}" alt="${p.name}" />
      ${p.images.length > 1 ? `<div class="modal-gallery-thumbs">${galleryThumbsHTML}</div>` : ''}
    </div>
    <div class="modal-detail">
      <p class="modal-category">${subcatLabel}</p>
      <h2 class="modal-name">${p.name}</h2>
      ${statusBadge}
      ${priceHTML}

      <div class="modal-divider"></div>

     <div>
  <p class="modal-sizes-label">Talles disponibles</p>
  <div class="modal-sizes">${sizesHTML}</div>
</div>

${colorHTML}

<div class="modal-divider"></div>

      <p class="modal-description">${p.description || ''}</p>

      <div class="modal-shipping">
        <p class="modal-shipping-title">Envíos y entrega</p>
        <div class="modal-shipping-items">
          <p class="modal-shipping-item">Envíos a todo el país</p>
          <p class="modal-shipping-item">Coordiná entrega o retiro</p>
          <p class="modal-shipping-item">Consultá tiempos y costos por WhatsApp</p>
        </div>
      </div>

      <button class="${btnClass}" id="btnWhatsapp" ${(isAgotado || isProximamente) ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        ${btnText}
      </button>
      ${waNote}
    </div>
  `;

  document.querySelectorAll('.modal-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedSize = btn.dataset.size;
    });
  });
document.querySelectorAll('.modal-color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const slug = btn.dataset.slug;
    const variantProduct = products.find(prod => prod.slug === slug);
    if (variantProduct) {
      openModal(variantProduct);
    }
  });
});
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.dataset.index);
      state.selectedImageIndex = index;
      document.getElementById('modalMainImg').src = p.images[index];
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  const btnWA = document.getElementById('btnWhatsapp');
  if (btnWA && !isAgotado && !isProximamente) {
    btnWA.addEventListener('click', () => {
      const sizeText = state.selectedSize ? ` - Talle: ${state.selectedSize}` : '';
    const msg = encodeURIComponent(
  `Hola, estaba navegando en la página IBIZZI y estaría interesado en ${p.name}${sizeText}`
);
      const waNumber = p.whatsapp || WHATSAPP_NUMBER;
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
    });
  }
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   HERO CTA
   ============================================================ */
document.getElementById('heroCta').addEventListener('click', () => {
  navigateTo('tienda');
  setTimeout(() => {
    document.getElementById('page-tienda').scrollIntoView({ behavior: 'smooth' });
  }, 100);
});

/* ============================================================
   INIT
   ============================================================ */
function init() {
  navigateTo('inicio');
  updateSubcategoryOptions();
  renderProducts();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.5s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const observeCards = () => {
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.opacity = '0';
      observer.observe(card);
    });
  };

  window.renderProductsWithAnimation = () => {
    renderProducts();
    setTimeout(observeCards, 50);
  };

  observeCards();
}

document.addEventListener('DOMContentLoaded', init);

if (document.readyState !== 'loading') init();