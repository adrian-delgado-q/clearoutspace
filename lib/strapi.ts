/**
 * Strapi 5+ REST API fetch helpers.
 * All responses are returned as raw JSON – callers apply Zod schemas.
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? "";

type FetchOptions = {
    revalidate?: number | false;
    tags?: string[];
};

async function strapiGet(path: string, opts: FetchOptions = {}): Promise<unknown> {
    const url = `${STRAPI_URL}/api${path}`;
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    };

    const res = await fetch(url, {
        headers,
        next: {
            revalidate: opts.revalidate ?? 3600,
            tags: opts.tags,
        },
    });

    if (!res.ok) {
        throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText} – ${url}`);
    }

    return res.json();
}

// ─── Single Types ─────────────────────────────────────────────────────────────

export async function fetchGlobalSettings(opts?: FetchOptions) {
    return strapiGet(
        "/global-setting?populate[navLinks]=*&populate[featureFlags]=*&populate[seo][populate]=shareImage",
        opts,
    );
}

export async function fetchHomePage(opts?: FetchOptions) {
    return strapiGet(
        "/home-page?populate[heroImage]=*&populate[smartWayItems]=*&populate[servicesPreviewItems][populate]=sideImage&populate[trustItems]=*&populate[pricingVariablesItems]=*&populate[listingMgmtPreviewImage]=*&populate[listingMgmtPreviewBullets]=*&populate[seo][populate]=shareImage",
        opts,
    );
}

export async function fetchServicesPage(opts?: FetchOptions) {
    return strapiGet(
        "/services-page?populate[seo][populate]=shareImage",
        opts,
    );
}

export async function fetchPricingPage(opts?: FetchOptions) {
    return strapiGet(
        "/pricing-page?populate[pricingGroups]=*&populate[variablesChecklist]=*&populate[seo][populate]=shareImage",
        opts,
    );
}

export async function fetchFaqPage(opts?: FetchOptions) {
    return strapiGet(
        "/faq-page?populate[faqs]=*&populate[seo][populate]=shareImage",
        opts,
    );
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function fetchServices(opts?: FetchOptions) {
    return strapiGet(
        "/services?sort=order:asc&populate[features]=*&populate[sideImage]=*&populate[seo][populate]=shareImage",
        opts,
    );
}

export async function fetchListings(
    filters: Record<string, string> = {},
    opts?: FetchOptions,
) {
    const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const base = `/listings?populate[images]=*&populate[seo][populate]=shareImage&filters[status][$ne]=Sold&filters[availableUntil][$gte]=${now}&sort=createdAt:desc`;
    const extra = Object.entries(filters)
        .map(([k, v]) => `&${k}=${encodeURIComponent(v)}`)
        .join("");
    return strapiGet(base + extra, opts);
}

export async function fetchListingBySlug(slug: string, opts?: FetchOptions) {
    return strapiGet(
        `/listings?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[images]=*&populate[seo][populate]=shareImage`,
        { revalidate: 60, ...opts },
    );
}

export async function fetchActiveListingSlugs(): Promise<string[]> {
    const now = new Date().toISOString().split("T")[0];
    try {
        const data = await strapiGet(
            `/listings?fields=slug&filters[status][$ne]=Sold&filters[availableUntil][$gte]=${now}&pagination[pageSize]=200`,
            { revalidate: 3600 },
        );
        const d = data as { data?: Array<{ attributes?: { slug?: string } }> };
        return (d.data ?? []).map((item) => item.attributes?.slug ?? "").filter(Boolean);
    } catch {
        return [];
    }
}

// ─── Media helper ─────────────────────────────────────────────────────────────

export function getStrapiMediaUrl(url: string | null | undefined): string {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http")) return url;
    return `${STRAPI_URL}${url}`;
}
