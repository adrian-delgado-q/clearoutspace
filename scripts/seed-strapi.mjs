#!/usr/bin/env node
/**
 * Strapi 5+ Seed Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds:
 *   - Global Settings (single type)
 *   - Home Page (single type)
 *   - Services Page (single type)
 *   - Pricing Page (single type)
 *   - FAQ Page (single type)
 *   - Service collection (4 services)
 *   - Listing collection (8 listings – mixed statuses + availableUntil dates)
 *
 * Prerequisites:
 *   1. Strapi is running at STRAPI_URL (default: http://localhost:1337)
 *   2. STRAPI_ADMIN_EMAIL + STRAPI_ADMIN_PASSWORD must be set (or edit below)
 *
 * Usage:
 *   node scripts/seed-strapi.mjs
 *   # or with env override:
 *   STRAPI_URL=http://localhost:1337 STRAPI_ADMIN_EMAIL=admin@example.com STRAPI_ADMIN_PASSWORD=password node scripts/seed-strapi.mjs
 */

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Error: STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD must be set.");
    process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAdminToken() {
    const res = await fetch(`${STRAPI_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Admin login failed: ${res.status}\n${text}`);
    }
    const json = await res.json();
    return json.data?.token;
}

async function apiPut(token, endpoint, data) {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
    });
    if (!res.ok) {
        const text = await res.text();
        console.warn(`  ⚠ PUT ${endpoint} failed: ${res.status} – ${text.substring(0, 200)}`);
        return null;
    }
    return res.json();
}

async function apiPost(token, endpoint, data) {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
    });
    if (!res.ok) {
        const text = await res.text();
        console.warn(`  ⚠ POST ${endpoint} failed: ${res.status} – ${text.substring(0, 200)}`);
        return null;
    }
    return res.json();
}

// ─── Future date helper ────────────────────────────────────────────────────────
function daysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}

// ─── Seed data ────────────────────────────────────────────────────────────────

async function seedGlobalSettings(token) {
    console.log("  Seeding Global Settings…");
    await apiPut(token, "global-setting", {
        siteName: "ClearoutSpaces",
        whatsappUrl: "https://wa.me/16479227067",
        cityLabel: "Toronto",
        primaryCtaText: "Get My Estimate",
        featureFlags: { showListingsPreviewOnHome: false },
    });
}

async function seedHomePage(token) {
    console.log("  Seeding Home Page…");
    await apiPut(token, "home-page", {
        heroTitle: "Move-Out Done Right.",
        heroSubtitle: "Clearout. Deposit-ready cleaning. Optional listing management.",
        heroSupporting: "Structured, coordinated, condo-ready.",
        smartWayTitle: "The Smart Way to Move Out",
        smartWayItems: [
            { iconName: "box", title: "One Coordinated Visit", text: "Clearout, cleaning, and optional listing setup in a single operation." },
            { iconName: "building", title: "Condo-Compliant", text: "Elevator bookings, move-out rules, building requirements — handled." },
            { iconName: "shield", title: "Deposit-Ready Results", text: "Our move-out cleaning is designed to recover your security deposit." },
            { iconName: "phone", title: "Single Point of Contact", text: "One team, one WhatsApp thread, one bill." },
        ],
        servicesPreviewTitle: "What We Do",
        listingMgmtPreviewTitle: "Optional: Listing Management",
        listingMgmtPreviewBullets: [
            { text: "1–2 week managed listing window (max 14 days)" },
            { text: "20% commission on completed sales (bundle clients)" },
            { text: "We manage all buyer inquiries — total privacy" },
            { text: "Visit 1: clearout + photos + listing setup + cleaning" },
            { text: "Visit 2: final removal of unsold items (if needed)" },
            { text: "No storage, no sale guarantees, no addresses shared" },
        ],
        trustTitle: "Why ClearoutSpaces",
        trustItems: [
            { label: "Fully insured" },
            { label: "Condo-building experience" },
            { label: "Coordinated scheduling" },
            { label: "Eco-conscious: zero landfill goal" },
            { label: "No forms — WhatsApp only" },
            { label: "Transparent pricing" },
        ],
        pricingVariablesTitle: "Every move-out is different. Price depends on:",
        pricingVariablesItems: [
            { text: "Unit size (studio, 1BR, 2BR, larger)" },
            { text: "Volume and weight of items" },
            { text: "Elevator access vs. stairs" },
            { text: "Cleaning scope: standard vs. deep clean" },
            { text: "Listing management add-on" },
            { text: "Same-day or scheduled booking" },
        ],
        finalCtaTitle: "Ready to move out without the stress?",
        finalCtaSubtitle: "No forms. Just WhatsApp.",
    });
}

