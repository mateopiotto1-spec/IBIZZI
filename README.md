# IBIZZI · Ecommerce completo

Tienda online de indumentaria, relojes, accesorios y zuecos Nike Mind.
HTML + CSS + JavaScript modular. Datos en JSON. Sin frameworks.

**Frase:** *Vestite como querés que te recuerden.*

---

## Cómo abrir el proyecto

1. Abrí la carpeta `ibizzi-store/` en **Visual Studio Code**.
2. Instalá la extensión **Live Server** (Ritwick Dey).
3. Click derecho en `index.html` → **Open with Live Server**.
4. Se abre en `http://127.0.0.1:5500`.

> ⚠️ No abras los `.html` con doble click. Los módulos ES6 y `fetch` necesitan un servidor.

Alternativas:
```bash
npx serve .
# o
python3 -m http.server 5500
```

### (Opcional) Vite
```bash
npm init -y && npm install --save-dev vite
npx vite
```

---

## Estructura

```
ibizzi-store/
├── index.html          Home: hero + 4 iconos + categorías + destacados + banner + relojes + zuecos Nike Mind + beneficios + reseñas + galería social
├── products.html       Listado con filtros y ordenamiento
├── product.html        Detalle dinámico (?slug= o ?id=)
├── cart.html           Carrito completo con nota y código de descuento
├── checkout.html       Checkout multi-sección + confirmación
├── favorites.html      Favoritos guardados
├── contact.html        Contacto (form + WhatsApp/email)
├── shipping.html       Envíos y devoluciones
├── faq.html            Preguntas frecuentes
├── 404.html            Página no encontrada
│
├── css/                Estilos separados por responsabilidad
│   ├── variables.css   Design tokens
│   ├── reset.css       Reset moderno
│   ├── global.css      Tipografía base, botones, container
│   ├── animations.css  Fades, skeleton, spinner
│   ├── header.css      Announcement + header + menú móvil + search
│   ├── footer.css      Footer editorial
│   ├── home.css        Hero, quick icons, categorías, banner, beneficios, reseñas
│   ├── product-card.css  Tarjeta reutilizable + carrusel
│   ├── product-page.css  Detalle + galería + sticky bar + filtros
│   ├── cart.css        Cart drawer + cart + checkout + favoritos
│   └── responsive.css  Breakpoints tablet/desktop
│
├── js/                 Módulos ES6 (import/export)
│   ├── app.js          Entry point global
│   ├── utils.js        Helpers reutilizables
│   ├── shell.js        Inyecta header/drawer/footer en cada página
│   ├── products.js     Renderer de tarjetas + grillas + home sections
│   ├── product-page.js Detalle: galería, variantes, sticky bar
│   ├── cart.js         Estado del carrito (LocalStorage)
│   ├── cart-drawer.js  UI del drawer lateral
│   ├── filters.js      Filtros + ordenamiento
│   ├── search.js       Buscador con debounce + sugerencias
│   ├── favorites.js    Estado de favoritos (LocalStorage)
│   ├── recommendations.js  Completá tu look + También te puede interesar
│   └── checkout.js     Validaciones + processPayment() stub
│
├── data/               Datos en JSON
│   ├── products.json   Catálogo (8 productos de arranque)
│   ├── categories.json Las 4 categorías principales
│   └── reviews.json    Reseñas globales
│
├── assets/
│   ├── images/         Fotos reales (reemplazan a los placeholders)
│   ├── icons/          SVGs de UI
│   └── placeholders/   SVGs editoriales locales (fallback)
│
└── README.md
```

---

## Cargar productos nuevos

Editar `data/products.json` y agregar un objeto con el mismo esquema. La tienda los detecta y renderiza automáticamente en:

- Home (destacados / relojes / zuecos Nike Mind si aplica)
- `products.html` (grid completo + filtros)
- `product.html?slug=…` (URL limpia)
- Cart drawer "Completá tu compra"
- Búsqueda global (por nombre, marca, tags, categoría)
- Filtros por marca/talle/color/precio (se generan solos)

Campos mínimos:
```json
{
  "id": 9,
  "slug": "producto-nuevo",
  "sku": "IBZ-NEW-009",
  "name": "Nombre",
  "brand": "Marca",
  "category": "Indumentaria",
  "price": 3990,
  "currency": "UYU",
  "stock": 10,
  "sizes": ["S","M","L"],
  "colors": [{"name":"Negro","hex":"#101010"}],
  "images": ["assets/images/products/nuevo-1.jpg"],
  "shortDescription": "…"
}
```

