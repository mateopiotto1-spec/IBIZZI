/* ============================================================
   IBIZZI · relojes.js
   Landing de relojes. Autónoma: no importa nada del resto de la
   tienda y no linkea a ninguna otra página.

   El carrito usa su propia clave de LocalStorage a propósito. Si
   compartiera la de la tienda general, acá dentro podrían aparecer
   buzos o zuecos agregados desde otro lado.
   ============================================================ */

const WHATSAPP = '59894990760';       // 094 990 760, formato internacional sin "+"
const CART_KEY = 'ibizzi_relojes_cart';
const MP_OFF = 10;                    // % de descuento pagando con Mercado Pago
                                      // (la transferencia común no tiene descuento)

/* Qué relojes salen arriba, en la fila del hero. Van por slug para que
   el orden no dependa de cómo quede ordenado el JSON. */
const DESTACADOS = [
  'reloj-tissot-prx-negro',
  'reloj-armani-diver-acero',
  'reloj-tommy-hilfiger-dorado',
  'reloj-patek-nautilus-acero'
];

let RELOJES = [];
let marcaActiva = 'todas';
let ultimoFoco = null;   // a dónde devolver el foco al cerrar un panel

/* ============================================================
   Helpers
   ============================================================ */

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

function precio(valor, moneda = 'UYU') {
  if (valor == null) return '';
  try {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency', currency: moneda,
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(valor);
  } catch {
    return `$ ${Math.round(valor).toLocaleString('es-UY')}`;
  }
}

const precioMercadoPago = (v) => Math.round(v * (1 - MP_OFF / 100));

