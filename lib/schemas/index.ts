import { z } from "zod";

// ─── Primitives ───────────────────────────────────────────────────────────────

const StrapiMediaAttributes = z.object({
    url: z.string(),
    width: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
    alternativeText: z.string().optional().nullable(),
    formats: z.record(z.string(), z.unknown()).optional().nullable(),
});

const StrapiMediaItem = z.object({
    data: z
        .object({ id: z.number(), attributes: StrapiMediaAttributes })
        .optional()
        .nullable(),
});

const StrapiMediaGallery = z.object({
    data: z
        .array(z.object({ id: z.number(), attributes: StrapiMediaAttributes }))
        .optional()
        .nullable(),
});

export const SEOSchema = z.object({
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    shareImage: StrapiMediaItem.optional().nullable(),
});

export const FeatureItemSchema = z.object({
    id: z.number().optional(),
    title: z.string(),
    description: z.string().optional().nullable(),
});

// ─── Global Settings ──────────────────────────────────────────────────────────

const NavLinkSchema = z.object({
    id: z.number().optional(),
    label: z.string(),
    href: z.string(),
});

const FeatureFlagsSchema = z.object({
    showListingsPreviewOnHome: z.boolean().default(false),
});

export const GlobalSettingsSchema = z.object({
    siteName: z.string().default("ClearoutSpaces"),
    whatsappUrl: z.string().default("https://wa.me/12268992255"),
    cityLabel: z.string().default("Toronto"),
    primaryCtaText: z.string().default("Get My Estimate"),
    navLinks: z.array(NavLinkSchema).optional().default([]),
    featureFlags: FeatureFlagsSchema.optional().default({ showListingsPreviewOnHome: false }),
    seo: SEOSchema.optional().nullable(),
});

export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>;

// ─── Home Page ────────────────────────────────────────────────────────────────

const SmartWayItemSchema = z.object({
    id: z.number().optional(),
    iconName: z.string().optional().nullable(),
    title: z.string(),
    text: z.string(),
});

const TrustItemSchema = z.object({
    id: z.number().optional(),
    iconName: z.string().optional().nullable(),
    label: z.string(),
});

export const HomePageSchema = z.object({
    heroTitle: z.string().default("Move-Out Done Right."),
    heroSubtitle: z.string().default("Clearout. Deposit-ready cleaning. Optional listing management."),
    heroSupporting: z.string().default("Structured, coordinated, condo-ready."),
    heroImage: StrapiMediaItem.optional().nullable(),
    smartWayTitle: z.string().default("The Smart Way to Move Out"),
    smartWayItems: z.array(SmartWayItemSchema).optional().default([]),
    servicesPreviewTitle: z.string().default("What We Do"),
    listingMgmtPreviewTitle: z.string().default("Optional: Listing Management"),
    listingMgmtPreviewBullets: z.array(z.object({ id: z.number().optional(), text: z.string() })).optional().default([]),
    listingMgmtPreviewImage: StrapiMediaItem.optional().nullable(),
    trustTitle: z.string().default("Why ClearoutSpaces"),
    trustItems: z.array(TrustItemSchema).optional().default([]),
    pricingVariablesTitle: z.string().default("Every move-out is different. Price depends on:"),
    pricingVariablesItems: z.array(z.object({ id: z.number().optional(), text: z.string() })).optional().default([]),
    finalCtaTitle: z.string().default("Ready to move out without the stress?"),
    finalCtaSubtitle: z.string().default("No forms. Just WhatsApp."),
    seo: SEOSchema.optional().nullable(),
});

export type HomePage = z.infer<typeof HomePageSchema>;

// ─── Services Page ────────────────────────────────────────────────────────────

export const ServicesPageSchema = z.object({
    pageTitle: z.string().default("Our Services"),
    introText: z.string().default(""),
    seo: SEOSchema.optional().nullable(),
});

// ─── Service (collection) ─────────────────────────────────────────────────────

