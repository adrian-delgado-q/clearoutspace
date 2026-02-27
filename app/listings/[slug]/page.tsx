import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchListingBySlug, fetchActiveListingSlugs, getPbFileUrl } from "@/lib/pocketbase";
import { ListingsListSchema } from "@/lib/schemas";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/layout/Container";
import ListingDetail from "@/components/listings/ListingDetail";
import FinalCTA from "@/components/sections/FinalCTA";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
    const raw = await fetchListingBySlug(slug);
    const parsed = ListingsListSchema.safeParse(raw);
    const listing = parsed.success ? parsed.data.items[0] : null;
    return { listing };
}

export async function generateStaticParams() {
    const slugs = await fetchActiveListingSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { listing } = await getData(slug);

    if (!listing) return { title: "Listing Not Found | ClearoutSpaces" };

    const { title, description, price, currency, area, images, collectionName, id } = listing;
    const ogImage = images[0] ? getPbFileUrl(collectionName, id, images[0]) : undefined;

    return buildMetadata({
        title: `${title} – $${price} ${currency} | ClearoutSpaces`,
        description:
            description?.substring(0, 155) ??
            `${title} available for pickup${area ? ` in ${area}` : ""}. Managed by ClearoutSpaces.`,
        path: `/listings/${slug}`,
        ogImage,
        ogImageWidth: 1200,
        ogImageHeight: 900,
    });
}

export default async function ListingDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const { listing } = await getData(slug);

    if (!listing) notFound();

    const waBase = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "";

    return (
        <>
            {/* Breadcrumb */}
            <div className="border-b border-[#EAEAEA] bg-[#F7F7F7]">
                <Container className="flex items-center gap-2 h-11 text-sm text-[#5A5A5A]">
                    <a href="/listings" className="hover:text-[#111111] transition-colors">
                        Listings
                    </a>
                    <span aria-hidden="true">›</span>
                    <span className="text-[#111111] truncate max-w-xs">{listing.title}</span>
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
