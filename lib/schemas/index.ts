import { z } from "zod";

// ─── Listing (PocketBase collection) ─────────────────────────────────────────
//
// PocketBase record IDs are 15-char alphanumeric strings.
// File fields are stored as arrays of filename strings.
// Build file URLs with getPbFileUrl() from lib/pocketbase.

export const ListingSchema = z.object({
    id: z.string(),
    collectionId: z.string().optional(),
    collectionName: z.string().default("listings"),
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
    // PocketBase file field: array of filename strings (not URL objects)
    images: z.array(z.string()).default([]),
    status: z.enum(["Available", "Pending", "Sold"]).default("Available"),
    category: z.string().optional().nullable(),
    tags: z.string().optional().nullable(), // comma-separated string
    isFeatured: z.boolean().default(false),
    managedBy: z.boolean().default(true),
    created: z.string().optional(),
    updated: z.string().optional(),
});

export type Listing = z.infer<typeof ListingSchema>;

// ─── PocketBase paginated list response ───────────────────────────────────────

export const ListingsListSchema = z.object({
    page: z.number().optional(),
    perPage: z.number().optional(),
    totalItems: z.number().optional(),
    totalPages: z.number().optional(),
    items: z.array(ListingSchema),
});

export type ListingsList = z.infer<typeof ListingsListSchema>;

// ─── Service (hardcoded content — services page) ──────────────────────────────

export interface FeatureItem {
    title: string;
    description?: string | null;
}

export interface Service {
    id: number;
    name: string;
    sectionId: string;
    order?: number;
    shortDescription?: string | null;
    longDescription?: string | null;
    startingPriceLabel?: string | null;
    typicalRangeText?: string | null;
    isMostPopular?: boolean;
    features?: FeatureItem[];
    whatsIncluded?: { text: string }[];
    sideImage?: string | null; // URL string or null (no CMS media object)
}

// DELETED — the rest of this file was Strapi-specific schemas (no longer needed):
// StrapiMediaFlat, SEOSchema, GlobalSettingsSchema, HomePageSchema,
// ServicesPageSchema, ServiceSchema (Zod), PricingPageSchema, FAQPageSchema,
// parseSingleType, ListingsResponseSchema, etc.
// PocketBase has a simpler flat record format; only the above schemas are needed.

// Keeping this export to avoid breaking any remaining imports during migration:
/** @deprecated Use ListingsListSchema instead */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseSingleType = (_schema: any, _raw: any) => null;