const linkWhatsapp = (msg = '') =>
  `https://wa.me/${WHATSAPP}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

/** Un reloj es "por encargue" si tarda 10 días. El stock 99 del JSON es
 *  un placeholder de "siempre disponible", no una cantidad real. */
const esEncargue = (p) => /10 d[íi]as/i.test(p.deliveryNote || '');

const porcentajeOff = (p) => (p.oldPrice && p.oldPrice > p.price)
  ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
  : 0;

/* ============================================================
   Carrito (estado propio de esta página)
   ============================================================ */

const cart = {
  leer() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  },

  guardar(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); }
    catch (err) { console.warn('[relojes] no se pudo guardar el carrito', err); }
    pintarCarrito();
  },

  agregar(p) {
    const items = cart.leer();
    const existente = items.find((i) => i.id === p.id);

    if (existente) {
      existente.qty = Math.min(99, existente.qty + 1);
    } else {
      items.push({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        image: p.images?.[0] || '',
        encargue: esEncargue(p),
        qty: 1
      });
    }
    cart.guardar(items);
  },

  cambiarCantidad(id, delta) {
    const items = cart.leer();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, Math.min(99, item.qty + delta));
    cart.guardar(items);
  },

  quitar(id) {
    cart.guardar(cart.leer().filter((i) => i.id !== id));
  },

  total()  { return cart.leer().reduce((s, i) => s + i.price * i.qty, 0); },
  unidades() { return cart.leer().reduce((s, i) => s + i.qty, 0); }
};

/* ---------- Mensajes de WhatsApp ---------- */

/** Detalle del carrito, una línea por reloj. Se usa en todos los mensajes. */
function lineasCarrito() {
  return cart.leer().map((i) => {
    const entrega = i.encargue ? ' (por encargue, 10 días)' : ' (en stock)';
    const cantidad = i.qty > 1 ? `${i.qty}× ` : '';
    return `• ${cantidad}${i.name}${entrega} — ${precio(i.price * i.qty)}`;
  });
}

function bloqueTotales() {
  const total = cart.total();
  return [
    `Total: ${precio(total)}`,
    `Con Mercado Pago (${MP_OFF}% OFF): ${precio(precioMercadoPago(total))}`
  ];
}

/** Mensaje del botón de finalizar: es un pedido concreto. */
function mensajePedido() {
  const lineas = lineasCarrito();
  if (!lineas.length) return '¡Hola! Quiero consultar por un reloj.';

  return ['¡Hola! Quiero hacer este pedido:', '', ...lineas, '', ...bloqueTotales()].join('\n');
}

/** Mensaje de los botones de contacto (flotante, footer, header).
 *  Si la persona ya tiene relojes en el carrito, se los adjuntamos:
 *  así no tenés que preguntarle cuáles estaba mirando. */
function mensajeConsulta() {
  const lineas = lineasCarrito();
  if (!lineas.length) return '¡Hola! Me interesa un reloj de la página.';

  const plural = lineas.length > 1 ? 'estos relojes' : 'este reloj';

  return [`¡Hola! Estoy mirando ${plural} y quería consultar:`, '', ...lineas, '', ...bloqueTotales()].join('\n');
}

/** Refresca el href de todos los links de contacto con el carrito actual. */
function actualizarLinksWhatsapp() {
  const href = linkWhatsapp(mensajeConsulta());
  qsa('[data-wa]').forEach((a) => { a.href = href; });
}

/* ============================================================
   Hero
   ============================================================ */

function pintarHero() {
  const cont = qs('#hero-row');
  if (!cont) return;

  // Los destacados que existan, y si falta alguno se completa con el resto.
  const elegidos = DESTACADOS
    .map((slug) => RELOJES.find((p) => p.slug === slug))
    .filter(Boolean);

  for (const p of RELOJES) {
    if (elegidos.length >= 4) break;
    if (!elegidos.includes(p)) elegidos.push(p);
  }

  cont.innerHTML = elegidos.slice(0, 4).map((p) => `
    <button class="hero__item" type="button" data-ver="${p.id}">
      <figure><img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="eager" decoding="async"></figure>
      <span class="hero__label">${esc(p.brand)}</span>
    </button>
  `).join('');
}

/* ============================================================
   Filtros y orden
   ============================================================ */

function pintarChips() {
  const cont = qs('#chips');
  if (!cont) return;

  const marcas = [...new Set(RELOJES.map((p) => p.brand))].sort();
  const items = [{ id: 'todas', label: 'Todas' }, ...marcas.map((m) => ({ id: m, label: m }))];

  cont.innerHTML = items.map(({ id, label }) => `
    <button class="chip" type="button" data-marca="${esc(id)}" aria-pressed="${id === marcaActiva}">${esc(label)}</button>
  `).join('');
}

function ordenar(lista) {
  const modo = qs('#sort')?.value || 'destacados';
  const copia = [...lista];

  switch (modo) {
    case 'precio-asc':  return copia.sort((a, b) => a.price - b.price);
    case 'precio-desc': return copia.sort((a, b) => b.price - a.price);
    case 'nombre':      return copia.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    default:
      // Destacados primero, después el resto tal como viene del JSON.
      return copia.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
}

/* ============================================================
   Grillas
   ============================================================ */

function card(p) {
  const encargue = esEncargue(p);
  const off = porcentajeOff(p);

  const foto2 = p.images[1]
    ? `<img src="${esc(p.images[1])}" alt="" aria-hidden="true" loading="lazy" decoding="async">`
    : '';

  const etiqueta = encargue
    ? 'Por encargue · 10 días'
    : (p.stock <= 3 ? `Últimas ${p.stock} unidades` : 'En stock · llega mañana');

  return `
    <li>
      <article class="card">
        <div class="card__media">
          ${off ? `<span class="card__off">${off}% OFF</span>` : ''}
          <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" decoding="async">
          ${foto2}
        </div>
        <div class="card__body">
          <button class="card__link" type="button" data-ver="${p.id}">
            <span class="visually-hidden">Ver ${esc(p.name)}</span>
          </button>
          <span class="card__brand">${esc(p.brand)}</span>
          <h3 class="card__name">${esc(p.name)}</h3>
          <div class="card__prices">
            <span class="card__price">${precio(p.price, p.currency)}</span>
            ${p.oldPrice ? `<span class="card__old">${precio(p.oldPrice, p.currency)}</span>` : ''}
          </div>
          <span class="card__stock" data-kind="${encargue ? 'encargue' : 'stock'}">
            <i class="card__dot"></i>${esc(etiqueta)}
          </span>
          <button class="card__add" type="button" data-add="${p.id}">Agregar al carrito</button>
        </div>
      </article>
    </li>
  `;
}

function pintarGrillas() {
  const visibles = marcaActiva === 'todas'
    ? RELOJES
    : RELOJES.filter((p) => p.brand === marcaActiva);

  const grupos = [
    { lista: visibles.filter((p) => !esEncargue(p)), grid: '#grid-stock',    cuenta: '#stock-count',    vacio: 'No hay relojes de esta marca en stock. Miralos por encargue más abajo.' },
    { lista: visibles.filter(esEncargue),            grid: '#grid-encargue', cuenta: '#encargue-count', vacio: 'No hay relojes de esta marca por encargue.' }
  ];

  for (const { lista, grid, cuenta, vacio } of grupos) {
    const cont = qs(grid);
    if (!cont) continue;

    const ordenada = ordenar(lista);
    cont.innerHTML = ordenada.length
      ? ordenada.map(card).join('')
      : `<li class="empty">${vacio}</li>`;

    const n = qs(cuenta);
    if (n) n.textContent = ordenada.length ? `${ordenada.length} ${ordenada.length === 1 ? 'modelo' : 'modelos'}` : '';
  }
}

/* ============================================================
   Paneles (detalle y carrito)
   ============================================================ */

function abrirPanel(el) {
  ultimoFoco = document.activeElement;
  el.dataset.open = 'true';
  el.setAttribute('aria-hidden', 'false');
  qs('#ov').dataset.open = 'true';
  document.body.dataset.locked = 'true';
}

function cerrarPaneles() {
  for (const sel of ['#dw', '#md']) {
    const el = qs(sel);
    if (!el) continue;
    el.dataset.open = 'false';
    el.setAttribute('aria-hidden', 'true');
  }
  qs('#ov').dataset.open = 'false';
  document.body.dataset.locked = 'false';
  ultimoFoco?.focus?.();
  ultimoFoco = null;
}

const hayPanelAbierto = () =>
  qs('#dw')?.dataset.open === 'true' || qs('#md')?.dataset.open === 'true';

/* ---------- Detalle del reloj ---------- */

function abrirDetalle(id) {
  const p = RELOJES.find((x) => x.id === Number(id));
  if (!p) return;

  const encargue = esEncargue(p);
  const off = porcentajeOff(p);

  const miniaturas = p.images.length > 1
    ? `<div class="md__thumbs">${p.images.map((img, i) => `
        <button class="md__thumb" type="button" data-foto="${esc(img)}" aria-pressed="${i === 0}">
          <img src="${esc(img)}" alt="Foto ${i + 1} de ${esc(p.name)}" loading="lazy">
        </button>`).join('')}</div>`
    : '';

  const specs = (p.specifications || []).length
    ? `<dl class="md__specs">${p.specifications.map((s) => `
        <div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>`
    : '';

  const entrega = encargue
    ? 'Lo pedimos para vos. Llega en 10 días y coordinamos la entrega por WhatsApp.'
    : 'Lo tenemos acá. Comprás hoy y te llega mañana.';

  qs('#md-grid').innerHTML = `
    <div class="md__media">
      <img id="md-foto" src="${esc(p.images[0])}" alt="${esc(p.name)}">
      ${off ? `<span class="card__off">${off}% OFF</span>` : ''}
    </div>

    <div class="md__info">
      <span class="card__brand">${esc(p.brand)}</span>
      <h2 class="md__name" id="md-name">${esc(p.name)}</h2>

      <div class="card__prices">
        <span class="md__price">${precio(p.price, p.currency)}</span>
        ${p.oldPrice ? `<span class="card__old">${precio(p.oldPrice, p.currency)}</span>` : ''}
      </div>
      <p class="md__mp">${precio(precioMercadoPago(p.price))} pagando con Mercado Pago</p>

      <span class="card__stock" data-kind="${encargue ? 'encargue' : 'stock'}">
        <i class="card__dot"></i>${encargue ? 'Por encargue · 10 días' : `En stock · ${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}`}
      </span>

      <p class="md__desc">${esc(p.longDescription || p.shortDescription || '')}</p>
      ${specs}
      <p class="md__entrega">${esc(entrega)}</p>
      ${miniaturas}

      <div class="md__actions">
        <button class="md__add" type="button" data-add="${p.id}">Agregar al carrito</button>
        <a class="md__wa" href="${esc(linkWhatsapp(`¡Hola! Me interesa el ${p.name} (${precio(p.price)}).`))}" target="_blank" rel="noopener">Consultar</a>
      </div>
    </div>
  `;

  abrirPanel(qs('#md'));
  qs('#md-close')?.focus();
}

/* ---------- Carrito ---------- */

function pintarCarrito() {
  const items = cart.leer();
  const total = cart.total();
  const unidades = cart.unidades();

  const badge = qs('#cart-count');
  if (badge) {
    badge.textContent = unidades;
    badge.dataset.empty = String(unidades === 0);
  }

  // Los botones de contacto tienen que llevar siempre el carrito al día.
  actualizarLinksWhatsapp();

  const body = qs('#dw-body');
  const foot = qs('#dw-foot');
  if (!body || !foot) return;

  if (!items.length) {
    body.innerHTML = '<p class="dw__empty">Todavía no agregaste ningún reloj.</p>';
    foot.hidden = true;
    return;
  }

  foot.hidden = false;
  body.innerHTML = items.map((i) => `
    <div class="li">
      <img src="${esc(i.image)}" alt="${esc(i.name)}">
      <div>
        <span class="li__brand">${esc(i.brand || '')}</span>
        <p class="li__name">${esc(i.name)}</p>
        <span class="li__tag" data-kind="${i.encargue ? 'encargue' : 'stock'}">${i.encargue ? 'Por encargue' : 'En stock'}</span>
        <div class="li__price">${precio(i.price * i.qty)}</div>
        <div class="li__qty">
          <button type="button" data-qty="${i.id}" data-delta="-1" aria-label="Quitar uno">−</button>
          <span>${i.qty}</span>
          <button type="button" data-qty="${i.id}" data-delta="1" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <button class="li__del" type="button" data-del="${i.id}">Quitar</button>
    </div>
  `).join('');

  qs('#dw-total').textContent = precio(total);
  qs('#dw-mp').textContent = precio(precioMercadoPago(total));
  qs('#dw-go').href = linkWhatsapp(mensajePedido());
}

/* ============================================================
   Eventos
   ============================================================ */

function conectar() {
  qs('#cart-open')?.addEventListener('click', () => abrirPanel(qs('#dw')));
  qs('#cart-close')?.addEventListener('click', cerrarPaneles);
  qs('#md-close')?.addEventListener('click', cerrarPaneles);
  qs('#ov')?.addEventListener('click', cerrarPaneles);

  // Click fuera de la caja del detalle también cierra.
  qs('#md')?.addEventListener('click', (e) => {
    if (!e.target.closest('#md-box')) cerrarPaneles();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hayPanelAbierto()) cerrarPaneles();
  });

  qs('#sort')?.addEventListener('change', pintarGrillas);

  qs('#chips')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-marca]');
    if (!btn) return;
    marcaActiva = btn.dataset.marca;
    qsa('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.marca === marcaActiva)));
    pintarGrillas();
  });

  // Un solo listener para todo lo que se pinta dinámicamente.
  document.addEventListener('click', (e) => {
    const abrirCarrito = e.target.closest('[data-open-cart]');
    if (abrirCarrito) { abrirPanel(qs('#dw')); return; }

    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirDetalle(ver.dataset.ver); return; }

    const add = e.target.closest('[data-add]');
    if (add) {
      const p = RELOJES.find((x) => x.id === Number(add.dataset.add));
      if (!p) return;
      cart.agregar(p);

      // Confirmación en el propio botón, sin sacarte de donde estás.
      const textoOriginal = add.textContent;
      add.dataset.added = 'true';
      add.textContent = 'Agregado ✓';
      setTimeout(() => {
        add.dataset.added = 'false';
        add.textContent = textoOriginal;
      }, 1400);
    }
  });

  // Cambiar la foto grande del detalle.
  qs('#md-grid')?.addEventListener('click', (e) => {
    const thumb = e.target.closest('[data-foto]');
    if (!thumb) return;
    qs('#md-foto').src = thumb.dataset.foto;
    qsa('.md__thumb', qs('#md-grid')).forEach((t) => {
      t.setAttribute('aria-pressed', String(t === thumb));
    });
  });

  // Cantidades y borrado dentro del carrito.
  qs('#dw-body')?.addEventListener('click', (e) => {
    const qty = e.target.closest('[data-qty]');
    if (qty) { cart.cambiarCantidad(Number(qty.dataset.qty), Number(qty.dataset.delta)); return; }

    const del = e.target.closest('[data-del]');
    if (del) cart.quitar(Number(del.dataset.del));
  });

  // Sombra del header al scrollear.
  const hd = qs('#hd');
  const marcarScroll = () => { if (hd) hd.dataset.scrolled = String(window.scrollY > 8); };
  window.addEventListener('scroll', marcarScroll, { passive: true });
  marcarScroll();
}

/* ============================================================
   Arranque
   ============================================================ */

async function init() {
  qs('#year').textContent = new Date().getFullYear();

  conectar();
  pintarCarrito();   // deja los links de WhatsApp listos con el carrito guardado

  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error(`products.json: ${res.status}`);
    const todos = await res.json();
    RELOJES = todos.filter((p) => p.category === 'Relojes' && p.status !== 'hidden');

    pintarHero();
    pintarChips();
    pintarGrillas();
  } catch (err) {
    console.error('[relojes] no se pudo cargar el catálogo:', err);
    qs('#grid-stock').innerHTML =
      '<li class="empty">No pudimos cargar los relojes. Recargá la página o escribinos por WhatsApp.</li>';
    qs('#grid-encargue').innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', init);
