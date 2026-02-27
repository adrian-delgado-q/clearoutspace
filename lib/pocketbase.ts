/**
 * PocketBase REST API fetch helpers.
 *
 * - PB_INTERNAL_URL       : Docker-internal URL for server-side fetches (e.g. http://pocketbase:8090)
 * - NEXT_PUBLIC_PB_URL    : Public-facing URL used for file/image hrefs rendered in HTML
 */

const PB_API_BASE =
    process.env.PB_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_PB_URL ??
    "http://localhost:8090";

export const PB_PUBLIC_URL =
    process.env.NEXT_PUBLIC_PB_URL ?? "http://localhost:8090";

type FetchOptions = {
    revalidate?: number | false;
    tags?: string[];
};

async function pbGet(path: string, opts: FetchOptions = {}): Promise<unknown> {
    const url = `${PB_API_BASE}/api${path}`;
    const res = await fetch(url, {
        next: {
            revalidate: opts.revalidate ?? 3600,
            tags: opts.tags,
        },
    });

    if (!res.ok) {
        // Log the full URL server-side only — never send it to the client.
        console.error(`PocketBase fetch failed: ${res.status} ${res.statusText} – ${url}`);
        throw new Error(`PocketBase fetch failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

/**
 * Build a full URL to a PocketBase-hosted file.
 * collectionName: the collection name (e.g. "listings")
 * recordId: the record's id string
 * filename: the filename stored in the file field (e.g. "photo_abc123.jpg")
 * opts.thumb: optional thumb size string (e.g. "800x600f")
 */
export function getPbFileUrl(
    collectionName: string,
    recordId: string,
    filename: string | null | undefined,
    opts?: { thumb?: string },
): string {
    if (!filename) return "/placeholder.jpg";
    const base = `${PB_PUBLIC_URL}/api/files/${collectionName}/${recordId}/${filename}`;
    return opts?.thumb ? `${base}?thumb=${opts.thumb}` : base;
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export async function fetchListings(
    filters: Record<string, string> = {},
    opts: FetchOptions = {},
) {
    const params = new URLSearchParams({
        filter: `(status!='Sold')`,
        sort: "-isFeatured,-updated",
        perPage: "100",
    });
    // Only allow known PocketBase query params to prevent arbitrary key injection.
    const ALLOWED_KEYS = new Set(["filter", "sort", "perPage", "page", "fields"]);
    for (const [k, v] of Object.entries(filters)) {
        if (ALLOWED_KEYS.has(k)) {
            params.set(k, v);
        }
    }
    return pbGet(`/collections/listings/records?${params}`, { revalidate: 60, ...opts });
}

export async function fetchListingBySlug(slug: string, opts: FetchOptions = {}) {
    // Validate slug to prevent filter expression injection.
    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
        throw new Error(`Invalid listing slug`);
    }
    const params = new URLSearchParams({
        filter: `(slug='${slug}')`,
    });
    return pbGet(`/collections/listings/records?${params}`, { revalidate: 60, ...opts });
}

export async function fetchActiveListingSlugs(): Promise<string[]> {
    const now = new Date().toISOString().split("T")[0];
    try {
        const params = new URLSearchParams({
            filter: `(status!='Sold'&&availableUntil>='${now}')`,
            fields: "slug",
            perPage: "200",
        });
        const data = await pbGet(`/collections/listings/records?${params}`, { revalidate: 3600 });
        const d = data as { items?: Array<{ slug?: string }> };
        return (d.items ?? []).map((item) => item.slug ?? "").filter(Boolean);
    } catch {
        return [];
    }
}
