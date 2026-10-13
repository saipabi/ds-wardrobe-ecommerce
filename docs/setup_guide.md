# DS WARDROBE — Developer Setup & Run Guide

**Project:** DS Wardrobe Modern Fashion Storefront & Headless Commerce Backend  
**Target Audience:** Engineering team, reviewers, and project maintainers.

---

## 1. System Requirements

- **Node.js:** v18.17.0+ or v20.x+ (Recommended: v20 LTS)
- **Package Manager:** `npm` (v9+) or `pnpm`
- **Operating System:** Windows 10/11, macOS, or Linux
- **Ports Required:**
  - `8000` — Commerce Backend API
  - `3000` — Next.js Fashion Storefront

---

## 2. Directory Structure

```text
e:\E-Commerce\
├── backend\                     # Headless Commerce Engine (Node.js + TypeScript + Express)
│   ├── data\                    # Persistent store data (store.json)
│   ├── src\
│   │   ├── routes\              # /api/store and /api/admin routes
│   │   ├── services\            # Product, Cart, Order, Auth, Admin & DB services
│   │   ├── types\               # Commerce TypeScript interfaces
│   │   └── index.ts             # Express Server entrypoint
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend\                    # Modern Decoupled Storefront (Next.js 16 + Tailwind CSS v4)
│   ├── public\                  # Static assets & brand media
│   ├── src\
│   │   ├── app\                 # Next.js App Router pages
│   │   │   ├── page.tsx         # Editorial Home & Instagram drops
│   │   │   ├── shop\            # Faceted Catalog & Search
│   │   │   ├── product\[id]\    # Product Details Page (PDP)
│   │   │   ├── cart\            # Shopping Bag & Discount Engine
│   │   │   ├── checkout\        # Multi-Step Indian Checkout
│   │   │   ├── order-confirmed\ # Order Confirmation & Receipt
│   │   │   ├── track-order\     # Live 5-Stage Tracking Timeline
│   │   │   ├── account\         # Customer Profile & Past Orders
│   │   │   ├── wishlist\        # Saved Items Gallery
│   │   │   └── admin\           # Admin Control Portal
│   │   ├── components\          # Modular UI components (Navbar, BottomNav, ProductCard...)
│   │   ├── context\             # Cart & Auth React Contexts
│   │   ├── lib\                 # Commerce API client
│   │   └── types\               # Storefront TypeScript definitions
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.ts / globals.css
│
└── docs\                        # Architecture and Intern Deliverables
    ├── design_analysis.md       # Brand, typography, color & mobile UX analysis
    ├── backend_evaluation.md    # 5-Way backend evaluation (Medusa, Vendure, Saleor...)
    └── setup_guide.md           # This document
```

---

## 3. Quickstart (Under 3 Minutes)

### Step 1: Clone & Configure Environment

```bash
git clone <repository_url>
cd E-Commerce
```

#### Backend Environment Setup:
```bash
cd backend
cp .env.example .env
```
Default `.env` values:
```env
PORT=8000
NODE_ENV=development
JWT_SECRET=ds_wardrobe_jwt_secret_dev_2026
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment Setup:
```bash
cd ../frontend
cp .env.example .env.local
```
Default `.env.local` values:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

### Step 2: Install Dependencies & Run Backend

In a terminal:
```bash
cd backend
npm install
npm run dev
```
> The backend server initializes on `http://localhost:8000`.  
> Health check: `http://localhost:8000/api/health` returns `{"status":"ok","timestamp":"..."}`.

---

### Step 3: Install Dependencies & Run Frontend

In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
> The Next.js frontend will launch on `http://localhost:3000`.  
> Visit `http://localhost:3000` in any modern desktop or mobile browser.

---

## 4. Default Seed Accounts & Credentials

### Administrator Portal
- **URL:** `http://localhost:3000/admin`
- **Email:** `admin@dswardrobe.com`
- **Password:** `admin123`
- **Capabilities:**
  - View real-time revenue metrics, order counts, and active inventory alerts.
  - Create and edit clothing items with multi-variant options (Size x Color x Stock).
  - Quick-adjust inventory stock levels with `+` / `-` buttons.
  - Advance order fulfillment status (`Pending` → `Processing` → `Shipped` → `Delivered`).
  - Create promotional coupon codes with percentage or flat rupee discounts.

### Patron Demo Account
- **URL:** `http://localhost:3000/account`
- **Email:** `patron@dswardrobe.com`
- **Password:** `patron123`
- *(Or register any new account instantly, or shop via Guest Checkout)*

### Available Promotional Coupons
Try applying these at `/cart` or `/checkout`:
- `DSFIRST10`: 10% off entire order (no minimum spend)
- `GLAM500`: Flat ₹500 discount on orders over ₹3,000
- `DSVIP20`: 20% VIP patron discount on orders over ₹5,000

---

## 5. Key Architecture & API Operations

### Store API (`/api/store`)
- `GET /api/store/products` — List catalog with filtering (`category`, `size`, `color`, `minPrice`, `maxPrice`, `search`, `sort`)
- `GET /api/store/products/:id` — Single product details with variant inventory matrix
- `GET /api/store/categories` — Clothing categories list
- `GET /api/store/collections` — Curated seasonal collections
- `GET /api/store/carts/:id` — Fetch active session bag
- `POST /api/store/carts` — Initialize new cart
- `POST /api/store/carts/:id/line-items` — Add variant to bag
- `POST /api/store/carts/:id/discounts` — Apply promo code
- `POST /api/store/orders` — Finalize order, auto-decrement stock, generate order ID (`DS-XXXXX`)
- `GET /api/store/orders/track/:orderNumber` — Live tracking timeline

### Admin API (`/api/admin`)
- `GET /api/admin/metrics` — Store statistics (Revenue, Orders, Inventory alerts)
- `GET /api/admin/products` / `POST /api/admin/products` / `PUT /api/admin/products/:id` — Product catalog control
- `PATCH /api/admin/inventory` — Quick variant stock adjuster
- `GET /api/admin/orders` / `PATCH /api/admin/orders/:id/status` — Fulfillment lifecycle progression
- `POST /api/admin/coupons` — Create promotional discounts

---

## 6. Troubleshooting

- **CORS Errors:** Ensure `backend/.env` has `FRONTEND_URL=http://localhost:3000` matching the Next.js port.
- **Port Conflicts:** If port `8000` or `3000` is occupied, adjust `PORT` in `backend/.env` and `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.
- **Database Reset:** If you want to restore original seed products and orders, delete `backend/data/store.json` and restart the backend server; it will automatically regenerate the clean seed state from `seedData.ts`.
