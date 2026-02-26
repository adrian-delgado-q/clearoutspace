import type { Metadata } from "next";
import { getStrapiMediaUrl } from "./strapi";

export interface StrapiSEO {
    metaTitle?: string | null;
    metaDescription?: string | null;
    shareImage?: {
        data?: {
            attributes?: { url?: string; width?: number | null; height?: number | null; alternativeText?: string | null };
        } | null;
    } | null;
}

const BASE_URL = "https://clearoutspaces.ca";
const DEFAULT_OG = "/og-default.png";

/**
 * Map a Strapi SEO component to Next.js Metadata fields.
 * Provide fallback title/description for pages that don't have CMS SEO set.
 */
export function mapStrapiSeoToMetadata(
    seo: StrapiSEO | null | undefined,
    fallback: { title: string; description: string; path: string },
): Partial<Metadata> {
    const title = seo?.metaTitle ?? fallback.title;
    const description = seo?.metaDescription ?? fallback.description;
    const imageUrl = getStrapiMediaUrl(seo?.shareImage?.data?.attributes?.url) ?? DEFAULT_OG;
    const imageAlt = seo?.shareImage?.data?.attributes?.alternativeText ?? title;
    const imageW = seo?.shareImage?.data?.attributes?.width ?? 1200;
    const imageH = seo?.shareImage?.data?.attributes?.height ?? 630;
    const canonical = `${BASE_URL}${fallback.path}`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "website",
            siteName: "ClearoutSpaces",
            images: [{ url: imageUrl, width: imageW, height: imageH, alt: imageAlt }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}
