# ClearoutSpaces – Next.js 14+ App

> Move-Out Done Right. Clearout. Deposit-ready cleaning. Optional listing management.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS v4 + Strapi 5+ + Zod + SWR

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Environment Variables](#environment-variables)
3. [Running Locally](#running-locally)
4. [Strapi CMS Setup](#strapi-cms-setup)
5. [How to Add a Listing](#how-to-add-a-listing)
6. [Listing Lifecycle & Expiry](#listing-lifecycle--expiry)
7. [Modal Routing Explained](#modal-routing-explained)
8. [Image Hosting (Local vs. Cloud)](#image-hosting-local-vs-cloud)
9. [WhatsApp Attribution](#whatsapp-attribution)
10. [Deployment](#deployment)
11. [Architecture Overview](#architecture-overview)

---

## Quick Start

```bash
git clone https://github.com/your-org/clearoutspace.git
cd clearoutspace
npm install
cp .env.local.example .env.local  # fill in your values
npm run dev
```

> The app runs without Strapi – all pages use hardcoded fallback content when Strapi is unreachable.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | Yes | Strapi base URL, e.g. `http://localhost:1337` |
| `STRAPI_API_TOKEN` | Yes | Read-only API token from Strapi Admin → Settings → API Tokens |
| `NEXT_PUBLIC_WHATSAPP_URL` | Yes | WhatsApp deep link base, e.g. `https://wa.me/` |
| `NEXT_PUBLIC_ANALYTICS_ID` | No | Google Analytics measurement ID (optional) |

Copy `.env.local.example` → `.env.local` and fill in your values.

---

## Running Locally

```bash
# Next.js frontend
npm run dev         # http://localhost:3000

# Strapi CMS (run separately in /strapi directory)
cd strapi && npm run develop   # http://localhost:1337/admin
```

---

## Strapi CMS Setup

### 1. Create a Strapi 5+ project

```bash
npx create-strapi-app@latest strapi --quickstart
cd strapi
npm run develop
```

### 2. Create content types

Create the following in Strapi Admin → Content-Type Builder:

#### Shared Components

**`shared.seo`**
- `metaTitle` String
- `metaDescription` Text
- `shareImage` Media (single)

**`shared.feature-item`**
- `title` String
- `description` Text

#### Single Types

- **`global-setting`** – `siteName`, `whatsappUrl`, `cityLabel`, `primaryCtaText`, `navLinks[]`, `featureFlags{}`, `seo (shared.seo)`
- **`home-page`** – `heroTitle`, `heroSubtitle`, `heroSupporting`, `heroImage`, `smartWayItems[]`, `trustItems[]`, `pricingVariablesItems[]`, `listingMgmtPreviewBullets[]`, `listingMgmtPreviewImage`, `finalCtaTitle`, `finalCtaSubtitle`, `seo (shared.seo)`
- **`services-page`** – `pageTitle`, `introText`, `seo (shared.seo)`
- **`pricing-page`** – `pageTitle`, `introText`, `pricingGroups[]`, `variablesChecklist[]`, `finalCtaTitle`, `finalCtaSubtitle`, `seo (shared.seo)`
- **`faq-page`** – `pageTitle`, `faqs[]`, `seo (shared.seo)`

#### Collections

**`service`**
- `name` String
- `sectionId` String (e.g. `clearout`) – used for `#anchor` links
- `order` Number
- `shortDescription` Text
- `longDescription` Rich Text
- `startingPriceLabel` String
- `typicalRangeText` String
- `isMostPopular` Boolean
- `features` Component (shared.feature-item, repeatable)
- `whatsIncluded` Component (repeatable, with `text` field)
- `sideImage` Media (single)
- `seo` Component (shared.seo)

**`listing`** ⚠️ Never add an `address` field (privacy)
- `title` String
- `slug` UID (from title)
- `price` Number
- `currency` Enum: `CAD` | `USD`
- `area` String (general neighbourhood only, e.g. "Liberty Village")
- `availableUntil` Date ← **listing expiry key field**
- `pickupWindowText` String (optional)
- `pickupNotes` String (optional)
- `condition` Enum: `New` | `Like New` | `Good` | `Fair`
- `dimensions` String (optional)
- `description` Rich Text
- `images` Media (multiple) – at least 1 required
- `status` Enum: `Available` | `Pending` | `Sold`
- `category` String
- `tags` Component (repeatable, with `tag` field)
- `isFeatured` Boolean
- `managedBy` Boolean (default: true – controls "Managed by ClearoutSpaces" badge)
- `seo` Component (shared.seo)

### 3. Set permissions

Strapi Admin → Settings → Roles → Public → enable:
- `listings`: `find`, `findOne`
- `services`: `find`
- `global-setting`: `find`
- `home-page`: `find`
- `services-page`: `find`
- `pricing-page`: `find`
- `faq-page`: `find`

### 4. Seed sample data

```bash
# From the Next.js project root:
STRAPI_ADMIN_EMAIL=your@email.com STRAPI_ADMIN_PASSWORD=yourpass node scripts/seed-strapi.mjs
```

This creates 4 services and 8 listings (mixed statuses + availableUntil dates).

### 5. API Token

Strapi Admin → Settings → API Tokens → Create new token:
- Type: Read-only
- Copy token → `STRAPI_API_TOKEN` in `.env.local`

---

## How to Add a Listing

1. Log into Strapi Admin → Content Manager → Listing → Create new entry
2. Fill in: `title`, `price`, `area` (neighbourhood only – **no address**), `availableUntil`, `condition`, `images` (min 1), `status` = `Available`
3. Set `managedBy = true` (shows "Managed by ClearoutSpaces" badge on detail page)
4. Publish the entry
5. The listing appears on `/listings` within 60 seconds (revalidation interval)

---

## Listing Lifecycle & Expiry

The `availableUntil` field controls when a listing is shown in the active grid.

| State | Shown on /listings? | Notes |
|---|---|---|
| `status = Available` + `availableUntil` in future | ✅ Yes | Normal active listing |
| `status = Pending` + `availableUntil` in future | ✅ Yes | Shows "Pending" badge |
| `status = Sold` | ❌ No (default) | Hidden from active grid |
| `availableUntil` in the past | ❌ No | Filtered out by fetch query |

**How the filter works** (in `lib/strapi.ts` → `fetchListings`):
```
filters[status][$ne]=Sold&filters[availableUntil][$gte]=TODAY
```

**Revalidation:** Listings fetch uses `next: { revalidate: 60 }` so stale data is
at most 60 seconds behind Strapi. Update listing status in Strapi → front-end updates within 1 minute.

To show a "sold archive" later:
- Add a toggle in `ListingsClient.tsx` to also fetch `status=Sold` listings
- The `ListingCard` already supports a sold overlay with dimmed image + "Sold" pill

---

## Modal Routing Explained

Clicking a listing card on `/listings` opens a modal overlay while keeping the `/listings`
page in the background. Directly visiting `/listings/[slug]` renders a full page.

**File structure:**
```
app/listings/
  layout.tsx                          ← declares @modal parallel slot
  page.tsx                            ← /listings index
  [slug]/page.tsx                     ← full-page fallback
  @modal/
    default.tsx                       ← renders null (no modal active)
    (.)[slug]/page.tsx                ← intercept: renders Modal wrapper
```

**Key behaviours:**
- Close button in `Modal.tsx` uses `router.back()` — **not** `router.push("/listings")` — to preserve browser history correctly and avoid the "back button trap"
- Direct link to `/listings/[slug]` renders `ListingDetail` without the modal wrapper
- Same `ListingDetail` component is used in both contexts

---

## Image Hosting (Local vs. Cloud)

### Local (Development / VPS)

By default, Strapi stores uploads in `strapi/public/uploads`.

In `next.config.ts`, `images.remotePatterns` is already configured to allow the Strapi host.

If running on a VPS, configure Nginx to serve `/uploads` from Strapi:

```nginx
# Add to your Strapi Nginx block:
location /uploads/ {
  alias /var/www/strapi/public/uploads/;
  expires 30d;
  add_header Cache-Control "public, immutable";
}
```

### Cloud (Cloudinary – Recommended for Production)

1. Install the Strapi Cloudinary provider in your Strapi project:
   ```bash
   cd strapi && npm install @strapi/provider-upload-cloudinary
   ```

2. Configure in `strapi/config/plugins.js`:
   ```js
   module.exports = {
     upload: {
       config: {
         provider: 'cloudinary',
         providerOptions: {
           cloud_name: process.env.CLOUDINARY_NAME,
           api_key: process.env.CLOUDINARY_KEY,
           api_secret: process.env.CLOUDINARY_SECRET,
         },
       },
     },
   };
   ```

3. The `next.config.ts` already includes `res.cloudinary.com` in `remotePatterns`.

**Switching providers does not require frontend changes** — `getStrapiMediaUrl()` handles
both relative (local) and absolute (cloud) URLs transparently.

---

## WhatsApp Attribution

All CTAs flow through `lib/whatsapp.ts` which appends attribution to the message:

```
Hi! I'd like a move-out estimate. | utm_source=home
```

For listing reservations:
```
Hi! I'd like to reserve: IKEA KALLAX ($95 CAD). Item: ikea-kallax-4x4-white. | utm_source=listing_modal | item=ikea-kallax-4x4-white
```

Source values: `home`, `services`, `pricing`, `faq`, `listings_page`, `listing_modal`, `footer`

---

## Deployment

The app is configured for `output: "standalone"` (Docker-friendly).

```bash
# Docker Compose (includes Nginx)
docker compose up -d

# Manual
npm run build
npm start
```

See `infra/` for Nginx config and deploy script.

---

## Architecture Overview

```
app/                    Next.js App Router pages
  layout.tsx            Root layout (Inter font, Navbar, Footer)
  page.tsx              Homepage (CMS-driven)
  services/page.tsx     Single services page (zig-zag blocks, anchor links)
  pricing/page.tsx      Pricing table + variables
  faq/page.tsx          FAQ accordion
  listings/
    layout.tsx          Declares @modal parallel slot
    page.tsx            Listings grid + client search
    [slug]/page.tsx     Full-page listing detail
    @modal/
      default.tsx       Empty slot when no modal open
      (.)[slug]/page.tsx Intercepted modal route

components/
  layout/               Navbar, Footer, Container
  ui/                   Button, Card, Badge, Input, Modal
  sections/             Hero, SmartWay, ServicesPreview, TrustRow,
                        PricingVariables, FinalCTA, ListingMgmtPreview,
                        FAQAccordion
  services/             ServiceBlock (zig-zag alternating layout)
  listings/             ListingCard, ListingGrid, ListingSearchBar,
                        ListingDetail, ListingEmptyState, ListingsClient

lib/
  strapi.ts             Fetch helpers (REST, revalidation, media URL)
  schemas/index.ts      Zod schemas for all Strapi responses
  seo.ts                Strapi SEO component → Next.js Metadata
  whatsapp.ts           WhatsApp deep-link builder with attribution
  dates.ts              Listing expiry / urgency utilities

scripts/
  seed-strapi.mjs       Seeds Strapi with sample content
```

---

> **Privacy note:** The `listing` content type deliberately has no `address` field.
> Only general neighbourhoods (e.g., "Liberty Village") are stored and displayed.