async function seedServicesPage(token) {
    console.log("  Seeding Services Page…");
    await apiPut(token, "services-page", {
        pageTitle: "What We Do",
        introText:
            "One team, coordinated move-out. Choose what you need or let us handle everything — clearout, cleaning, and optional listing management.",
    });
}

async function seedPricingPage(token) {
    console.log("  Seeding Pricing Page…");
    await apiPut(token, "pricing-page", {
        pageTitle: "Pricing",
        introText:
            "Ranges below are typical for Toronto condos. Send 2–3 photos on WhatsApp for an exact quote within minutes. The price we quote is the price you pay — no surprise fees.",
        pricingGroups: [
            { unitType: "Studio", clearoutTypical: "$399–$549", cleaningTypical: "$199–$299", bundleTypical: "$549–$799" },
            { unitType: "1 Bedroom", clearoutTypical: "$499–$749", cleaningTypical: "$249–$399", bundleTypical: "$699–$999" },
            { unitType: "2 Bedroom", clearoutTypical: "$749–$1,100", cleaningTypical: "$349–$499", bundleTypical: "$999–$1,499" },
            { unitType: "Larger (3BR+)", clearoutTypical: "$1,100+", cleaningTypical: "$499+", bundleTypical: "$1,499+" },
        ],
        variablesChecklist: [
            { text: "Unit size (studio, 1BR, 2BR, larger)" },
            { text: "Volume and weight of items" },
            { text: "Elevator access vs. stairs" },
            { text: "Cleaning scope: standard vs. deep clean" },
            { text: "Listing management add-on" },
            { text: "Same-day vs. scheduled booking" },
            { text: "Disassembly required for bulky items" },
        ],
        finalCtaTitle: "Get your personalised quote",
        finalCtaSubtitle: "No forms. Just WhatsApp.",
    });
}

async function seedFaqPage(token) {
    console.log("  Seeding FAQ Page…");
    await apiPut(token, "faq-page", {
        pageTitle: "Frequently Asked Questions",
        faqs: [
            { question: "What is included in the Move-Out Done Right bundle?", answer: "Full clearout, deposit-ready cleaning, coordinated scheduling, and optional listing management add-on." },
            { question: "Why is the bundle priced higher than clearout + cleaning?", answer: "It includes coordinated scheduling, single point of contact, condo-compliant workflow, and priority booking windows." },
            { question: "Do you handle elevator bookings?", answer: "Yes. We notify building management and book the service elevator as required." },
            { question: "How does listing management work?", answer: "Optional add-on. We photograph, list, and manage buyer inquiries for 1–2 weeks. 20% commission for bundle clients, 30–35% standalone." },
            { question: "Do you store items?", answer: "No storage in phase 1. Items are cleared, donated, recycled, or listed for pickup." },
            { question: "Can I see listing items before contacting you?", answer: "Yes — visit /listings. Items show general area only (no addresses). Contact goes through ClearoutSpaces." },
            { question: "How quickly can you come?", answer: "Bundle clients get priority booking. Most bookings within 72 hours. Same-day may be possible — ask on WhatsApp." },
        ],
    });
}

