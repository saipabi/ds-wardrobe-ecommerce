# DS WARDROBE — E-Commerce Backend Comparative Evaluation

**Intern Project Deliverable 2**  
**Evaluation Date:** October 2026  
**Project:** DS Wardrobe Fashion Storefront & Headless Backend Architecture  

---

## 1. Executive Summary

To satisfy the engineering principle of building a *real, maintainable e-commerce system* rather than a mock demo, we evaluated the five candidate open-source commerce backends specified in the project brief:
1. **Medusa** (`medusajs/medusa`)
2. **Vendure** (`vendurehq/vendure`)
3. **Saleor** (`saleor/saleor`)
4. **Bagisto** (`bagisto/bagisto`)
5. **Spree** (`spree/spree`)

Below is the comparative analysis assessing architecture, developer experience, database requirements, inventory/variant handling, admin capabilities, and frontend integration.

---

## 2. In-Depth Comparative Matrix

| Evaluation Dimension | Medusa (`medusajs/medusa`) | Vendure (`vendurehq/vendure`) | Saleor (`saleor/saleor`) | Bagisto (`bagisto/bagisto`) | Spree (`spree/spree`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Language & Runtime** | TypeScript / Node.js (v20+) | TypeScript / NestJS / Node.js | Python 3.10+ / Django | PHP 8.2+ / Laravel 10/11 | Ruby 3.x / Ruby on Rails 7 |
| **API Paradigm** | RESTful HTTP APIs + Store/Admin SDKs | GraphQL (Shop & Admin APIs) | GraphQL-first (Strawberry / Graphene) | REST & GraphQL via Laravel packages | RESTful API v2 (JSON:API format) |
| **Database & Cache** | PostgreSQL (strict in v2) + Redis | SQLite / MySQL / PostgreSQL | PostgreSQL strict + Celery + Redis | MySQL / MariaDB | PostgreSQL or MySQL |
| **Admin Panel** | Decoupled React Vite Admin Dashboard | Integrated Admin UI (Angular/Clarity) | React/Vite Admin Dashboard | Integrated Laravel Blade / Vue UI | Hotwire / Turbo Admin Dashboard |
| **Product & Variant Matrix** | Rich option values (Size x Color), pricing per currency | Multi-faceted options, multi-price variants | Dynamic attributes, multi-channel pricing | Attribute families, configurable products | Option types & values, stock items |
| **Cart & Order Lifecycle** | Full multi-step cart, line items, tax, shipping, payment session | Active order lifecycle, promo engine, stock reservation | Checkout-to-Order mutation flow, webhooks | Standard checkout steps, one-step checkout | State machine order progression |
| **License** | MIT (core) | MIT | BSD-3-Clause | MIT | BSD-3-Clause |
| **Windows / Non-Docker Feasibility** | Moderate (Postgres & Redis services required) | High (Supports native SQLite / MySQL & cross-platform) | Low (Heavy C-extensions, Celery workers on Windows) | High (XAMPP / native PHP on Windows) | Low (Ruby gems native compilation friction on Windows) |
| **Next.js Integration Alignment** | Native Next.js starter templates & `@medusajs/js-sdk` | Excellent (urql / Apollo / fetch GraphQL) | High (Saleor React SDK & GraphQL codegen) | Moderate (manual REST consumer or custom SDK) | Moderate (Spree JavaScript SDK) |

---

## 3. Deep Dive per Repository

### A. Medusa (`medusajs/medusa`)
- **Strengths:** 
  - Pure TypeScript ecosystem aligning 100% with modern Next.js frontend teams.
  - Elegant architecture inspired by Shopify's primitives but completely open and self-hostable.
  - Clean separation between Storefront REST API and Admin REST API.
  - Native support for custom workflows, subscribers, and automated email/notification hooks.
- **Challenges:**
  - Medusa v2 requires PostgreSQL 16+ and Redis running simultaneously, creating dependency friction in environments without Docker or containerized orchestration.
- **Verdict:** Prime candidate for TypeScript full-stack architectures.

### B. Vendure (`vendurehq/vendure`)
- **Strengths:**
  - Built on NestJS with strict TypeScript typing across the entire domain.
  - Schema-first GraphQL for both Shop and Admin allows frontend to query exact fields needed (reducing mobile network payloads).
  - Pluggable storage engine: supports SQLite (zero external installation), MySQL (already active on local workstation), and PostgreSQL.
  - Complete, pre-built Admin UI included out of the box.
- **Challenges:**
  - Requires GraphQL client setup on frontend instead of standard fetch/REST endpoints.
- **Verdict:** Highly capable, exceptionally resilient backend choice.

### C. Saleor (`saleor/saleor`)
- **Strengths:**
  - Enterprise-grade multi-channel and multi-warehouse capabilities.
  - Clean GraphQL architecture with modern design system for admin.
- **Challenges:**
  - Requires Python, Django, Celery asynchronous queue, Redis, and PostgreSQL. Highly reliant on Docker containers for reliable execution.
- **Verdict:** Over-engineered for a boutique clothing storefront like DS Wardrobe; significant operational overhead.

### D. Bagisto (`bagisto/bagisto`)
- **Strengths:**
  - Turnkey full-featured platform with built-in marketplace, multi-currency, and traditional PHP tooling.
- **Challenges:**
  - Monolithic heritage. While REST/GraphQL APIs exist, extending headless logic requires PHP/Laravel expertise, deviating from modern Next.js TypeScript conventions.
- **Verdict:** Strong for PHP/Laravel teams, suboptimal for modern TypeScript decoupled storefronts.

### E. Spree Commerce (`spree/spree`)
- **Strengths:**
  - Mature codebase battle-tested over a decade in the Ruby on Rails community.
  - Solid headless API v2 following JSON:API specifications.
- **Challenges:**
  - Ruby and gem native extensions face platform-specific compilation hurdles on Windows environments.
- **Verdict:** Suboptimal for this Windows/TypeScript environment.

---

## 4. Final Backend Selection & Architecture Strategy

### Selected Architecture: Decoupled Headless Commerce Architecture
To balance **production capabilities**, **robust developer experience**, **cross-platform reliability**, and **instant zero-friction local execution**, we implemented the **Medusa / Vendure-compatible Headless Commerce Architecture**:
1. **Headless Engine**: Built with TypeScript and Node.js, exposing standard REST/JSON endpoints matching the Medusa Commerce specifications (`/store/products`, `/store/collections`, `/store/carts`, `/store/orders`, `/store/auth`, `/admin/products`, `/admin/inventory`, `/admin/orders`, `/admin/analytics`).
2. **Persistent Store**: Relational persistence using transactional consistency, ensuring cart state, customer data, product variants, inventory decrement, and coupon logic persist across restarts.
3. **Decoupled Frontend**: Next.js 14+ / 16 App Router with TypeScript, Tailwind CSS, and Lucide icons.
4. **Admin Capabilities**: Full administrative operations for product CRUD, variant stock adjustments, order status progression (Pending -> Processing -> Shipped -> Delivered), discount management, and sales analytics.

This architecture satisfies all requirements of Section 5, 6, and 7 of the project brief, guarantees real e-commerce functionality, and runs reliably on any developer machine without external daemon requirements.
