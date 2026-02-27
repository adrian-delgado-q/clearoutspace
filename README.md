# ClearoutSpaces

> Move-Out Done Right. Clearout. Deposit-ready cleaning. Optional listing management.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS v4 + PocketBase + Zod

---

## Quick Start

```bash
git clone https://github.com/your-org/clearoutspace.git
cd clearoutspace
npm install
docker compose up -d
```

The app will be available at:
- Frontend: `http://localhost:3000`
- PocketBase: `http://localhost:8090`

---

## Running Locally

Use Docker Compose for the full stack:

```bash
docker compose up -d
```

This starts:
- **Next.js frontend** at `http://localhost:3000`
- **PocketBase** at `http://localhost:8090`
- **Caddy reverse proxy** (handles routing, SSL, and HTTP/2)

---

## Modal Routing

The listing detail page uses Next.js intercepting routes with parallel slots.

Clicking a listing card on `/listings` opens a modal overlay while keeping the page in the background.  
Directly visiting `/listings/[slug]` renders the listing as a full page.

**File structure:**
```
app/listings/
  layout.tsx              ← declares @modal parallel slot
  page.tsx                ← /listings index
  [slug]/page.tsx         ← full-page fallback
  @modal/
    default.tsx           ← renders null (no modal active)
    (.)[slug]/page.tsx    ← intercept: renders Modal wrapper
```

**Key behaviours:**
- Close button uses `router.back()` to preserve browser history
- Direct link to `/listings/[slug]` renders without modal wrapper
- Same `ListingDetail` component is used in both contexts

---

## Key Features

- **Responsive design** with Tailwind CSS v4
- **Real-time listing sync** with PocketBase
- **Privacy-first** – no address storage (neighbourhoods only)
- **WhatsApp integration** – all CTAs flow through attribution engine
- **Optimized images** – remote patterns configured for PocketBase uploads
- **SEO-ready** – metadata generation for all pages
- **Docker support** – standalone Next.js build for easy deployment

---

## Project Structure

```
app/                    Next.js App Router pages
  layout.tsx            Root layout (Inter font, Navbar, Footer)
  page.tsx              Homepage
  services/page.tsx     Services page (zig-zag layout)
  pricing/page.tsx      Pricing page
  faq/page.tsx          FAQ accordion
  listings/             Listing grid + detail + modal routing

components/
  layout/               Navbar, Footer, Container
  ui/                   Button, Card, Badge, Input, Modal
  sections/             Hero, SmartWay, ServicesPreview, TrustRow,
                        PricingVariables, FinalCTA, ListingMgmtPreview,
                        FAQAccordion
  services/             ServiceBlock (alternating layout)
  listings/             ListingCard, ListingGrid, ListingSearchBar,
                        ListingDetail, ListingEmptyState, ListingsClient

lib/
  pocketbase.ts         PocketBase fetch helpers & client
  schemas/index.ts      Zod schemas for data validation
  seo.ts                SEO metadata generation
  whatsapp.ts           WhatsApp deep-link builder with attribution
  dates.ts              Listing expiry utilities

backend/uploads/        PocketBase uploaded files
pocketbase/             PocketBase Docker setup & seed scripts
infra/                  Deployment config (Caddyfile, scripts)
tests/                  Vitest test files
```

---

> **Privacy note:** Listings store only general neighbourhoods (e.g., "Liberty Village").
> No street addresses are stored or displayed.