Los campos opcionales dan más funcionalidad: `oldPrice` (calcula descuento auto), `new` (badge), `featured` (aparece en destacados home), `complementaryProducts` (array de ids para "Completá tu look"), `recommendedProducts` (array de ids para "También te puede interesar"), `specifications`, `reviews`.

---

## Cómo funciona el carrito

El carrito vive en `LocalStorage` bajo la clave `ibizzi_cart`.

- Agregar → `cart.js:addItem()` emite `cart:updated`
- El header actualiza el contador
- El cart drawer se re-renderiza y se abre automáticamente
- `cart.html` y `checkout.html` escuchan `cart:updated` y se re-renderizan solos
- Un mismo producto con distinto talle/color = línea distinta en el carrito

Persistencia garantizada al refrescar. Reset manual: en la consola del navegador, `localStorage.removeItem('ibizzi_cart')`.

---

## Design system

Todos los tokens viven en `css/variables.css`:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg-primary` | `#1A1A1A` | Fondo global |
| `--color-bg-card` | `#2D2D2D` | Tarjetas |
| `--color-text-primary` | `#F5F5F5` | Texto principal |
| `--color-border` | `#444444` | Bordes |
| `--font-serif` | Cormorant Garamond | Títulos editoriales |
| `--font-sans` | Inter | UI, precios, botones |
| `--btn-height` | `52px` | Alto mínimo botones |

Cambiar la paleta en un solo lugar.

---

## Mercado Pago (integración futura)

El botón "PAGAR AHORA" del checkout llama a `processPayment(orderData)` en `js/checkout.js`, que actualmente simula el pago exitoso y muestra confirmación.

Para conectar Mercado Pago real necesitás un backend. **Nunca pongas el access token en el frontend.**

Flujo recomendado:

1. **Frontend** envía `orderData` a `POST /api/orders` (tu backend)
2. **Backend** crea la preferencia con el SDK oficial de MP usando el `ACCESS_TOKEN` privado
3. **Backend** devuelve `init_point` (o `preference_id` si usás Bricks)
4. **Frontend** redirige a `init_point` (Checkout Pro) o carga Bricks
5. **Backend** recibe la notificación (webhook) y confirma el pedido

El comentario en `js/checkout.js` marca exactamente dónde enganchar cada paso.

---

## Fases completadas

- [x] **Fase 1** — Arquitectura, variables, estilos globales, header, menú móvil, footer.
- [x] **Fase 2** — Home: hero + 4 iconos de categoría + categorías editoriales + destacados + banner + relojes + zuecos Nike Mind + beneficios + reseñas + galería social + newsletter.
- [x] **Fase 3** — `products.html`: filtros (marca/talle/color/precio/estado), ordenamiento, drawer móvil, tarjetas.
- [x] **Fase 4** — `product.html`: galería con swipe + thumbnails + counter, variantes (color/talle), sticky bar móvil, especificaciones, reseñas, completá tu look, recomendaciones.
- [x] **Fase 5** — Cart drawer con "completá tu compra", `cart.html` con nota + descuento, `checkout.html` con validación + resumen + confirmación, LocalStorage sync.
- [x] **Fase 6** — Favoritos, accesibilidad (aria-*, focus visible, escape, contraste), SEO (Open Graph, JSON-LD Product, canonical), 404, contacto, envíos, FAQ.

---

## Notas técnicas

- **Cero frameworks**: JS vanilla ES6+, imports/exports nativos.
- **Placeholders SVG** locales en `assets/placeholders/`. Reemplazables por fotos reales (cambiá el path en `products.json` y listo).
- **Header/footer inyectados por JS** desde `shell.js`. Editás una vez y aplica a todas las páginas.
- **Caché en memoria del JSON** de productos. Primera llamada red, resto memoria.
- **LocalStorage**: `ibizzi_cart`, `ibizzi_favorites`, `ibizzi_last_order`.
- **Reduce motion** respetado (los que activan esa preferencia OS ven todo estático).

---

## Cosas a agregar cuando la marca lo pida

- Cuentas de usuario (registro/login) → requiere backend
- Multi-idioma (es/en) → i18n en JSON
- Wishlist compartible por link
- Blog editorial
- Chat de WhatsApp flotante
- Analytics (GA4 / Meta Pixel)
