import type { Metadata } from "next";

const BASE_URL = "https://clearoutspaces.ca";
const DEFAULT_OG = "/opengraphimage.png";

/**
 * Build Next.js Metadata for a page.
 * All values are explicit — no CMS dependency.
 */
export function buildMetadata(opts: {
    title: string;
    description: string;
    path: string;
    ogImage?: string;
    ogImageAlt?: string;
    ogImageWidth?: number;
    ogImageHeight?: number;
}): Partial<Metadata> {
    const {
        title,
        description,
        path,
        ogImage = DEFAULT_OG,
        ogImageAlt = title,
        ogImageWidth = 1200,
        ogImageHeight = 630,
    } = opts;

    const canonical = `${BASE_URL}${path}`;

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
            images: [{ url: ogImage, width: ogImageWidth, height: ogImageHeight, alt: ogImageAlt }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}
