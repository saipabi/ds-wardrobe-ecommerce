import { Product, Category, Collection, Coupon, ProductReview } from '../types/commerce';

export const SEED_CATEGORIES: Category[] = [
  {
    id: "cat_dresses",
    name: "Dresses",
    handle: "dresses",
    description: "Slip dresses, bodycon, corset silhouettes, and cocktail evening gowns.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    item_count: 6
  },
  {
    id: "cat_coords",
    name: "Co-ord Sets",
    handle: "coords",
    description: "Effortlessly matched two-piece suits, resort sets, and street-luxe pairs.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    item_count: 5
  },
  {
    id: "cat_festive",
    name: "Festive & Fusion",
    handle: "festive-fusion",
    description: "Opulent velvet, Banarasi brocades, and modern ethnic statement wear.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    item_count: 5
  },
  {
    id: "cat_tops",
    name: "Tops & Shirts",
    handle: "tops-shirts",
    description: "Glass organza shirts, corset crop tops, and artisanal statement blouses.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    item_count: 3
  },
  {
    id: "cat_bottoms",
    name: "Trousers & Skirts",
    handle: "bottoms",
    description: "High-waist double-pleated pants, satin cargos, and fluid slit skirts.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    item_count: 3
  }
];

export const SEED_COLLECTIONS: Collection[] = [
  {
    id: "col_evening",
    title: "Midnight Runway Drop",
    handle: "midnight-runway",
    subtitle: "Autumn / Winter Haute Edit",
    description: "Sculpted liquid satins, corset boning, and noir velvet created for after-hours elegance.",
    banner_image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    featured: true
  },
  {
    id: "col_festive",
    title: "Royal Heritage Edition",
    handle: "royal-heritage",
    subtitle: "Artisanal Zari & Velvet Crafts",
    description: "Bridging heirloom Indian textiles with contemporary Western tailoring.",
    banner_image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80",
    featured: true
  },
  {
    id: "col_resort",
    title: "Sun-Drenched Resort & Street",
    handle: "resort-street",
    subtitle: "Breathable Linens & Sculpted Co-ords",
    description: "Effortless silhouettes tailored for coastal escapes and golden-hour strolls.",
    banner_image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
    featured: true
  }
];

export const SEED_COUPONS: Coupon[] = [
  {
    code: "DSFIRST10",
    description: "10% off your inaugural DS Wardrobe order",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 1999,
    active: true
  },
  {
    code: "GLAM500",
    description: "Flat ₹500 discount on orders above ₹3,999",
    discount_type: "fixed",
    discount_value: 500,
    min_order_amount: 3999,
    active: true
  },
  {
    code: "DSVIP20",
    description: "Exclusive 20% privilege discount for VIP drops",
    discount_type: "percentage",
    discount_value: 20,
    min_order_amount: 4999,
    active: true
  }
];

