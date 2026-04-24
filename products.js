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
    price: 3100,
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
    drop: "PRE WINTER DROP",
    tag: "¡NEW!",
    description: "Buzo boxy fit rígido en tono tree, estética premium.",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 17,
    name: "Boxy Camuflado Fit Rígido",
    category: "ropa",
    subcategory: "buzos",
    price: 2890,
    image: "img/camuflado.webp",
    images: [
      "img/camufladomodelo1.webp",
      "img/camufladomodelo2.webp",
      "img/camufladocapucha.webp",
      "img/camufadomanga.webp",
      "img/camuflado.webp"
    ],
    sizes: ["S", "M", "L"],
    status: "stock",
    drop: "PRE WINTER DROP",
    tag: "¡NEW!",
    description: "Buzo boxy fit rígido, estilo streetwear premium.",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 16,
    name: "Angels of Hell Frizado",
    category: "ropa",
    subcategory: "buzos",
    price: 2490,
    oldPrice: 2690,
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
    drop: "PRE WINTER DROP",
    tag: "¡NEW!",
    description: "Buzo frizado abrigado con diseño exclusivo Angels of Hell.",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 13,
    name: "Hoodie BRZCO Frizado",
    category: "ropa",
    subcategory: "buzos",
    price: 2390,
    image: "img/brzcohueso1.webp",
    images: [
      "img/brzcomodelo1.webp",
      "img/brzcohueso1.webp"
    ],
    sizes: ["S", "M", "L"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 14,
    name: "Hoodie BRZCO Negro",
    category: "ropa",
    subcategory: "buzos",
    price: 2390,
    image: "img/brzconegro1.webp",
    images: [
      "img/brzcomodelo2.webp",
      "img/brzconegro1.webp",
      "img/brzconegro2.webp"
    ],
    sizes: ["S", "M", "L"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 15,
    name: "Hoodie BRZCO Gris",
    category: "ropa",
    subcategory: "buzos",
    price: 2390,
    image: "img/brzcogris1.webp",
    images: [
      "img/brzcogris1.webp",
      "img/brzcogris2.webp"
    ],
    sizes: ["S", "M", "L"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  },



  // ===================== REMERAS =====================

  {
    id: 1,
    name: "Remera OFF-WHITE Oversize Blanca",
    category: "ropa",
    subcategory: "remeras",
    price: 1900,
    image: "img/remeraoff.webp",
    images: [
      "img/remeraoff.webp",
      "img/remeraoff2.webp",
      "img/remeraoff3.webp",
      "img/remeraoff4.webp",
      "img/tagoffwhite.webp"
    ],
    sizes: ["M"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 2,
    name: "Remera PALM ANGELS Negra",
    category: "ropa",
    subcategory: "remeras",
    price: 1900,
    image: "img/remerapalm0.webp",
    images: [
      "img/remerapalm0.webp",
      "img/remerapalm1.webp",
      "img/remerapalm2.webp",
      "img/remerapalm3.webp",
      "img/tagpalm.webp"
    ],
    sizes: ["M"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  },

  {
    id: 3,
    name: "Remera Hermés Blanca",
    category: "ropa",
    subcategory: "remeras",
    price: 1900,
    image: "img/remerahermes0.webp",
    images: [
      "img/remerahermes0.webp",
      "img/remerahermes2.webp",
      "img/remerahermes3.webp"
    ],
    sizes: ["M", "L"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  },



  // ===================== CALZADOS =====================

  {
    id: 4,
    name: "Nike Air Jordan 1 Dior",
    category: "calzados",
    price: 4490,
    image: "img/jordandior.webp",
    images: ["img/jordandior.webp"],
    sizes: ["42"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  },

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
    id: 9,
    name: "Nike Air Jordan 1 Low",
    category: "calzados",
    price: 4200,
    image: "img/nikeceleste.webp",
    images: ["img/nikeceleste.webp"],
    sizes: ["39", "40", "41", "42", "43"],
    status: "stock",
    whatsapp: WHATSAPP_NUMBER
  }

];
