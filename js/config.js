/* ============================================================
   KRAFTORA — PRODUCT & BRAND CONFIGURATION
   Brand: KRAFTORA
   Tagline: "SUSTAINABLE PACKAGING. ELEVATED STYLE."
   ============================================================ */

const SITE = {
  brand: {
    name: "KRAFTORA",
    tagline: "SUSTAINABLE PACKAGING. ELEVATED STYLE.",
    heroHeading: "Carry Better. Live Greener.",
    heroSupporting: "Thoughtfully designed for everyday shopping. Combining a natural kraft paper exterior with a removable, splash-resistant liner made from reclaimed fabric.",
    founded: "Sustainable Packaging. Elevated Style.",
    mission: "Thoughtful everyday bags combining natural kraft paper and reclaimed textiles.",
    logo: "images/kraftora-logo.png",
  },
  currency: {
    symbol: "₹",
    code: "INR",
  },
  shipping: {
    smallRate: 0,
    mediumLargeRate: 29,
    description: "Free on Small bags; ₹29 flat on Medium & Large orders.",
  },
};

/* ============================================================
   CENTRAL SIZES & PRICING CONFIGURATION
   Small:  ₹40  (Shipping: FREE)
   Medium: ₹80  (Shipping: ₹29)
   Large:  ₹120 (Shipping: ₹29)
   ============================================================ */
const SIZES = {
  small: {
    key: "small",
    name: "Small",
    price: 40,
    priceDisplay: "₹40",
    shipping: 0,
    shippingLabel: "FREE",
    dimensions: "24 cm (H) × 20 cm (W) × 10 cm (D)",
    capacity: "Approx. 5 Litres",
    description: "Compact daily bag for lunches, bakery goods, books & personal items.",
  },
  medium: {
    key: "medium",
    name: "Medium",
    price: 80,
    priceDisplay: "₹80",
    shipping: 29,
    shippingLabel: "₹29",
    dimensions: "32 cm (H) × 26 cm (W) × 12 cm (D)",
    capacity: "Approx. 10 Litres",
    description: "Standard grocery size for produce, farm market runs & retail shopping.",
  },
  large: {
    key: "large",
    name: "Large",
    price: 120,
    priceDisplay: "₹120",
    shipping: 29,
    shippingLabel: "₹29",
    dimensions: "40 cm (H) × 32 cm (W) × 15 cm (D)",
    capacity: "Approx. 19 Litres",
    description: "Heavy-duty capacity for bulk groceries, multiple items & market days.",
  },
};

const PRODUCTS = [
  {
    id: "splash-resistant-bag-001",
    slug: "product.html",

    name: "Splash-Resistant Reusable Shopping Bag",
    tagline: "Natural Kraft Exterior · Reclaimed Navy-Blue Liner",
    shortDesc: "A thoughtfully designed reusable shopping bag featuring a natural kraft paper exterior and a removable, splash-resistant inner liner crafted from reclaimed umbrella fabric.",
    description: "Thoughtfully redesigned for everyday shopping. A reusable kraft paper shopping bag featuring a removable, splash-resistant liner made from reclaimed umbrella or raincoat fabric. Designed to make grocery runs and daily carrying more practical while giving durable reclaimed textiles another useful life.",

    // Default base pricing (Small is default)
    defaultSize: "small",
    price: 40,
    priceDisplay: "₹40",

    // Stock Status
    stockStatus: "in_stock",
    stockLabel: "Handcrafted · In Stock",

    // Image Angles (Authored from official physical prototype & reference)
    images: [
      {
        src: "images/product-front.svg",
        alt: "Splash-Resistant Reusable Shopping Bag – front view showing natural kraft paper with folded navy-blue liner",
        label: "Front View",
      },
      {
        src: "images/product-open.svg",
        alt: "Open bag view showing dark navy-blue reclaimed fabric liner fitted neatly inside",
        label: "Open Interior",
      },
      {
        src: "images/product-liner.svg",
        alt: "Removable navy-blue liner pouch made from reclaimed umbrella fabric",
        label: "Liner Detail",
      },
      {
        src: "images/product-assembly.svg",
        alt: "Kraft paper bag and removable liner shown as two distinct separable components",
        label: "Two Components",
      },
      {
        src: "images/product-reference.jpg",
        alt: "Instructional and construction visual overview of the splash-resistant reusable shopping bag",
        label: "Full Construction",
      },
    ],

    // Product Specifications
    specs: {
      "Outer Bag": "Natural kraft paper (uncoated, high-density recyclable kraft)",
      "Inner Liner": "Reclaimed umbrella or raincoat fabric (dark navy blue)",
      "Liner Attachment": "Removable tailored insert with fold-over rim (not glued)",
      "Water Protection": "Splash-resistant against raindrops and damp grocery condensation",
      "Available Sizes":  "Small (₹40), Medium (₹80), Large (₹120)",
      "Handles":          "Durable twisted kraft cord with reinforced internal anchor tabs",
      "Care Method":      "Liner wipes clean with damp cloth; keep outer paper dry",
      "End of Life":      "Liner transfers to replacement bag; outer bag 100% recyclable",
    },

    // Key Features
    features: [
      {
        icon: "liner",
        title: "Removable Inner Liner",
        text: "The navy-blue liner lifts out in seconds for easy spot-cleaning and moves seamlessly to a new paper bag if the outer shell wears out.",
      },
      {
        icon: "water",
        title: "Splash-Resistant Protection",
        text: "Engineered from tightly woven reclaimed fabric to repel moisture, light rain, and condensation from refrigerated groceries.",
      },
      {
        icon: "reclaimed",
        title: "100% Reclaimed Fabric",
        text: "Every liner is cut and stitched from clean, post-consumer umbrellas or raincoats, preventing durable water-resistant textiles from reaching landfills.",
      },
      {
        icon: "reuse",
        title: "Modular Reusable Design",
        text: "Unlike laminated bags that cannot be recycled, our paper exterior remains pure uncoated kraft paper, fully separable from the reusable cloth insert.",
      },
      {
        icon: "everyday",
        title: "Built for Daily Errands",
        text: "Available in Small (₹40), Medium (₹80), and Large (₹120) with comfortable twisted kraft handles for everyday market trips.",
      },
    ],

    // Care Guidelines
    care: [
      "Remove the navy fabric liner prior to cleaning either component.",
      "Wipe the fabric liner with a damp cloth or hand rinse with cold water.",
      "Air dry the liner completely flat before reinserting into the bag.",
      "Keep the outer kraft paper bag away from standing water or submersion.",
      "Fold the liner's top 2–3 cm over the rim for maximum stability during shopping.",
      "When the paper bag eventually reaches the end of its lifespan, compost or recycle it, and retain the liner for your next kraft bag.",
    ],
  },
];