export const ServiceSchema = z.object({
    id: z.number(),
    attributes: z.object({
        name: z.string(),
        sectionId: z.string(),
        order: z.number().default(0),
        shortDescription: z.string().optional().nullable(),
        longDescription: z.string().optional().nullable(),
        startingPriceLabel: z.string().optional().nullable(),
        typicalRangeText: z.string().optional().nullable(),
        isMostPopular: z.boolean().default(false),
        features: z.array(FeatureItemSchema).optional().default([]),
        whatsIncluded: z.array(z.object({ id: z.number().optional(), text: z.string() })).optional().default([]),
        sideImage: StrapiMediaItem.optional().nullable(),
        seo: SEOSchema.optional().nullable(),
    }),
});

export const ServicesResponseSchema = z.object({
    data: z.array(ServiceSchema),
});

export type Service = z.infer<typeof ServiceSchema>;

// ─── Listing (collection) ─────────────────────────────────────────────────────

export const ListingSchema = z.object({
    id: z.number(),
    attributes: z.object({
        title: z.string(),
        slug: z.string(),
        price: z.number(),
        currency: z.enum(["CAD", "USD"]).default("CAD"),
        area: z.string().optional().nullable(),
        availableUntil: z.string().optional().nullable(),
        pickupWindowText: z.string().optional().nullable(),
        pickupNotes: z.string().optional().nullable(),
        condition: z.enum(["New", "Like New", "Good", "Fair"]).optional().nullable(),
        dimensions: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        images: StrapiMediaGallery.optional().nullable(),
        status: z.enum(["Available", "Pending", "Sold"]).default("Available"),
        category: z.string().optional().nullable(),
        tags: z.array(z.object({ id: z.number().optional(), tag: z.string() })).optional().default([]),
        isFeatured: z.boolean().default(false),
        managedBy: z.boolean().default(true),
        seo: SEOSchema.optional().nullable(),
    }),
});

export const ListingsResponseSchema = z.object({
    data: z.array(ListingSchema),
    meta: z
        .object({
            pagination: z
                .object({ page: z.number(), pageSize: z.number(), pageCount: z.number(), total: z.number() })
                .optional(),
        })
        .optional(),
});

export type Listing = z.infer<typeof ListingSchema>;

// ─── Pricing Page ─────────────────────────────────────────────────────────────

const PricingGroupSchema = z.object({
    id: z.number().optional(),
    unitType: z.string(),
    clearoutTypical: z.string().optional().nullable(),
    cleaningTypical: z.string().optional().nullable(),
    bundleTypical: z.string().optional().nullable(),
});

export const PricingPageSchema = z.object({
    pageTitle: z.string().default("Pricing"),
    introText: z.string().default(""),
    pricingGroups: z.array(PricingGroupSchema).optional().default([]),
    variablesChecklist: z.array(z.object({ id: z.number().optional(), text: z.string() })).optional().default([]),
    finalCtaTitle: z.string().default("Get a tailored estimate"),
    finalCtaSubtitle: z.string().default("No forms. Just WhatsApp."),
    seo: SEOSchema.optional().nullable(),
});

export type PricingPage = z.infer<typeof PricingPageSchema>;

// ─── FAQ Page ─────────────────────────────────────────────────────────────────

const FAQItemSchema = z.object({
    id: z.number().optional(),
    question: z.string(),
    answer: z.string(),
});

export const FAQPageSchema = z.object({
    pageTitle: z.string().default("Frequently Asked Questions"),
    faqs: z.array(FAQItemSchema).optional().default([]),
    seo: SEOSchema.optional().nullable(),
});

export type FAQPage = z.infer<typeof FAQPageSchema>;

// ─── Parse helpers ────────────────────────────────────────────────────────────

type StrapiSingleResponse<T> = { data: { id: number; attributes: T } };

/**
 * Safely parse a Strapi single-type response.
 * Returns the attributes on success, null on failure (logs error in dev).
 */
export function parseSingleType<T>(
    schema: z.ZodType<T>,
    raw: unknown,
): T | null {
    const wrapped = z.object({ data: z.object({ id: z.number(), attributes: schema }) });
    const result = wrapped.safeParse(raw);
    if (!result.success) {
        if (process.env.NODE_ENV !== "production") {
            console.error("[Zod] Single-type parse error:", result.error.flatten());
        }
        return null;
    }
    return (result.data as StrapiSingleResponse<T>).data.attributes;
}
