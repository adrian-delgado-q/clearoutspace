import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchListingBySlug, fetchGlobalSettings, getStrapiMediaUrl } from "@/lib/strapi";
import { ListingsResponseSchema, GlobalSettingsSchema, parseSingleType } from "@/lib/schemas";
import { mapStrapiSeoToMetadata } from "@/lib/seo";
import Container from "@/components/layout/Container";
import ListingDetail from "@/components/listings/ListingDetail";
import FinalCTA from "@/components/sections/FinalCTA";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
    const [listingRaw, globalRaw] = await Promise.allSettled([
        fetchListingBySlug(slug, { revalidate: 60 }),
        fetchGlobalSettings(),
    ]);

    const listingParsed =
        listingRaw.status === "fulfilled"
            ? ListingsResponseSchema.safeParse(listingRaw.value)
            : null;

    const listing = listingParsed?.success ? listingParsed.data.data[0] : null;
    const global =
        globalRaw.status === "fulfilled"
            ? parseSingleType(GlobalSettingsSchema, globalRaw.value)
            : null;

    return { listing, global };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { listing } = await getData(slug);

    if (!listing) {
        return { title: "Listing Not Found | ClearoutSpaces" };
    }

    const { title, description, price, currency, area, images, seo } = listing.attributes;

    const ogImage =
        getStrapiMediaUrl(seo?.shareImage?.data?.attributes?.url) ??
        getStrapiMediaUrl(images?.data?.[0]?.attributes?.url);

    return {
        ...mapStrapiSeoToMetadata(seo, {
            title: `${title} – $${price} ${currency} | ClearoutSpaces`,
            description:
                description?.substring(0, 155) ??
                `${title} available for pickup${area ? ` in ${area}` : ""}. Managed by ClearoutSpaces.`,
            path: `/listings/${slug}`,
        }),
        openGraph: {
            title: `${title} – $${price} ${currency}`,
            description: `Available${area ? ` in ${area}` : ""}. Managed by ClearoutSpaces.`,
            images: ogImage ? [{ url: ogImage, width: 1200, height: 900 }] : undefined,
        },
    };
}

export default async function ListingDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const { listing, global } = await getData(slug);

    if (!listing) notFound();

    const waBase = global?.whatsappUrl ?? "https://wa.me/12268992255";

    return (
        <>
            {/* Breadcrumb */}
            <div className="border-b border-[#EAEAEA] bg-[#F7F7F7]">
                <Container className="flex items-center gap-2 h-11 text-sm text-[#5A5A5A]">
                    <a href="/listings" className="hover:text-[#111111] transition-colors">
                        Listings
                    </a>
                    <span aria-hidden="true">›</span>
                    <span className="text-[#111111] truncate max-w-xs">{listing.attributes.title}</span>
                </Container>
            </div>

            <section className="section-padding bg-white">
                <Container>
                    <div className="max-w-[960px] mx-auto">
                        <ListingDetail listing={listing} waBase={waBase} />
                    </div>
                </Container>
            </section>

            <FinalCTA
                title="Looking to clear out your own space?"
                subtitle="We handle the full move-out — clearout, cleaning, listing management."
                ctaHref={waBase}
                source="listing_modal"
            />
        </>
    );
}