// Helper: get product by ID
function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
}

// Helper: get the main product
function getMainProduct() {
  return PRODUCTS[0];
}

// Helper: format price for a given numeric amount
function formatAmount(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0";
  return SITE.currency.symbol + amount.toLocaleString("en-IN");
}

// Helper: stock badge HTML
function stockBadge(product) {
  const map = {
    in_stock: ['badge--in-stock', product.stockLabel || "In Stock"],
    out_of_stock: ['badge--out-stock', "Out of Stock"],
    tbc: ['badge--tbc', "Availability TBC"],
  };
  const [cls, label] = map[product.stockStatus] || map.in_stock;
  return `<span class="badge ${cls}">${label}</span>`;
}

// Helper: Calculate shipping charge based on exact rules:
// - Small only: Free (₹0)
// - Medium or Large: ₹29 charged ONCE per order
function calculateShippingCharge(itemsOrSize) {
  if (typeof itemsOrSize === "string") {
    const s = itemsOrSize.toLowerCase();
    return (s === "medium" || s === "large") ? SITE.shipping.mediumLargeRate : SITE.shipping.smallRate;
  }
  if (!itemsOrSize || (Array.isArray(itemsOrSize) && itemsOrSize.length === 0)) return 0;
  const list = Array.isArray(itemsOrSize) ? itemsOrSize : [itemsOrSize];
  const hasMediumOrLarge = list.some((item) => {
    const s = (item.sizeKey || item.size || "").toLowerCase();
    return s === "medium" || s === "large";
  });
  return hasMediumOrLarge ? SITE.shipping.mediumLargeRate : SITE.shipping.smallRate;
}

// Calculate full order calculation object for direct Buy Now
function calculateDirectOrder(sizeKey = "small", qty = 1) {
  const normKey = (sizeKey || "small").toLowerCase();
  const sizeConfig = SIZES[normKey] || SIZES.small;
  const cleanQty = Math.max(1, Math.floor(qty || 1));
  const subtotal = sizeConfig.price * cleanQty;
  const shipping = sizeConfig.shipping;
  const finalAmount = subtotal + shipping;

  return {
    productId: "splash-resistant-bag-001",
    productName: "Splash-Resistant Reusable Shopping Bag",
    sizeKey: sizeConfig.key,
    sizeName: sizeConfig.name,
    dimensions: sizeConfig.dimensions,
    capacity: sizeConfig.capacity,
    unitPrice: sizeConfig.price,
    qty: cleanQty,
    subtotal: subtotal,
    shipping: shipping,
    shippingLabel: sizeConfig.shippingLabel,
    finalAmount: finalAmount,
    image: "images/product-front.svg",
    imageAlt: "Splash-Resistant Reusable Shopping Bag in Kraft Brown & Reclaimed Navy Liner",
  };
}
