// ============================================================
//  PRODUCTS.JS — Catálogo de productos
// ============================================================

const WHATSAPP_NUMBER = "59894990760";

const products = [

  // ===================== BUZOS =====================

{
  id: 18,
  name: "Boxy Tree Rígido",
  category: "ropa",
  subcategory: "buzos",
  price: 2325,
  oldPrice: 3100,
  image: "img/tree1.webp",
  images: [
    "img/treemodelo1.webp",
    "img/modelotree2.webp",
    "img/tree1.webp",
    "img/mangatree.webp",
    "img/tree3.webp"
  ],
  sizes: ["S", "M", "L"],
  status: "stock",
  drop: "WINTER DROP",
  tag: "25% OFF",
  description: "Buzo boxy fit rígido en tono tree, estética premium.",
  whatsapp: WHATSAPP_NUMBER
},

{
  id: 17,
  name: "Boxy Camuflado Fit Rígido",
  category: "ropa",
  subcategory: "buzos",
  price: 2170,
  oldPrice: 2890,
  image: "img/camuflado.webp",
  images: [
    "img/camufladomodelo1.webp",
    "img/camufladomodelo2.webp",
    "img/camufladocapucha.webp",
    "img/camufadomanga.webp",
    "img/camuflado.webp"
  ],
  sizes: ["S", "M", ""],
  status: "stock",
  drop: "WINTER DROP",
  tag: "25% OFF",
  description: "Buzo boxy fit rígido, estilo streetwear premium.",
  whatsapp: WHATSAPP_NUMBER
},

{
  id: 16,
  name: "Angels of Hell Frizado",
  category: "ropa",
  subcategory: "buzos",
  price: 1870,
  oldPrice: 2490,
  image: "img/angels1.webp",
  images: [
    "img/angelsmodel2.webp",
    "img/angelsmodel3.webp",
    "img/angelespalda.webp",
    "img/angels1.webp",
    "img/angels3.webp"
  ],
  sizes: ["S", "M", "L"],
  status: "stock",
  drop: "WINTER DROP",
  tag: "25% OFF",
  description: "Buzo frizado abrigado con diseño exclusivo Angels of Hell.",
  whatsapp: WHATSAPP_NUMBER
},

{
  id: 13,
  name: "Hoodie BRZCO Frizado",
  category: "ropa",
  subcategory: "buzos",
  price: 1790,
  oldPrice: 2390,
  image: "img/brzcohueso1.webp",
  images: [
    "img/brzcomodelo1.webp",
    "img/brzcohueso1.webp"
  ],
  sizes: ["S", "M", "L"],
  status: "stock",
  drop: "WINTER DROP",
  tag: "25% OFF",
  whatsapp: WHATSAPP_NUMBER
},

{
  id: 14,
  name: "Hoodie BRZCO Negro",
  category: "ropa",
  subcategory: "buzos",
  price: 1790,
  oldPrice: 2390,
  image: "img/brzconegro1.webp",
  images: [
    "img/brzcomodelo2.webp",
    "img/brzconegro1.webp",
    "img/brzconegro2.webp"
  ],
  sizes: ["S", "M", "L"],
  status: "stock",
  drop: "WINTER DROP",
  tag: "25% OFF",
  whatsapp: WHATSAPP_NUMBER
},

{
  id: 15,
  name: "Hoodie BRZCO Gris",
  category: "ropa",
  subcategory: "buzos",
  price: 1790,
  oldPrice: 2390,
  image: "img/brzcogris1.webp",
  images: [
    "img/brzcogris1.webp",
    "img/brzcogris2.webp"
  ],
  sizes: ["S", "M", "L"],
  status: "stock",
  drop: "WINTER DROP",
  tag: "25% OFF",
  whatsapp: WHATSAPP_NUMBER
},
// ===================== BUZOS =====================

{
  id: 22,
  name: "Buzo Jean Boxy Fit",
  category: "ropa",
  subcategory: "buzos",
  price: 1890,
  image: "img/buzojean1.webp",
  images: [
    "img/buzojean1.webp",
    "img/buzojean2.webp"
  ],
  sizes: ["", "", "L"],
  status: "stock",
   tag: "¡último!",
  description: "Buzo premium con tela jean y corte urbano.",
  whatsapp: WHATSAPP_NUMBER
},

{
  id: 23,
  name: "Buzo Tela Art Premium",
  category: "ropa",
  subcategory: "buzos",
  price: 1490,
  image: "img/buzotela1.webp",
  images: [
    "img/buzotela1.webp",
    "img/buzotela2.webp",
    "img/buzotela3.webp"
  ],
  sizes: ["", "", "L"],
  status: "stock",
  
  tag: "¡último!",
  description: "Buzo premium tejido con diseño frontal exclusivo y estética streetwear.",
  whatsapp: WHATSAPP_NUMBER
},
// ===================== REMERAS MANGA LARGA =====================

{
  id: 19,
  name: "Remera Cartas Manga Larga",
  category: "ropa",
  subcategory: "remeras-manga-larga",
  price: 1190,
  image: "img/remeracartas.webp",
  images: [
    "img/remeracartas.webp",
    "img/remeracartas2.webp",
    "img/remeracartas3.webp"
  ],
  sizes: ["", "", "L"],
  status: "stock",
  
  description: "Remera manga larga negra con diseño Cartas, estilo streetwear.",
  whatsapp: WHATSAPP_NUMBER
},

{
  id: 20,
  name: "Remera Tiger Manga Larga",
  category: "ropa",
  subcategory: "remeras-manga-larga",
  price: 1190,
  image: "img/remeratiger1.webp",
  images: [
    "img/remeratiger1.webp",
    "img/remeratiger2.webp"
  ],
  sizes: ["S", "M", "L"],
  status: "stock",
  drop: "WINTER DROP",
  tag: "¡NEW!",
  description: "Remera manga larga negra con diseño Tiger, estilo urbano.",
  whatsapp: WHATSAPP_NUMBER
},

{
  id: 21,
  name: "Remera Blanca Manga Larga",
  category: "ropa",
  subcategory: "remeras-manga-larga",
  price: 1190,
  image: "img/remerablanca1.webp",
  images: [
    "img/remerablanca1.webp",
    "img/remerablanca2.webp"
  ],
  sizes: ["S", "M", "L"],
  status: "stock",
  drop: "WINTER DROP",
  tag: "¡NEW!",
  description: "Remera manga larga blanca con diseño frontal, estilo clean streetwear.",
  whatsapp: WHATSAPP_NUMBER
},
  // ===================== CALZADOS =====================

  {
    id: 8,
    name: "New Balance 530",
    category: "calzados",
    price: 3900,
    image: "img/newbalance.webp",
    images: ["img/newbalance.webp"],
    sizes: ["39"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 24,
    name: "Nike Mind 001",
    category: "calzados",
    price: 2600,
    image: "img/mind001.webp",
    images: ["img/mind001.webp"],
    sizes: ["37","38","39", "40", "41", "42", "43","44","45"],
    status: "stock",
    tag: "¡NEW!",
    description: "Zapatilla Nike Mind 001, diseño minimalista urbano.",
    whatsapp: WHATSAPP_NUMBER
  },

  // ===================== GORRAS =====================

  {
    id: 25,
    name: "Chrome Hearts Trucker",
    category: "gorras",
    price: 1900,
    image: "img/chromeheartsblack.webp",
    images: ["img/chromeheartsblack.webp"],
    sizes: ["Talle único"],
    status: "stock",
    tag: "¡NEW!",
    description: "Gorra trucker Chrome Hearts negra con parche de cuero premium.",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 26,
    name: "Hellstar Cap ",
    category: "gorras",
    price: 1900,
    image: "img/hellstar.webp",
    images: ["img/hellstar.webp"],
    sizes: ["Talle único"],
    status: "stock",
    tag: "¡NEW!",
    description: "Gorra trucker Hellstar negra con logo bordado flame.",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 27,
    name: "Amiri Camuflada",
    category: "gorras",
    price: 1900,
    image: "img/amiricamuflada.webp",
    images: ["img/amiricamuflada.webp"],
    sizes: ["Talle único"],
    status: "stock",
    tag: "¡NEW!",
    description: "Gorra trucker Amiri estampado camuflado con parche MA.",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 28,
    name: "Amiri 3 Stars",
    category: "gorras",
    price: 1900,
    image: "img/amiribrilloroja.webp",
    images: ["img/amiribrilloroja.webp"],
    sizes: ["Talle único"],
    status: "stock",
    tag: "¡NEW!",
    description: "Gorra negra con estrellas rojas bordadas en pedrería.",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 29,
    name: "Supreme Camp Cap",
    category: "gorras",
    price: 1900,
    image: "img/supreme.webp",
    images: ["img/supreme.webp", "img/supreme2.webp"],
    sizes: ["Talle único"],
    status: "stock",
    tag: "¡NEW!",
    description: "Gorra Supreme 5-panel negra ante con box logo bordado.",
    whatsapp: WHATSAPP_NUMBER
  }

];