# DS WARDROBE — E-Commerce Clothing Website

> **Intern Project Brief Deliverable**  
> **Brand & Business Reference:** [@ds__wardrobe__ on Instagram](https://www.instagram.com/ds__wardrobe__/)  
> **Project Type:** Modern Fashion / Clothing Decoupled E-Commerce Platform  
> **Design Philosophy:** Premium Runway Aesthetic, Mobile-First UX, Pan-India Commerce Engine  
>  
> 🌐 **Live Storefront:** [https://ds-wardrobe-ecommerce.vercel.app](https://ds-wardrobe-ecommerce.vercel.app)  
> ⚙️ **Live Admin Portal:** [https://ds-wardrobe-ecommerce.vercel.app/admin](https://ds-wardrobe-ecommerce.vercel.app/admin) (Credentials: `admin@dswardrobe.com` / `admin123`)  
> ⚡ **Cloud Commerce API:** [https://ds-wardrobe-ecommerce.onrender.com](https://ds-wardrobe-ecommerce.onrender.com)  

---

## 🌟 Executive Overview

**DS WARDROBE** is an e-commerce platform designed for the contemporary fashion boutique **DS Wardrobe**. Translating the brand's Instagram presence into a modern headless online shopping destination, the storefront delivers an editorial experience tailored for Gen-Z and Millennial fashion connoisseurs.

Built with a **decoupled headless commerce architecture**, the application separates the presentation layer from backend commerce logic, ensuring lightning-fast mobile responsiveness, independent scalability, and design flexibility.

---

## 📸 Brand & Visual Aesthetic

- **Color Palette:** Warm Alabaster (`#FBFBFB`), Obsidian Night (`#0E0E10`), Champagne Gold (`#D4AF37`), Sunset Terracotta (`#E06D53`).
- **Typography:** Editorial Serif (`Playfair Display` / `Cinzel`) paired with geometric UI typography (`Plus Jakarta Sans`).
- **Mobile-First UX:** Sticky thumb-navigation, bottom-sheet size guides, touch-optimized swatches, fast bag drawer, and one-tap checkout.
- **Social Integration:** Live "Shop Instagram" visual lookbook where patrons browse styled looks directly from the feed.

---

## 🏗️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│             Decoupled Next.js 16 Storefront            │
│      (App Router, TypeScript, Tailwind CSS v4)         │
└───────────────────────────▲────────────────────────────┘
                            │ RESTful JSON APIs
┌───────────────────────────▼────────────────────────────┐
│          Headless Commerce Engine (Node.js/TS)         │
│  (Catalog, Variants, Cart, Coupons, Orders, Admin API) │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│            Transactional Commerce Database             │
│        (Persistent Products, Carts, Orders, Users)     │
└────────────────────────────────────────────────────────┘
```

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend Storefront** | Next.js 16 (App Router), React 19, TypeScript | Mobile-first responsive UI, SSR/Turbopack, Client Contexts |
| **Styling** | Tailwind CSS v4, Lucide Icons | Fluid typography, glassmorphism, responsive grids |
| **Commerce Backend** | Node.js, Express, TypeScript | Headless REST APIs (Storefront & Admin scopes) |
| **Persistence** | Relational Transactional JSON Store | Real-time stock decrement, cart persistence, coupons |
| **State & Flow** | React Context API | Dynamic Cart Drawer, Patron Auth Session, Wishlist |

---

## 🚀 Key Features & Customer Journey

1. **Editorial Homepage (`/`)**
   - Immersive hero drop banner with call-to-action buttons.
   - Story highlights bar replicating Instagram drops.
   - Seasonal collections showcase & trending runway picks.
   - Brand manifesto and client testimonials.
   - Interactive Instagram Lookbook feed.

2. **Faceted Shop Catalog (`/shop`)**
   - Instant search with live debounce.
   - Multi-facet filters: Categories, Sizes (XS–XXL), Colors, Price slider, and In-Stock toggles.
   - Dynamic sorting (Featured, Price: Low to High, Price: High to Low, Rating).
   - Empty state fallbacks with instant filter reset.

3. **Product Details Page (`/product/:id`)**
   - High-resolution multi-view gallery with preview selector.
   - Interactive color swatches and Indian sizing selector (XS, S, M, L, XL, XXL).
   - Real-time stock counter and low-inventory warnings (*"Only 2 left"*).
   - Out-of-stock disablement guards.
   - Detailed specifications, fabric care, and modal Size Guide.
   - Patron customer reviews with average ratings and submission form.
   - Dynamic related product recommendations.

4. **Cart & Bag Drawer (`/cart`)**
   - Slide-over bag drawer accessible on all pages.
   - Quantity modifier and line item deletion.
   - Coupon discount engine with real-time recalculation (`DSFIRST10`, `GLAM500`, `DSVIP20`).
   - Free shipping progress bar (Free delivery over ₹2,999).

5. **Pan-India Checkout (`/checkout`)**
   - Contact details and phone number validation.
   - Pan-India shipping address with 28 Indian States & UTs dropdown.
   - 6-digit Indian PIN code validation.
   - Multiple payment methods: UPI (Google Pay / PhonePe / Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD).
   - Dynamic order summary with coupon verification.

6. **Order Receipt & Live Tracking (`/order-confirmed/:id` & `/track-order`)**
   - Unique generated order reference (e.g. `DS-38589`).
   - Estimated delivery timeline and carrier tracking number.
   - 5-stage visual progress tracker: *Order Confirmed → Processing → Tailored & Packed → In Transit → Out for Delivery → Delivered*.

7. **Patron Account (`/account` & `/wishlist`)**
   - Authentication toggle (Login & Patron Registration).
   - Profile management with default shipping addresses.
   - Past order history with instant re-order and track links.
   - Dedicated Wishlist gallery.

8. **Admin Control Portal (`/admin`)**
   - Executive dashboard: Total Revenue, Orders count, Low-Stock alerts.
   - Real-time Product Catalog Manager: Create, edit, and update prices/descriptions.
   - Variant Inventory Controller: Instant `+` and `-` stock adjusters.
   - Order Fulfillment Pipeline: Change statuses (*Pending → Processing → Shipped → Delivered*).
   - Coupon Discount Creator: Issue new percentage or flat discount vouchers.

---

---

## ⚡ Quickstart & Local Setup

You can run DS Wardrobe either **natively with Node.js** (zero external dependencies) or as a **fully containerized stack with Docker Compose** (Frontend + Backend + PostgreSQL + Redis).

### Option A: Native Node.js Run (Recommended for Instant Local Dev)

```bash
# 1. Start Commerce Backend API (Port 8000)
cd backend
cp .env.example .env
npm install
npm run dev

# 2. In a second terminal, start Next.js Storefront (Port 3000)
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```
> Backend runs at `http://localhost:8000` (Health check: `/api/health`).  
> Storefront runs at `http://localhost:3000`.

### Option B: 1-Command Full Containerized Stack (Docker Compose)

Runs the **Next.js Storefront**, **Express Commerce API**, **PostgreSQL 16**, and **Redis 7** in isolated containers:
```bash
cp .env.example .env
docker compose up -d --build
```
> See [docs/deployment_guide.md](docs/deployment_guide.md) for complete Cloud and Kubernetes deployment instructions.

---

## 🔐 Credentials & Testing Data

### Admin Portal
- **URL:** `http://localhost:3000/admin`
- **Email:** `admin@dswardrobe.com`
- **Password:** `admin123`

### Patron Customer Account
- **URL:** `http://localhost:3000/account`
- **Email:** `patron@dswardrobe.com`
- **Password:** `patron123`

### Promotional Coupons
- `DSFIRST10` — 10% off entire order
- `GLAM500` — Flat ₹500 discount on orders over ₹3,000
- `DSVIP20` — 20% discount on orders over ₹5,000

---

## 📋 Intern Deliverables Checklist

| # | Deliverable | Status | Reference / Path |
| :---: | :--- | :---: | :--- |
| **1** | Review DS Wardrobe Instagram reference & design analysis | ✅ Complete | [`docs/design_analysis.md`](docs/design_analysis.md) |
| **2** | Compare 5 open-source backend repositories & document selection | ✅ Complete | [`docs/backend_evaluation.md`](docs/backend_evaluation.md) |
| **3** | Create frontend UI & responsive mobile-first layouts | ✅ Complete | `frontend/src/app` |
| **4** | Set up selected commerce backend locally | ✅ Complete | `backend/src/index.ts` |
| **5** | Connect frontend to backend APIs | ✅ Complete | `frontend/src/lib/api.ts` |
| **6** | Implement product/category/variant/inventory management | ✅ Complete | `backend/src/services/` |
| **7** | Implement cart & checkout flow | ✅ Complete | `frontend/src/app/cart` & `/checkout` |
| **8** | Implement authentication, account & order tracking pages | ✅ Complete | `/account`, `/track-order` |
| **9** | Implement admin operations (products, stock, orders, coupons) | ✅ Complete | `frontend/src/app/admin` |
| **10** | Add validation, error handling, loading & empty states | ✅ Complete | Form validations & UI skeletons |
| **11** | Add sample DS Wardrobe products for demonstration | ✅ Complete | `backend/src/data/seedData.ts` (22 luxury couture products) |
| **12** | Write comprehensive setup documentation | ✅ Complete | [`docs/setup_guide.md`](docs/setup_guide.md) & `README.md` |
| **13** | Clean git version control commits | ✅ Complete | Git repository structure |

---

## 🎯 Verification against Definition of Done

- [x] **A user can open the website on mobile and desktop:** Fully responsive Tailwind CSS layout with mobile bottom navigation.
- [x] **A user can browse products and collections:** Dedicated seasonal collections, category filter, and rich card previews.
- [x] **A user can search and filter products:** Real-time multi-facet filtering (category, size, color, price slider, search).
- [x] **A user can select clothing variants such as size/color:** Size buttons (XS–XXL) with inventory feedback and color swatches.
- [x] **A user can add products to cart and modify quantities:** Persistent bag state, increment/decrement, and slide drawer.
- [x] **A user can complete the checkout flow:** Form validation, Indian state dropdown, payment method selection, and order receipt.
- [x] **An order appears in the admin/backend after successful checkout:** Automatic order creation, stock decrement, and admin status management.
- [x] **Admin can update products, prices and stock:** Full control panel at `/admin` with quick stock buttons.
- [x] **No hard-coded product data is required for normal operation:** All catalog data fetched via REST APIs from backend persistence.
- [x] **The application handles API failures gracefully:** Toast alerts, error fallbacks, and retry mechanisms.
- [x] **The repository includes README, env documentation and setup instructions:** `README.md`, `docs/setup_guide.md`, `.env.example`.
- [x] **The application is responsive and visually polished:** Editorial luxury lookbook aesthetic inspired by `@ds__wardrobe__`.

---

## 📜 Documentation Links

- [Brand & Design Analysis Document](docs/design_analysis.md)
- [Backend Evaluation & Architecture Matrix](docs/backend_evaluation.md)
- [Developer Setup & Operation Guide](docs/setup_guide.md)
- [Production Cloud & Docker Deployment Guide](docs/deployment_guide.md)
