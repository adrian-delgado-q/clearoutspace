/**
 * WhatsApp deep-link builder with attribution tagging.
 * All CTAs on the site go through this helper so attribution is consistent.
 */

export type WhatsAppSource =
    | "home"
    | "services"
    | "pricing"
    | "faq"
    | "listings_page"
    | "listing_modal"
    | "footer";

// ── Context-aware CTA builder ─────────────────────────────────────────────────

export type CtaSource =
    | "navbar"
    | "mobile_sticky"
    | "footer"
    | "home"
    | "services"
    | "pricing"
    | "faq"
    | "listings_page"
    | "listing_modal";

const GENERIC_MSG =
    "Hi! I'm not sure which service fits best — can you help me figure out the right move-out option for my place?";

const SOURCE_MESSAGES: Partial<Record<CtaSource, string>> = {
    navbar: GENERIC_MSG,
    mobile_sticky: GENERIC_MSG,
    footer: GENERIC_MSG,
    home: "Hi! I'm planning a move-out and would like an estimate — what info do you need from me?",
    services:
        "Hi! I've been looking through your services page — I'd like a quote for my move-out.",
    pricing:
        "Hi! I've been checking your pricing — can I get a personalised estimate for my move-out?",
    faq: "Hi! I read through your FAQ and I'm ready to get an estimate for my move-out.",
    listings_page: "Hi! I'd like a move-out estimate.",
};

/**
 * Build a context-aware wa.me CTA link.
 * Pass `serviceName` when the button belongs to a specific service card —
 * e.g. "Clearout" or "Move-Out Cleaning".
 */
export function buildCtaUrl(
    base: string,
    source: CtaSource,
    serviceName?: string,
): string {
    const body = serviceName
        ? `Hi! I'm interested in the ${serviceName} service — can I get a quote?`
        : (SOURCE_MESSAGES[source] ?? GENERIC_MSG);
    return `${base}?text=${encodeURIComponent(`${body} | utm_source=${source}`)}`;
}

export interface WhatsAppMeta {
    source: WhatsAppSource;
    /** Listing slug, if applicable */
    slug?: string;
    /** Service section id, e.g. "clearout" */
    sectionId?: string;
}

/** Build a wa.me URL with attribution embedded in the message body. */
export function buildWhatsAppUrl(
    base: string,
    message: string,
    meta: WhatsAppMeta,
): string {
    const parts: string[] = [message.trim()];

    if (meta.source) parts.push(`utm_source=${meta.source}`);
    if (meta.slug) parts.push(`item=${meta.slug}`);
    if (meta.sectionId) parts.push(`service=${meta.sectionId}`);

    const full = parts.join(" | ");
    return `${base}?text=${encodeURIComponent(full)}`;
}

/** Pre-built message for reserving a listing item. */
export function buildListingReserveUrl(
    base: string,
    title: string,
    price: number,
    currency: string,
    slug: string,
): string {
    const message = `Hi! I'd like to reserve: ${title} ($${price} ${currency}). Item: ${slug}.`;
    return buildWhatsAppUrl(base, message, { source: "listing_modal", slug });
}