async function seedServices(token) {
    console.log("  Seeding Services (4)…");
    const services = [
        {
            name: "Move-Out Done Right",
            sectionId: "move-out-done-right",
            order: 1,
            shortDescription: "Full clearout, condo-compliant move-out cleaning, and optional listing management. One team, one visit, one point of contact.",
            startingPriceLabel: "From $849",
            typicalRangeText: "Most 1-bedroom condos: $849–$1,200 depending on volume and scope.",
            isMostPopular: true,
            features: [
                { title: "Coordinated scheduling", description: "one visit covers everything" },
                { title: "Single point of contact", description: "WhatsApp only" },
                { title: "Condo-compliant workflow", description: "elevator booking handled" },
                { title: "Priority booking windows", description: "schedule within 72 hours" },
                { title: "Optional listing mgmt", description: "commission-based add-on" },
            ],
            whatsIncluded: [
                { text: "Full clearout" },
                { text: "Deposit-ready clean" },
                { text: "Condo coordination" },
                { text: "Listing mgmt (optional)" },
            ],
        },
        {
            name: "Clearout",
            sectionId: "clearout",
            order: 2,
            shortDescription: "Full apartment or condo clearout — furniture, appliances, boxes. Sorted into donation, recycling, and responsible disposal.",
            startingPriceLabel: "From $499",
            typicalRangeText: "Most 1-bedroom condos: $499–$749 depending on volume.",
            isMostPopular: false,
            features: [
                { title: "All items removed", description: "furniture, appliances, boxes" },
                { title: "Zero landfill goal", description: "donation and recycling sorted" },
                { title: "Single visit", description: "no repeated trips" },
            ],
            whatsIncluded: [
                { text: "Heavy lifting" },
                { text: "Donation sorting" },
                { text: "Eco-disposal" },
            ],
        },
        {
            name: "Move-Out Cleaning",
            sectionId: "cleaning",
            order: 3,
            shortDescription: "Deposit-ready deep clean scheduled after the clearout. We know what landlords look for — inside appliances, baseboards, and all surfaces.",
            startingPriceLabel: "From $299",
            typicalRangeText: "Most 1-bedroom condos: $299–$450 depending on scope.",
            isMostPopular: false,
            features: [
                { title: "Deposit-recovery focused", description: "inspection-checklist aligned" },
                { title: "Inside appliances", description: "oven, fridge, microwave" },
                { title: "All surfaces", description: "floors, walls, fixtures" },
            ],
            whatsIncluded: [
                { text: "Deep clean" },
                { text: "Appliance interiors" },
                { text: "Bathroom & kitchen" },
            ],
        },
        {
            name: "Listing Management",
            sectionId: "listing-management",
            order: 4,
            shortDescription: "Optional add-on for bundle clients. We photograph, list, and manage buyer inquiries for 1–2 weeks. 20% commission on completed sales.",
            startingPriceLabel: "20% commission",
            typicalRangeText: null,
            isMostPopular: false,
            features: [
                { title: "Photography + listing", description: "during initial visit" },
                { title: "All buyer comms managed", description: "privacy-first" },
                { title: "1–2 week managed window", description: "max 14 days" },
                { title: "Second visit if needed", description: "final removal of unsold items" },
                { title: "Commission on sales only", description: "no upfront listing fee" },
            ],
            whatsIncluded: [
                { text: "Listing creation" },
                { text: "Buyer management" },
                { text: "Second visit" },
            ],
        },
    ];

    for (const svc of services) {
        const result = await apiPost(token, "services", svc);
        console.log(`    Created service: ${result?.data?.attributes?.name ?? "?"}`);
    }
}