export const SEED_PRODUCTS: Product[] = [
  // 1. The Aurelia Satin Drape Maxi Dress (Dresses)
  {
    id: "prod_aurelia_satin",
    title: "The Aurelia Satin Drape Maxi Dress",
    handle: "aurelia-satin-drape-maxi-dress",
    subtitle: "Liquid-satin cowl neck maxi with lace-up back",
    description: "Crafted from heavy 90gsm fluid satin, the Aurelia dress evokes vintage Hollywood glamour with a contemporary silhouette. Features a graceful cowl neckline, adjustable criss-cross lace back, and an alluring thigh-high slit.",
    category: "Dresses",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Evening", "Maxi", "Satin", "Party Wear", "Bestseller"],
    material: "100% High-Grade Japanese Poly-Satin with stretch lining",
    care_instructions: "Dry clean only or delicate cold hand wash. Low steam iron on reverse.",
    size_guide: { chest: "32-36 in", waist: "26-30 in", hip: "36-40 in", length: "56 in" },
    model_info: "Model is 5'8\" (173cm) wearing Size S. Fit is true to size.",
    status: "published",
    rating: 4.9,
    reviews_count: 28,
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-15T10:00:00Z",
    updated_at: "2026-10-01T12:00:00Z",
    variants: [
      { id: "var_aur_champ_xs", product_id: "prod_aurelia_satin", title: "Champagne Gold / XS", sku: "DS-AUR-CG-XS", size: "XS", color: "Champagne Gold", colorHex: "#D4AF37", price: 4999, sale_price: 3499, inventory_quantity: 4, in_stock: true },
      { id: "var_aur_champ_s", product_id: "prod_aurelia_satin", title: "Champagne Gold / S", sku: "DS-AUR-CG-S", size: "S", color: "Champagne Gold", colorHex: "#D4AF37", price: 4999, sale_price: 3499, inventory_quantity: 7, in_stock: true },
      { id: "var_aur_champ_m", product_id: "prod_aurelia_satin", title: "Champagne Gold / M", sku: "DS-AUR-CG-M", size: "M", color: "Champagne Gold", colorHex: "#D4AF37", price: 4999, sale_price: 3499, inventory_quantity: 5, in_stock: true },
      { id: "var_aur_champ_l", product_id: "prod_aurelia_satin", title: "Champagne Gold / L", sku: "DS-AUR-CG-L", size: "L", color: "Champagne Gold", colorHex: "#D4AF37", price: 4999, sale_price: 3499, inventory_quantity: 0, in_stock: false },
      { id: "var_aur_black_s", product_id: "prod_aurelia_satin", title: "Obsidian Black / S", sku: "DS-AUR-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 4999, sale_price: 3499, inventory_quantity: 6, in_stock: true },
      { id: "var_aur_black_m", product_id: "prod_aurelia_satin", title: "Obsidian Black / M", sku: "DS-AUR-OB-M", size: "M", color: "Obsidian Black", colorHex: "#111111", price: 4999, sale_price: 3499, inventory_quantity: 3, in_stock: true },
      { id: "var_aur_emerald_s", product_id: "prod_aurelia_satin", title: "Emerald Green / S", sku: "DS-AUR-EG-S", size: "S", color: "Emerald Green", colorHex: "#0F4336", price: 4999, sale_price: 3499, inventory_quantity: 4, in_stock: true }
    ]
  },

  // 2. Kyra Tailored Linen-Blend Co-ord Set (Co-ord Sets)
  {
    id: "prod_kyra_coord",
    title: "Kyra Tailored Linen-Blend Co-ord Set",
    handle: "kyra-tailored-linen-coord-set",
    subtitle: "Cropped notch-lapel jacket paired with wide-leg trousers",
    description: "Effortless resort-to-city tailoring. Cut from an airy French flax and cotton blend, the Kyra two-piece features a cropped structured blazer and relaxed high-rise pleated pants.",
    category: "Co-ord Sets",
    collection: "Sun-Drenched Resort & Street",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Co-ord", "Tailored", "Resort", "Streetwear", "Summer"],
    material: "65% Natural Linen, 35% Organic Cotton",
    care_instructions: "Machine wash cold gentle cycle. Hang dry in shade.",
    size_guide: { chest: "34-38 in", waist: "26-32 in", hip: "36-42 in", length: "Blazer 18 in / Pant 41 in" },
    model_info: "Model is 5'9\" wearing Size S.",
    status: "published",
    rating: 4.8,
    reviews_count: 19,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-20T10:00:00Z",
    updated_at: "2026-10-02T12:00:00Z",
    variants: [
      { id: "var_kyra_beige_xs", product_id: "prod_kyra_coord", title: "Sandstone Beige / XS", sku: "DS-KYR-SB-XS", size: "XS", color: "Sandstone Beige", colorHex: "#D9C5B2", price: 5499, sale_price: 4299, inventory_quantity: 3, in_stock: true },
      { id: "var_kyra_beige_s", product_id: "prod_kyra_coord", title: "Sandstone Beige / S", sku: "DS-KYR-SB-S", size: "S", color: "Sandstone Beige", colorHex: "#D9C5B2", price: 5499, sale_price: 4299, inventory_quantity: 6, in_stock: true },
      { id: "var_kyra_beige_m", product_id: "prod_kyra_coord", title: "Sandstone Beige / M", sku: "DS-KYR-SB-M", size: "M", color: "Sandstone Beige", colorHex: "#D9C5B2", price: 5499, sale_price: 4299, inventory_quantity: 5, in_stock: true },
      { id: "var_kyra_rust_s", product_id: "prod_kyra_coord", title: "Terracotta Rust / S", sku: "DS-KYR-TR-S", size: "S", color: "Terracotta Rust", colorHex: "#B85D43", price: 5499, sale_price: 4299, inventory_quantity: 4, in_stock: true },
      { id: "var_kyra_rust_m", product_id: "prod_kyra_coord", title: "Terracotta Rust / M", sku: "DS-KYR-TR-M", size: "M", color: "Terracotta Rust", colorHex: "#B85D43", price: 5499, sale_price: 4299, inventory_quantity: 2, in_stock: true }
    ]
  },

  // 3. The Noor Velvet Kurta Set (Festive & Fusion)
  {
    id: "prod_noor_velvet",
    title: "The Noor Embroidered Velvet Kurta Set",
    handle: "noor-embroidered-velvet-kurta-set",
    subtitle: "Regal micro-velvet straight kurta with tissue silk dupatta",
    description: "An heirloom festive masterpiece. Tailored in deep wine plush micro-velvet, adorned with intricate antique gold tilla and zardozi threadwork along the neckline and cuffs. Paired with straight-cut velvet pants and an ethereal tissue silk dupatta.",
    category: "Festive & Fusion",
    collection: "Royal Heritage Edition",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Festive", "Velvet", "Kurta Set", "Zardozi", "Wedding Edit"],
    material: "9000 Micro Velvet with Pure Tissue Silk Dupatta",
    care_instructions: "Specialist dry clean only. Preserve in cotton muslin bag.",
    size_guide: { chest: "36-42 in", waist: "30-36 in", hip: "38-44 in", length: "Kurta 46 in / Pant 38 in" },
    model_info: "Model is 5'7\" wearing Size M.",
    status: "published",
    rating: 5.0,
    reviews_count: 34,
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-18T10:00:00Z",
    updated_at: "2026-10-04T12:00:00Z",
    variants: [
      { id: "var_noor_wine_s", product_id: "prod_noor_velvet", title: "Deep Wine / S", sku: "DS-NOOR-DW-S", size: "S", color: "Deep Wine", colorHex: "#5B1425", price: 8999, sale_price: 6499, inventory_quantity: 4, in_stock: true },
      { id: "var_noor_wine_m", product_id: "prod_noor_velvet", title: "Deep Wine / M", sku: "DS-NOOR-DW-M", size: "M", color: "Deep Wine", colorHex: "#5B1425", price: 8999, sale_price: 6499, inventory_quantity: 5, in_stock: true },
      { id: "var_noor_wine_l", product_id: "prod_noor_velvet", title: "Deep Wine / L", sku: "DS-NOOR-DW-L", size: "L", color: "Deep Wine", colorHex: "#5B1425", price: 8999, sale_price: 6499, inventory_quantity: 3, in_stock: true },
      { id: "var_noor_emerald_m", product_id: "prod_noor_velvet", title: "Emerald Green / M", sku: "DS-NOOR-EG-M", size: "M", color: "Emerald Green", colorHex: "#0F4336", price: 8999, sale_price: 6499, inventory_quantity: 4, in_stock: true }
    ]
  },

  // 4. Aria Glass Organza Statement Shirt (Tops & Shirts)
  {
    id: "prod_organza_shirt",
    title: "Aria Glass Organza Statement Shirt",
    handle: "aria-glass-organza-statement-shirt",
    subtitle: "Sheer balloon-sleeve shirt with French exaggerated cuffs",
    description: "Architectural drama meets delicate luxury. The Aria shirt is crafted in translucent glass organza with a structured collar, dramatic pleated balloon sleeves, and shell button accents. Comes with a complimentary matching satin camisole.",
    category: "Tops & Shirts",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Tops", "Organza", "Sheer", "Cocktail", "Runway"],
    material: "100% Crisp Silk Organza with Poly-Satin Slip",
    care_instructions: "Gentle cold hand wash or dry clean. Do not wring.",
    size_guide: { chest: "32-38 in", waist: "26-32 in", hip: "Free", length: "24 in" },
    model_info: "Model is 5'8\" wearing Size S.",
    status: "published",
    rating: 4.7,
    reviews_count: 14,
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-22T10:00:00Z",
    updated_at: "2026-10-02T12:00:00Z",
    variants: [
      { id: "var_aria_ivory_xs", product_id: "prod_organza_shirt", title: "Ivory Pearl / XS", sku: "DS-ARI-IV-XS", size: "XS", color: "Ivory Pearl", colorHex: "#F7F5F0", price: 3499, sale_price: 2799, inventory_quantity: 3, in_stock: true },
      { id: "var_aria_ivory_s", product_id: "prod_organza_shirt", title: "Ivory Pearl / S", sku: "DS-ARI-IV-S", size: "S", color: "Ivory Pearl", colorHex: "#F7F5F0", price: 3499, sale_price: 2799, inventory_quantity: 6, in_stock: true },
      { id: "var_aria_black_s", product_id: "prod_organza_shirt", title: "Obsidian Black / S", sku: "DS-ARI-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 3499, sale_price: 2799, inventory_quantity: 5, in_stock: true }
    ]
  },

  // 5. Seraphina Structured Corset Midi Dress (Dresses)
  {
    id: "prod_corset_midi",
    title: "Seraphina Sculpted Corset Midi Dress",
    handle: "seraphina-sculpted-corset-midi-dress",
    subtitle: "Internal boning corset with hourglass crepe pencil skirt",
    description: "Engineered to contour and empower. The Seraphina midi features internal flexible steel boning, sculpted sweetheart cups, and a heavy crepe pencil skirt with a back walking vent.",
    category: "Dresses",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Cocktail", "Corset", "Midi", "Party", "Bodycon"],
    material: "Bonded Italian Stretch Crepe with Cupro Lining",
    care_instructions: "Professional dry clean only.",
    size_guide: { chest: "32-36 in", waist: "24-28 in", hip: "34-38 in", length: "44 in" },
    model_info: "Model is 5'9\" wearing Size S.",
    status: "published",
    rating: 4.9,
    reviews_count: 22,
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-12T10:00:00Z",
    updated_at: "2026-10-05T12:00:00Z",
    variants: [
      { id: "var_ser_black_xs", product_id: "prod_corset_midi", title: "Obsidian Black / XS", sku: "DS-SER-OB-XS", size: "XS", color: "Obsidian Black", colorHex: "#111111", price: 5499, sale_price: 3899, inventory_quantity: 2, in_stock: true },
      { id: "var_ser_black_s", product_id: "prod_corset_midi", title: "Obsidian Black / S", sku: "DS-SER-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 5499, sale_price: 3899, inventory_quantity: 5, in_stock: true },
      { id: "var_ser_black_m", product_id: "prod_corset_midi", title: "Obsidian Black / M", sku: "DS-SER-OB-M", size: "M", color: "Obsidian Black", colorHex: "#111111", price: 5499, sale_price: 3899, inventory_quantity: 4, in_stock: true },
      { id: "var_ser_wine_s", product_id: "prod_corset_midi", title: "Deep Wine / S", sku: "DS-SER-DW-S", size: "S", color: "Deep Wine", colorHex: "#5B1425", price: 5499, sale_price: 3899, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 6. Sienna Double-Pleated Fluid Satin Trousers (Trousers & Skirts)
  {
    id: "prod_satin_cargo",
    title: "Sienna Double-Pleated Fluid Satin Trousers",
    handle: "sienna-double-pleated-satin-trousers",
    subtitle: "High-waist wide-leg pants tailored with French drape",
    description: "The epitome of day-to-night versatility. The Sienna trousers are cut with generous double front pleats and side slant pockets from heavyweight fluid satin that puddles gracefully over heels.",
    category: "Trousers & Skirts",
    collection: "Sun-Drenched Resort & Street",
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Bottoms", "Satin", "Wide-Leg", "Tailored"],
    material: "Premium Liquid Poly-Satin",
    care_instructions: "Dry clean or hand wash cold.",
    size_guide: { chest: "N/A", waist: "26-32 in", hip: "38-44 in", length: "42 in" },
    model_info: "Model is 5'8\" wearing Size S.",
    status: "published",
    rating: 4.8,
    reviews_count: 16,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-19T10:00:00Z",
    updated_at: "2026-10-02T12:00:00Z",
    variants: [
      { id: "var_sien_champ_s", product_id: "prod_satin_cargo", title: "Champagne Gold / S", sku: "DS-SIEN-CG-S", size: "S", color: "Champagne Gold", colorHex: "#D4AF37", price: 3999, sale_price: 2999, inventory_quantity: 4, in_stock: true },
      { id: "var_sien_champ_m", product_id: "prod_satin_cargo", title: "Champagne Gold / M", sku: "DS-SIEN-CG-M", size: "M", color: "Champagne Gold", colorHex: "#D4AF37", price: 3999, sale_price: 2999, inventory_quantity: 5, in_stock: true },
      { id: "var_sien_black_s", product_id: "prod_satin_cargo", title: "Obsidian Black / S", sku: "DS-SIEN-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 3999, sale_price: 2999, inventory_quantity: 6, in_stock: true },
      { id: "var_sien_black_l", product_id: "prod_satin_cargo", title: "Obsidian Black / L", sku: "DS-SIEN-OB-L", size: "L", color: "Obsidian Black", colorHex: "#111111", price: 3999, sale_price: 2999, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 7. The Sitara Heavily Sequined Wrap Gown (Festive & Fusion)
  {
    id: "prod_sequin_wrap",
    title: "The Sitara Heavily Sequined Wrap Gown",
    handle: "sitara-heavily-sequined-wrap-gown",
    subtitle: "Dazzling champagne micro-sequins with cinched waist",
    description: "Designed for grand soirees and sangeet nights. The Sitara wrap gown catches light from every angle with thousands of micro metallic sequins hand-embellished onto sheer tulle.",
    category: "Festive & Fusion",
    collection: "Royal Heritage Edition",
    thumbnail: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Festive", "Sequin", "Gown", "Wedding", "Statement"],
    material: "Metallic Micro-Sequins on Fine Nylon Tulle with Satin Lining",
    care_instructions: "Specialist spot clean or dry clean only.",
    size_guide: { chest: "34-38 in", waist: "26-32 in", hip: "36-42 in", length: "58 in" },
    model_info: "Model is 5'9\" wearing Size S.",
    status: "published",
    rating: 4.9,
    reviews_count: 26,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-24T10:00:00Z",
    updated_at: "2026-10-06T12:00:00Z",
    variants: [
      { id: "var_sit_champ_s", product_id: "prod_sequin_wrap", title: "Champagne Gold / S", sku: "DS-SIT-CG-S", size: "S", color: "Champagne Gold", colorHex: "#D4AF37", price: 9999, sale_price: 7999, inventory_quantity: 3, in_stock: true },
      { id: "var_sit_champ_m", product_id: "prod_sequin_wrap", title: "Champagne Gold / M", sku: "DS-SIT-CG-M", size: "M", color: "Champagne Gold", colorHex: "#D4AF37", price: 9999, sale_price: 7999, inventory_quantity: 4, in_stock: true },
      { id: "var_sit_sapph_s", product_id: "prod_sequin_wrap", title: "Royal Sapphire / S", sku: "DS-SIT-RS-S", size: "S", color: "Royal Sapphire", colorHex: "#1A365D", price: 9999, sale_price: 7999, inventory_quantity: 2, in_stock: true }
    ]
  },

  // 8. Elysian Double-Breasted Power Blazer Set (Co-ord Sets)
  {
    id: "prod_blazer_suit",
    title: "Elysian Double-Breasted Power Blazer Suit",
    handle: "elysian-double-breasted-power-blazer-suit",
    subtitle: "Sharp shoulder tailored blazer paired with cigarette trousers",
    description: "Runway authority tailored for the modern woman. Featuring peak satin lapels, padded structured shoulders, tortoise buttons, and slim tapered cigarette trousers.",
    category: "Co-ord Sets",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Co-ord", "Blazer", "Power Dressing", "Suit"],
    material: "Premium Suiting Gabardine with Duchess Satin Trim",
    care_instructions: "Dry clean only. Steam iron.",
    size_guide: { chest: "34-40 in", waist: "26-32 in", hip: "36-42 in", length: "Blazer 28 in / Pant 39 in" },
    model_info: "Model is 5'9\" wearing Size S.",
    status: "published",
    rating: 4.8,
    reviews_count: 17,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-10T10:00:00Z",
    updated_at: "2026-10-01T12:00:00Z",
    variants: [
      { id: "var_ely_black_s", product_id: "prod_blazer_suit", title: "Obsidian Black / S", sku: "DS-ELY-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 6999, sale_price: 5499, inventory_quantity: 5, in_stock: true },
      { id: "var_ely_black_m", product_id: "prod_blazer_suit", title: "Obsidian Black / M", sku: "DS-ELY-OB-M", size: "M", color: "Obsidian Black", colorHex: "#111111", price: 6999, sale_price: 5499, inventory_quantity: 4, in_stock: true },
      { id: "var_ely_beige_m", product_id: "prod_blazer_suit", title: "Sandstone Beige / M", sku: "DS-ELY-SB-M", size: "M", color: "Sandstone Beige", colorHex: "#D9C5B2", price: 6999, sale_price: 5499, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 9. Celeste Liquid Satin Halter Evening Gown (Dresses)
  {
    id: "prod_celeste_gown",
    title: "Celeste Liquid Satin Halter Evening Gown",
    handle: "celeste-liquid-satin-halter-gown",
    subtitle: "High-neck halter evening gown with dramatic low back",
    description: "An arresting statement in fluid luxury. Cut on the bias to hug the hips effortlessly, the Celeste gown features a gathered mock neck, sweeping puddle train, and open back.",
    category: "Dresses",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Evening", "Gown", "Halter", "Runway"],
    material: "100% Ultra-Fluid Crepe-Back Satin",
    care_instructions: "Dry clean only.",
    size_guide: { chest: "32-36 in", waist: "25-29 in", hip: "35-39 in", length: "59 in" },
    model_info: "Model is 5'10\" wearing Size S.",
    status: "published",
    rating: 4.9,
    reviews_count: 21,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-28T10:00:00Z",
    updated_at: "2026-10-08T12:00:00Z",
    variants: [
      { id: "var_cel_sapph_s", product_id: "prod_celeste_gown", title: "Royal Sapphire / S", sku: "DS-CEL-RS-S", size: "S", color: "Royal Sapphire", colorHex: "#1A365D", price: 5999, sale_price: 4499, inventory_quantity: 4, in_stock: true },
      { id: "var_cel_sapph_m", product_id: "prod_celeste_gown", title: "Royal Sapphire / M", sku: "DS-CEL-RS-M", size: "M", color: "Royal Sapphire", colorHex: "#1A365D", price: 5999, sale_price: 4499, inventory_quantity: 3, in_stock: true },
      { id: "var_cel_black_s", product_id: "prod_celeste_gown", title: "Obsidian Black / S", sku: "DS-CEL-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 5999, sale_price: 4499, inventory_quantity: 5, in_stock: true }
    ]
  },

  // 10. Miraya Banarasi Brocade Crop Top & Skirt (Festive & Fusion)
  {
    id: "prod_miraya_brocade",
    title: "Miraya Banarasi Brocade Festive Set",
    handle: "miraya-banarasi-brocade-festive-set",
    subtitle: "Handwoven zari brocade bustier with pleated A-line skirt",
    description: "Rooted in Indian textile royalty. Woven with heritage gold motifs, the Miraya set includes a structured sweetheart corset top and a high-waist flared circle skirt with pocket details.",
    category: "Festive & Fusion",
    collection: "Royal Heritage Edition",
    thumbnail: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Festive", "Brocade", "Banarasi", "Lehenga", "Wedding"],
    material: "Pure Silk Banarasi Brocade with Gold Zari",
    care_instructions: "Specialist dry clean only.",
    size_guide: { chest: "34-38 in", waist: "26-32 in", hip: "Free", length: "Skirt 42 in" },
    model_info: "Model is 5'7\" wearing Size S.",
    status: "published",
    rating: 5.0,
    reviews_count: 29,
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-14T10:00:00Z",
    updated_at: "2026-10-02T12:00:00Z",
    variants: [
      { id: "var_mir_emerald_s", product_id: "prod_miraya_brocade", title: "Emerald Green / S", sku: "DS-MIR-EG-S", size: "S", color: "Emerald Green", colorHex: "#0F4336", price: 8999, sale_price: 6999, inventory_quantity: 3, in_stock: true },
      { id: "var_mir_emerald_m", product_id: "prod_miraya_brocade", title: "Emerald Green / M", sku: "DS-MIR-EG-M", size: "M", color: "Emerald Green", colorHex: "#0F4336", price: 8999, sale_price: 6999, inventory_quantity: 4, in_stock: true },
      { id: "var_mir_wine_s", product_id: "prod_miraya_brocade", title: "Deep Wine / S", sku: "DS-MIR-DW-S", size: "S", color: "Deep Wine", colorHex: "#5B1425", price: 8999, sale_price: 6999, inventory_quantity: 2, in_stock: true }
    ]
  },

  // 11. The Zoya Asymmetric Draped Resort Co-ord (Co-ord Sets)
  {
    id: "prod_zoya_coord",
    title: "The Zoya Asymmetric Draped Co-ord Set",
    handle: "zoya-asymmetric-draped-coord-set",
    subtitle: "One-shoulder cascading sash top with fluid drape trousers",
    description: "Modern holiday glamour redefined. The Zoya set showcases an asymmetric one-shoulder cape top and fluid straight-leg pants tailored in lightweight terracotta textured crepe.",
    category: "Co-ord Sets",
    collection: "Sun-Drenched Resort & Street",
    thumbnail: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Co-ord", "Resort", "Asymmetric", "Sunset"],
    material: "100% Textured Air-Flow Poly Crepe",
    care_instructions: "Cold delicate wash.",
    size_guide: { chest: "32-38 in", waist: "26-32 in", hip: "36-42 in", length: "Pant 40 in" },
    model_info: "Model is 5'8\" wearing Size S.",
    status: "published",
    rating: 4.8,
    reviews_count: 15,
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-25T10:00:00Z",
    updated_at: "2026-10-07T12:00:00Z",
    variants: [
      { id: "var_zoy_rust_s", product_id: "prod_zoya_coord", title: "Terracotta Rust / S", sku: "DS-ZOY-TR-S", size: "S", color: "Terracotta Rust", colorHex: "#B85D43", price: 4999, sale_price: 3999, inventory_quantity: 4, in_stock: true },
      { id: "var_zoy_rust_m", product_id: "prod_zoya_coord", title: "Terracotta Rust / M", sku: "DS-ZOY-TR-M", size: "M", color: "Terracotta Rust", colorHex: "#B85D43", price: 4999, sale_price: 3999, inventory_quantity: 5, in_stock: true },
      { id: "var_zoy_beige_m", product_id: "prod_zoya_coord", title: "Sandstone Beige / M", sku: "DS-ZOY-SB-M", size: "M", color: "Sandstone Beige", colorHex: "#D9C5B2", price: 4999, sale_price: 3999, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 12. Isla Ruched Satin Cocktail Mini Dress (Dresses)
  {
    id: "prod_isla_mini",
    title: "Isla Sculpted Ruched Satin Mini Dress",
    handle: "isla-sculpted-ruched-satin-mini-dress",
    subtitle: "Drawstring side ruching with structured square neckline",
    description: "Flirty, feminine, and sculpting. The Isla mini features adjustable side drawstrings that let you customize the hemline length, paired with a clean square neckline and subtle shoulder caps.",
    category: "Dresses",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Party", "Mini Dress", "Ruched", "Cocktail"],
    material: "95% Stretch Satin, 5% Elastane",
    care_instructions: "Cold hand wash.",
    size_guide: { chest: "32-36 in", waist: "24-28 in", hip: "34-38 in", length: "33 in" },
    model_info: "Model is 5'7\" wearing Size XS.",
    status: "published",
    rating: 4.7,
    reviews_count: 18,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-17T10:00:00Z",
    updated_at: "2026-10-03T12:00:00Z",
    variants: [
      { id: "var_isla_blush_xs", product_id: "prod_isla_mini", title: "Blush Rose / XS", sku: "DS-ISL-BR-XS", size: "XS", color: "Blush Rose", colorHex: "#DDA7A5", price: 3999, sale_price: 2999, inventory_quantity: 4, in_stock: true },
      { id: "var_isla_blush_s", product_id: "prod_isla_mini", title: "Blush Rose / S", sku: "DS-ISL-BR-S", size: "S", color: "Blush Rose", colorHex: "#DDA7A5", price: 3999, sale_price: 2999, inventory_quantity: 6, in_stock: true },
      { id: "var_isla_black_s", product_id: "prod_isla_mini", title: "Obsidian Black / S", sku: "DS-ISL-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 3999, sale_price: 2999, inventory_quantity: 5, in_stock: true }
    ]
  },

  // 13. Kavya Handcrafted Zari Organza Saree Set (Festive & Fusion)
  {
    id: "prod_kavya_saree",
    title: "Kavya Handcrafted Zari Organza Saree Set",
    handle: "kavya-handcrafted-zari-organza-saree-set",
    subtitle: "Tissue organza 6-yard saree with readymade embroidered blouse",
    description: "Pure heirloom sophistication. Crafted from glistening tissue organza with delicate hand-scalloped zari borders. Accompanied by a fully stitched padded sweet-heart blouse adorned with pearls.",
    category: "Festive & Fusion",
    collection: "Royal Heritage Edition",
    thumbnail: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Festive", "Saree", "Organza", "Zari", "Wedding"],
    material: "Pure Tissue Organza with Zari Scalloping",
    care_instructions: "Dry clean only. Roll fold.",
    size_guide: { chest: "34-38 in (Blouse)", waist: "Free", hip: "Free", length: "5.5 meters" },
    model_info: "Model is 5'8\" wearing Blouse Size S.",
    status: "published",
    rating: 5.0,
    reviews_count: 31,
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-11T10:00:00Z",
    updated_at: "2026-10-01T12:00:00Z",
    variants: [
      { id: "var_kav_ivory_s", product_id: "prod_kavya_saree", title: "Ivory Pearl / S", sku: "DS-KAV-IV-S", size: "S", color: "Ivory Pearl", colorHex: "#F7F5F0", price: 10999, sale_price: 8499, inventory_quantity: 3, in_stock: true },
      { id: "var_kav_ivory_m", product_id: "prod_kavya_saree", title: "Ivory Pearl / M", sku: "DS-KAV-IV-M", size: "M", color: "Ivory Pearl", colorHex: "#F7F5F0", price: 10999, sale_price: 8499, inventory_quantity: 4, in_stock: true },
      { id: "var_kav_champ_s", product_id: "prod_kavya_saree", title: "Champagne Gold / S", sku: "DS-KAV-CG-S", size: "S", color: "Champagne Gold", colorHex: "#D4AF37", price: 10999, sale_price: 8499, inventory_quantity: 2, in_stock: true }
    ]
  },

  // 14. Luna Off-Shoulder Sculpted Corset Top (Tops & Shirts)
  {
    id: "prod_luna_top",
    title: "Luna Off-Shoulder Sculpted Corset Top",
    handle: "luna-off-shoulder-sculpted-corset-top",
    subtitle: "Draped off-shoulder sleeves with Basque waistline",
    description: "Architectural cocktail styling. The Luna top features soft off-shoulder mesh sleeves, a structured basque waist, and eyelet lace-up rear fastening.",
    category: "Tops & Shirts",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Tops", "Corset", "Off-Shoulder", "Evening"],
    material: "Stretch Crepe with Power Mesh Sleeves",
    care_instructions: "Hand wash cold.",
    size_guide: { chest: "32-36 in", waist: "24-28 in", hip: "N/A", length: "16 in" },
    model_info: "Model is 5'7\" wearing Size XS.",
    status: "published",
    rating: 4.8,
    reviews_count: 12,
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-27T10:00:00Z",
    updated_at: "2026-10-09T12:00:00Z",
    variants: [
      { id: "var_lun_black_xs", product_id: "prod_luna_top", title: "Obsidian Black / XS", sku: "DS-LUN-OB-XS", size: "XS", color: "Obsidian Black", colorHex: "#111111", price: 2999, sale_price: 2299, inventory_quantity: 5, in_stock: true },
      { id: "var_lun_black_s", product_id: "prod_luna_top", title: "Obsidian Black / S", sku: "DS-LUN-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 2999, sale_price: 2299, inventory_quantity: 6, in_stock: true },
      { id: "var_lun_blush_s", product_id: "prod_luna_top", title: "Blush Rose / S", sku: "DS-LUN-BR-S", size: "S", color: "Blush Rose", colorHex: "#DDA7A5", price: 2999, sale_price: 2299, inventory_quantity: 4, in_stock: true }
    ]
  },

  // 15. Ophelia Tiered Chiffon Maxi Sundress (Dresses)
  {
    id: "prod_ophelia_dress",
    title: "Ophelia Tiered Chiffon Maxi Sundress",
    handle: "ophelia-tiered-chiffon-maxi-sundress",
    subtitle: "Breezy tiered ruffle hem with tie-up shoulder ribbons",
    description: "Effortlessly romantic. Tailored in airy georgette chiffon with tiered ruffles, smocked stretch bodice, and delicate ribbon ties on the shoulders.",
    category: "Dresses",
    collection: "Sun-Drenched Resort & Street",
    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Resort", "Maxi", "Chiffon", "Sundress"],
    material: "100% Breathable Georgette with Modal Lining",
    care_instructions: "Delicate machine wash.",
    size_guide: { chest: "32-38 in (Smocked)", waist: "26-32 in", hip: "Free", length: "54 in" },
    model_info: "Model is 5'9\" wearing Size S.",
    status: "published",
    rating: 4.7,
    reviews_count: 14,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    created_at: "2026-09-16T10:00:00Z",
    updated_at: "2026-10-02T12:00:00Z",
    variants: [
      { id: "var_oph_rust_s", product_id: "prod_ophelia_dress", title: "Terracotta Rust / S", sku: "DS-OPH-TR-S", size: "S", color: "Terracotta Rust", colorHex: "#B85D43", price: 4499, sale_price: 3599, inventory_quantity: 4, in_stock: true },
      { id: "var_oph_rust_m", product_id: "prod_ophelia_dress", title: "Terracotta Rust / M", sku: "DS-OPH-TR-M", size: "M", color: "Terracotta Rust", colorHex: "#B85D43", price: 4499, sale_price: 3599, inventory_quantity: 5, in_stock: true },
      { id: "var_oph_beige_m", product_id: "prod_ophelia_dress", title: "Sandstone Beige / M", sku: "DS-OPH-SB-M", size: "M", color: "Sandstone Beige", colorHex: "#D9C5B2", price: 4499, sale_price: 3599, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 16. Ananya High-Waist Wide-Leg Palazzos (Trousers & Skirts)
  {
    id: "prod_ananya_palazzo",
    title: "Ananya High-Waist Fluid Satin Palazzos",
    handle: "ananya-high-waist-satin-palazzos",
    subtitle: "Voluminous wide-leg culottes with concealed side zipper",
    description: "Flowing movement for evening soirees. The Ananya palazzos cascade like a skirt with extra-wide leg hems and a clean contoured waistband.",
    category: "Trousers & Skirts",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Bottoms", "Palazzo", "Satin", "Evening"],
    material: "Fluid Heavy Crepe Satin",
    care_instructions: "Dry clean only.",
    size_guide: { chest: "N/A", waist: "26-32 in", hip: "38-44 in", length: "42 in" },
    model_info: "Model is 5'8\" wearing Size S.",
    status: "published",
    rating: 4.8,
    reviews_count: 11,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    created_at: "2026-09-21T10:00:00Z",
    updated_at: "2026-10-04T12:00:00Z",
    variants: [
      { id: "var_ana_wine_s", product_id: "prod_ananya_palazzo", title: "Deep Wine / S", sku: "DS-ANA-DW-S", size: "S", color: "Deep Wine", colorHex: "#5B1425", price: 3499, sale_price: 2699, inventory_quantity: 4, in_stock: true },
      { id: "var_ana_wine_m", product_id: "prod_ananya_palazzo", title: "Deep Wine / M", sku: "DS-ANA-DW-M", size: "M", color: "Deep Wine", colorHex: "#5B1425", price: 3499, sale_price: 2699, inventory_quantity: 5, in_stock: true },
      { id: "var_ana_black_l", product_id: "prod_ananya_palazzo", title: "Obsidian Black / L", sku: "DS-ANA-OB-L", size: "L", color: "Obsidian Black", colorHex: "#111111", price: 3499, sale_price: 2699, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 17. The Rhea Monochromatic Tweed Co-ord Suit (Co-ord Sets)
  {
    id: "prod_rhea_tweed",
    title: "The Rhea Monochromatic Tweed Co-ord Suit",
    handle: "rhea-monochromatic-tweed-coord-suit",
    subtitle: "Textured bouclé cropped jacket with matching A-line skirt",
    description: "Old money aesthetic crafted for the modern muse. Handwoven metallic-thread tweed with pearl-encrusted gold buttons, fringed hems, and satin inner lining.",
    category: "Co-ord Sets",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Co-ord", "Tweed", "Vintage", "Suit", "Luxury"],
    material: "Woven Bouclé Tweed with Silk Lining",
    care_instructions: "Professional dry clean only.",
    size_guide: { chest: "34-38 in", waist: "26-30 in", hip: "36-40 in", length: "Jacket 19 in / Skirt 17 in" },
    model_info: "Model is 5'8\" wearing Size S.",
    status: "published",
    rating: 4.9,
    reviews_count: 23,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-29T10:00:00Z",
    updated_at: "2026-10-10T12:00:00Z",
    variants: [
      { id: "var_rhe_ivory_s", product_id: "prod_rhea_tweed", title: "Ivory Pearl / S", sku: "DS-RHE-IV-S", size: "S", color: "Ivory Pearl", colorHex: "#F7F5F0", price: 7499, sale_price: 5899, inventory_quantity: 3, in_stock: true },
      { id: "var_rhe_ivory_m", product_id: "prod_rhea_tweed", title: "Ivory Pearl / M", sku: "DS-RHE-IV-M", size: "M", color: "Ivory Pearl", colorHex: "#F7F5F0", price: 7499, sale_price: 5899, inventory_quantity: 4, in_stock: true },
      { id: "var_rhe_black_s", product_id: "prod_rhea_tweed", title: "Obsidian Black / S", sku: "DS-RHE-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 7499, sale_price: 5899, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 18. Tara Embroidered Chanderi Festive Anarkali (Festive & Fusion)
  {
    id: "prod_tara_anarkali",
    title: "Tara Embroidered Chanderi Festive Anarkali",
    handle: "tara-embroidered-chanderi-anarkali",
    subtitle: "Kalidar flared anarkali suit with gota patti embellishments",
    description: "A celebration of Indian royalty. Handcrafted in pure Chanderi silk with 32 kalis for maximum flare, detailed with geometric gota work and metallic churidar pants.",
    category: "Festive & Fusion",
    collection: "Royal Heritage Edition",
    thumbnail: "https://images.unsplash.com/photo-1583391733975-dd2834b17c91?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583391733975-dd2834b17c91?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Festive", "Anarkali", "Chanderi", "Gota Patti"],
    material: "Pure Handloom Chanderi Silk with Santoon Lining",
    care_instructions: "Dry clean only.",
    size_guide: { chest: "34-42 in", waist: "28-36 in", hip: "Free", length: "52 in" },
    model_info: "Model is 5'7\" wearing Size M.",
    status: "published",
    rating: 4.9,
    reviews_count: 27,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    created_at: "2026-09-13T10:00:00Z",
    updated_at: "2026-10-01T12:00:00Z",
    variants: [
      { id: "var_tar_sapph_s", product_id: "prod_tara_anarkali", title: "Royal Sapphire / S", sku: "DS-TAR-RS-S", size: "S", color: "Royal Sapphire", colorHex: "#1A365D", price: 9499, sale_price: 7499, inventory_quantity: 3, in_stock: true },
      { id: "var_tar_sapph_m", product_id: "prod_tara_anarkali", title: "Royal Sapphire / M", sku: "DS-TAR-RS-M", size: "M", color: "Royal Sapphire", colorHex: "#1A365D", price: 9499, sale_price: 7499, inventory_quantity: 4, in_stock: true },
      { id: "var_tar_emerald_m", product_id: "prod_tara_anarkali", title: "Emerald Green / M", sku: "DS-TAR-EG-M", size: "M", color: "Emerald Green", colorHex: "#0F4336", price: 9499, sale_price: 7499, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 19. Chloe Plunging V-Neck Silk Wrap Blouse (Tops & Shirts)
  {
    id: "prod_chloe_blouse",
    title: "Chloe Plunging V-Neck Silk Wrap Blouse",
    handle: "chloe-plunging-v-neck-silk-wrap-blouse",
    subtitle: "Tie-waist surplice blouse with flared French cuffs",
    description: "Sensual and polished. The Chloe silk wrap top drapes flatteringly around the natural waist with long adjustable sash ties, bishop sleeves, and a deep surplice V-neckline.",
    category: "Tops & Shirts",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Tops", "Wrap", "Silk", "Cocktail"],
    material: "Mulberry Silk Crepe",
    care_instructions: "Dry clean or gentle hand wash.",
    size_guide: { chest: "32-38 in", waist: "Adjustable Wrap", hip: "N/A", length: "21 in" },
    model_info: "Model is 5'8\" wearing Size S.",
    status: "published",
    rating: 4.8,
    reviews_count: 15,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    created_at: "2026-09-23T10:00:00Z",
    updated_at: "2026-10-05T12:00:00Z",
    variants: [
      { id: "var_chl_champ_s", product_id: "prod_chloe_blouse", title: "Champagne Gold / S", sku: "DS-CHL-CG-S", size: "S", color: "Champagne Gold", colorHex: "#D4AF37", price: 3299, sale_price: 2499, inventory_quantity: 5, in_stock: true },
      { id: "var_chl_champ_m", product_id: "prod_chloe_blouse", title: "Champagne Gold / M", sku: "DS-CHL-CG-M", size: "M", color: "Champagne Gold", colorHex: "#D4AF37", price: 3299, sale_price: 2499, inventory_quantity: 4, in_stock: true },
      { id: "var_chl_emerald_s", product_id: "prod_chloe_blouse", title: "Emerald Green / S", sku: "DS-CHL-EG-S", size: "S", color: "Emerald Green", colorHex: "#0F4336", price: 3299, sale_price: 2499, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 20. Vesper Side-Slit High-Rise Column Skirt (Trousers & Skirts)
  {
    id: "prod_vesper_skirt",
    title: "Vesper Side-Slit High-Rise Column Skirt",
    handle: "vesper-side-slit-high-rise-column-skirt",
    subtitle: "Floor-sweeping satin maxi skirt with daring thigh slit",
    description: "Sculptural minimalism. Cut to sit high on the waist, falling in a clean column silhouette with a side zip closure and a walking slit positioned for dramatic movement.",
    category: "Trousers & Skirts",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Skirts", "Maxi", "Satin", "Evening"],
    material: "Heavy Weight Dutchess Satin",
    care_instructions: "Dry clean.",
    size_guide: { chest: "N/A", waist: "25-30 in", hip: "35-40 in", length: "41 in" },
    model_info: "Model is 5'9\" wearing Size S.",
    status: "published",
    rating: 4.7,
    reviews_count: 13,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    created_at: "2026-09-18T10:00:00Z",
    updated_at: "2026-10-02T12:00:00Z",
    variants: [
      { id: "var_ves_black_xs", product_id: "prod_vesper_skirt", title: "Obsidian Black / XS", sku: "DS-VES-OB-XS", size: "XS", color: "Obsidian Black", colorHex: "#111111", price: 3299, sale_price: 2499, inventory_quantity: 4, in_stock: true },
      { id: "var_ves_black_s", product_id: "prod_vesper_skirt", title: "Obsidian Black / S", sku: "DS-VES-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 3299, sale_price: 2499, inventory_quantity: 6, in_stock: true },
      { id: "var_ves_champ_s", product_id: "prod_vesper_skirt", title: "Champagne Gold / S", sku: "DS-VES-CG-S", size: "S", color: "Champagne Gold", colorHex: "#D4AF37", price: 3299, sale_price: 2499, inventory_quantity: 3, in_stock: true }
    ]
  },

  // 21. Scarlett Backless Cowl Velvet Slip Dress (Dresses)
  {
    id: "prod_scarlett_velvet",
    title: "Scarlett Backless Cowl Velvet Slip Dress",
    handle: "scarlett-backless-cowl-velvet-slip-dress",
    subtitle: "Plush wine velvet slip with low scooped back and spaghetti straps",
    description: "Sensual 90s nostalgia elevated for gala evenings. The Scarlett dress is cut on the bias from plush, reflective stretch velvet that catches ambient candlelight.",
    category: "Dresses",
    collection: "Midnight Runway Drop",
    thumbnail: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Velvet", "Slip Dress", "Cocktail", "Backless"],
    material: "92% Micro Velvet, 8% Spandex",
    care_instructions: "Dry clean only.",
    size_guide: { chest: "32-36 in", waist: "25-29 in", hip: "35-39 in", length: "52 in" },
    model_info: "Model is 5'8\" wearing Size S.",
    status: "published",
    rating: 4.9,
    reviews_count: 24,
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-30T10:00:00Z",
    updated_at: "2026-10-11T12:00:00Z",
    variants: [
      { id: "var_sca_wine_xs", product_id: "prod_scarlett_velvet", title: "Deep Wine / XS", sku: "DS-SCA-DW-XS", size: "XS", color: "Deep Wine", colorHex: "#5B1425", price: 4799, sale_price: 3699, inventory_quantity: 3, in_stock: true },
      { id: "var_sca_wine_s", product_id: "prod_scarlett_velvet", title: "Deep Wine / S", sku: "DS-SCA-DW-S", size: "S", color: "Deep Wine", colorHex: "#5B1425", price: 4799, sale_price: 3699, inventory_quantity: 5, in_stock: true },
      { id: "var_sca_black_s", product_id: "prod_scarlett_velvet", title: "Obsidian Black / S", sku: "DS-SCA-OB-S", size: "S", color: "Obsidian Black", colorHex: "#111111", price: 4799, sale_price: 3699, inventory_quantity: 4, in_stock: true }
    ]
  },

  // 22. Maya Bohemian Printed Kimono Co-ord Set (Co-ord Sets)
  {
    id: "prod_maya_kimono",
    title: "Maya Bohemian Printed Kimono Co-ord Set",
    handle: "maya-bohemian-printed-kimono-coord-set",
    subtitle: "Draped belted duster robe with matching high-rise lounge pants",
    description: "Vacation-luxe lounging at its finest. The Maya set features a fluid longline kimono with wide sleeves and a self-tie sash, paired with relaxed drawstring palazzo pants.",
    category: "Co-ord Sets",
    collection: "Sun-Drenched Resort & Street",
    thumbnail: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Resort", "Co-ord", "Kimono", "Boho"],
    material: "100% Modal Satin",
    care_instructions: "Cold delicate hand wash.",
    size_guide: { chest: "Free", waist: "26-34 in (Drawstring)", hip: "Free", length: "Robe 48 in / Pant 40 in" },
    model_info: "Model is 5'9\" wearing Size S.",
    status: "published",
    rating: 4.8,
    reviews_count: 16,
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    created_at: "2026-09-26T10:00:00Z",
    updated_at: "2026-10-06T12:00:00Z",
    variants: [
      { id: "var_may_rust_s", product_id: "prod_maya_kimono", title: "Terracotta Rust / S", sku: "DS-MAY-TR-S", size: "S", color: "Terracotta Rust", colorHex: "#B85D43", price: 4999, sale_price: 3799, inventory_quantity: 4, in_stock: true },
      { id: "var_may_rust_m", product_id: "prod_maya_kimono", title: "Terracotta Rust / M", sku: "DS-MAY-TR-M", size: "M", color: "Terracotta Rust", colorHex: "#B85D43", price: 4999, sale_price: 3799, inventory_quantity: 5, in_stock: true },
      { id: "var_may_emerald_m", product_id: "prod_maya_kimono", title: "Emerald Green / M", sku: "DS-MAY-EG-M", size: "M", color: "Emerald Green", colorHex: "#0F4336", price: 4999, sale_price: 3799, inventory_quantity: 3, in_stock: true }
    ]
  }
];

export const SEED_REVIEWS: ProductReview[] = [
  {
    id: "rev_1",
    product_id: "prod_aurelia_satin",
    author_name: "Pooja Hegde",
    rating: 5,
    headline: "Unreal drape and quality",
    comment: "The satin fabric feels genuinely liquid and heavy, exactly like runway couture. I wore this to a gala dinner in Bangalore and received countless compliments.",
    verified_buyer: true,
    created_at: "2026-09-28T14:32:00Z"
  },
  {
    id: "rev_2",
    product_id: "prod_aurelia_satin",
    author_name: "Ananya Deshmukh",
    rating: 5,
    headline: "Better than luxury mall brands",
    comment: "The lace-up back allows you to cinch the waist to your exact preference. Super fast delivery to Mumbai in just 2 days. 10/10 recommendation.",
    verified_buyer: true,
    created_at: "2026-10-03T09:12:00Z"
  },
  {
    id: "rev_3",
    product_id: "prod_kyra_coord",
    author_name: "Rhea Sen",
    rating: 5,
    headline: "Impeccable chic tailoring",
    comment: "The linen feel is crisp and breathable. Looks straight off a Parisian runway. Fits true to size.",
    verified_buyer: true,
    created_at: "2026-10-05T18:45:00Z"
  },
  {
    id: "rev_4",
    product_id: "prod_noor_velvet",
    author_name: "Kiranpreet Kaur",
    rating: 5,
    headline: "Royal velvet perfection",
    comment: "The embroidery details on the micro-velvet look so rich in real life. Worth every single rupee for festive wedding season.",
    verified_buyer: true,
    created_at: "2026-10-06T11:20:00Z"
  }
];
