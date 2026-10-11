# OmniTech — Omnichannel Tech Marketplace & Reservation Platform

A full-stack, enterprise-grade Omnichannel Tech Marketplace built with **React / Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **NestJS**, and **Supabase (PostgreSQL)**.

---

## 🌟 Core Concepts & Features

### 🛒 Customer Experience
* **Home Page**: Featured electronics, latest deals, popular tech categories, and nearby partner stores.
* **Categories**: Laptops, Smartphones, Gaming Consoles, PC Parts (GPUs/CPUs), Mirrorless Cameras, Home Appliances.
* **Search & Live Filtering**: Search by title, model, or brand. Filter by **CPU**, **GPU**, **RAM**, **Storage**, **Condition** (*Brand New, Like New, Refurbished, Used*), Price Range, and City.
* **Product Details**: Photo gallery, technical specifications matrix, condition grade, battery cycle health %, hardware warranty, and store location.
* **Compare Products**: Side-by-side comparison matrix comparing up to 4 devices (prices, processors, graphics cards, RAM, storage, battery health).
* **"Book Now" Store Reservation**: Zero upfront payment reservation system with a 48-hour hold guarantee.
* **Direct Seller WhatsApp & Call**: One-click WhatsApp deep-linking with pre-filled device inquiry details and direct phone call support.
* **Nearby Stores**: Local partner store locator with ratings and physical addresses.
* **Wishlist**: Quick-save favorite tech items to local storage.

### 🏢 Store Owner Admin Portal (`/admin`)
* **Merchant Dashboard**: Real-time inventory value ($), available units, reserved units, sold units, pending store visit bookings, and inquiries.
* **Product & Spec Management**: Add, edit, and delete listings with CPU, GPU, RAM, storage, condition, photos, price, offers, and warranty.
* **Availability Control**: Instant status toggles between `AVAILABLE`, `RESERVED`, and `SOLD`.
* **Booking Workflow**: View customer reservations and change status to `CONFIRMED`, `COMPLETED (SOLD)`, or `REJECTED`.
* **Customer Enquiries**: View customer questions with direct 1-click WhatsApp reply buttons.

### 👑 Super Admin Platform Portal (`/super-admin`)
* **Platform Governance**: Overview of platform-wide GMV, active listings, and total customer bookings.
* **Store Verification Table**: Review newly registered stores and approve or revoke store licenses with one click.
* **Global Marketplace Moderation**: Inspect all live products across all partner stores.

---

## 🏗️ Architecture & Tech Stack

```
E-com/
├── apps/
│   ├── web/                     # Next.js 16 (App Router, Tailwind CSS, Lucide icons)
│   │   ├── src/app/
│   │   │   ├── page.tsx         # Customer Marketplace & Search Filters
│   │   │   ├── products/[slug]/ # Product Details & Specs Matrix
│   │   │   ├── compare/         # Side-by-Side Comparison Matrix
│   │   │   ├── stores/[slug]/   # Store Profile & Location Listings
│   │   │   ├── admin/           # Store Owner Admin Dashboard
│   │   │   └── super-admin/     # Super Admin Platform Governance
│   │   └── src/lib/api.ts       # Unified API Client
│   │
│   └── api/                     # NestJS REST API
│       ├── src/
│       │   ├── auth/            # Authentication & Roles
│       │   ├── stores/          # Store Profiles & Haversine Geolocation
│       │   ├── products/        # Products & Tech Spec Filtering
│       │   ├── bookings/        # "Book Now" In-Store Reservations
│       │   ├── enquiries/       # Customer Leads & Enquiries
│       │   ├── admin/           # Dashboard Analytics & Moderation
│       │   ├── seed/            # Seed data & in-memory catalog
│       │   └── prisma/          # Prisma Client Service
│       └── prisma/schema.prisma # PostgreSQL Data Models
│
├── docker/                      # Multi-stage Dockerfiles
├── docker-compose.yml           # Multi-service container orchestration
└── .github/workflows/ci.yml     # Automated CI/CD GitHub Actions
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
```

### 2. Configure Supabase PostgreSQL (Optional for DB Sync)
Your Supabase credentials are pre-configured in `apps/api/.env` and `apps/web/.env.local`.

To connect Prisma directly to your live Supabase PostgreSQL database:
1. Open `apps/api/.env`.
2. Replace `YOUR_DB_PASSWORD` in `DATABASE_URL` with your actual Supabase database password:
   ```env
   DATABASE_URL="postgresql://postgres.qbdemyzzabmzzlttbkuw:YOUR_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
3. Run the schema migration:
   ```bash
   npm run prisma:push --workspace=api
   ```
*(Note: If you have not entered the database password yet, the backend automatically runs with an in-memory catalog so everything is immediately testable without crashing!)*

### 3. Start Both Frontend and Backend Concurrently
Run:
```bash
npm run dev
```

* **Customer Marketplace**: [http://localhost:3000](http://localhost:3000)
* **Store Owner Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
* **Super Admin Portal**: [http://localhost:3000/super-admin](http://localhost:3000/super-admin)
* **Compare Devices**: [http://localhost:3000/compare](http://localhost:3000/compare)
* **NestJS API Server**: [http://localhost:4000](http://localhost:4000)
* **Interactive Swagger Docs**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 🐳 Running with Docker

Build and run all services in containers:
```bash
docker-compose up --build
```