async function seedListings(token) {
    console.log("  Seeding Listings (8)…");
    const listings = [
        {
            title: "IKEA KALLAX Shelf Unit – White, 4x4",
            slug: "ikea-kallax-4x4-white",
            price: 95,
            currency: "CAD",
            area: "Liberty Village",
            availableUntil: daysFromNow(10),
            pickupWindowText: "Available for pickup most evenings",
            condition: "Like New",
            dimensions: "147cm × 147cm × 39cm",
            description: "<p>Excellent condition. Only 8 months old. All inserts available. Must pick up — no delivery.</p>",
            status: "Available",
            category: "Furniture",
            tags: [{ tag: "IKEA" }, { tag: "shelf" }],
            isFeatured: true,
            managedBy: true,
        },
        {
            title: "West Elm Sofa – Grey Fabric, 3-Seater",
            slug: "west-elm-sofa-grey-3-seater",
            price: 320,
            currency: "CAD",
            area: "King West",
            availableUntil: daysFromNow(12),
            condition: "Good",
            dimensions: "215cm × 92cm × 84cm",
            description: "<p>Some light wear on armrests. No stains. Freshly cleaned. Disassembly required for narrow hallways.</p>",
            status: "Available",
            category: "Furniture",
            tags: [{ tag: "sofa" }, { tag: "West Elm" }],
            isFeatured: true,
            managedBy: true,
        },
        {
            title: "Samsung 55\" 4K TV",
            slug: "samsung-55-4k-tv",
            price: 180,
            currency: "CAD",
            area: "Leslieville",
            availableUntil: daysFromNow(7),
            condition: "Good",
            description: "<p>2021 model. Remote included. No wall mount. Works perfectly.</p>",
            status: "Available",
            category: "Electronics",
            tags: [{ tag: "TV" }, { tag: "Samsung" }],
            isFeatured: false,
            managedBy: true,
        },
        {
            title: "IKEA HEMNES Dresser – White, 8-Drawer",
            slug: "ikea-hemnes-dresser-8-drawer",
            price: 75,
            currency: "CAD",
            area: "Corktown",
            availableUntil: daysFromNow(9),
            condition: "Good",
            dimensions: "160cm × 50cm × 98cm",
            description: "<p>Minor scuffs. All drawers slide smoothly. Solid wood construction.</p>",
            status: "Pending",
            category: "Furniture",
            tags: [{ tag: "IKEA" }, { tag: "dresser" }],
            isFeatured: false,
            managedBy: true,
        },
        {
            title: "Dyson V11 Cordless Vacuum",
            slug: "dyson-v11-cordless-vacuum",
            price: 240,
            currency: "CAD",
            area: "Yonge & Eglinton",
            availableUntil: daysFromNow(5),
            condition: "Like New",
            description: "<p>Minimal use. All attachments included. Battery life excellent.</p>",
            status: "Available",
            category: "Appliances",
            tags: [{ tag: "Dyson" }, { tag: "vacuum" }],
            isFeatured: true,
            managedBy: true,
        },
        {
            title: "Queen Size Bed Frame – Mid-Century Walnut",
            slug: "queen-bed-frame-walnut",
            price: 150,
            currency: "CAD",
            area: "Roncesvalles",
            availableUntil: daysFromNow(11),
            condition: "Good",
            dimensions: "Fits standard queen mattress",
            description: "<p>Solid walnut veneer. Some assembly required. No mattress included.</p>",
            status: "Available",
            category: "Furniture",
            tags: [{ tag: "bed frame" }, { tag: "queen" }],
            isFeatured: false,
            managedBy: true,
        },
        {
            title: "KitchenAid Artisan Stand Mixer – Red",
            slug: "kitchenaid-stand-mixer-red",
            price: 210,
            currency: "CAD",
            area: "Parkdale",
            availableUntil: daysFromNow(4),
            condition: "Like New",
            description: "<p>Barely used, moving abroad. All original attachments. In original box.</p>",
            status: "Available",
            category: "Appliances",
            tags: [{ tag: "KitchenAid" }, { tag: "mixer" }],
            isFeatured: false,
            managedBy: true,
        },
        {
            title: "IKEA POÄNG Armchair + Ottoman – Beige",
            slug: "ikea-poang-armchair-ottoman-beige",
            price: 50,
            currency: "CAD",
            area: "Junction",
            availableUntil: daysFromNow(-2), // already past (archived / shows Sold)
            condition: "Fair",
            description: "<p>Normal wear. Cushion slightly compressed. Still comfortable.</p>",
            status: "Sold",
            category: "Furniture",
            tags: [{ tag: "IKEA" }, { tag: "armchair" }],
            isFeatured: false,
            managedBy: true,
        },
    ];

    for (const listing of listings) {
        const result = await apiPost(token, "listings", listing);
        console.log(`    Created listing: ${result?.data?.attributes?.title ?? "?"} (${listing.status})`);
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`\n🌱 ClearoutSpaces – Strapi Seed Script`);
    console.log(`   Strapi URL: ${STRAPI_URL}\n`);

    let token;
    try {
        console.log("  Authenticating…");
        token = await getAdminToken();
        console.log("  ✓ Admin token obtained\n");
    } catch (err) {
        console.error("✗ Authentication failed:", err.message);
        console.error("  Make sure Strapi is running and STRAPI_ADMIN_EMAIL / STRAPI_ADMIN_PASSWORD are correct.");
        process.exit(1);
    }

    try {
        await seedGlobalSettings(token);
        await seedHomePage(token);
        await seedServicesPage(token);
        await seedPricingPage(token);
        await seedFaqPage(token);
        await seedServices(token);
        await seedListings(token);
    } catch (err) {
        console.error("✗ Seed error:", err.message);
        process.exit(1);
    }

    console.log("\n✅ Seed complete!");
    console.log("   Remember to:");
    console.log("   1. Set Public permissions in Strapi Admin → Settings → Roles → Public");
    console.log("      - Enable find/findOne for: listings, services");
    console.log("      - Enable find for: global-setting, home-page, services-page, pricing-page, faq-page");
    console.log("   2. Publish all content in Strapi Admin");
    console.log("   3. Copy .env.local.example to .env.local and fill in your values\n");
}

main();
