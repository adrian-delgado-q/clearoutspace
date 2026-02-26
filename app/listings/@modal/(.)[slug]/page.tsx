import { notFound } from "next/navigation";
import { fetchListingBySlug, fetchGlobalSettings } from "@/lib/strapi";
import { ListingsResponseSchema, GlobalSettingsSchema, parseSingleType } from "@/lib/schemas";
import Modal from "@/components/ui/Modal";
import ListingDetail from "@/components/listings/ListingDetail";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ListingModalPage({ params }: PageProps) {
    const { slug } = await params;

    const [listingRaw, globalRaw] = await Promise.allSettled([
        fetchListingBySlug(slug, { revalidate: 60 }),
        fetchGlobalSettings(),
    ]);

    const listingParsed =
        listingRaw.status === "fulfilled"
            ? ListingsResponseSchema.safeParse(listingRaw.value)
            : null;

    const listing = listingParsed?.success ? listingParsed.data.data[0] : null;

    if (!listing) notFound();

    const global =
        globalRaw.status === "fulfilled"
            ? parseSingleType(GlobalSettingsSchema, globalRaw.value)
            : null;

    const waBase = global?.whatsappUrl ?? "https://wa.me/12268992255";

    return (
        <Modal>
            <ListingDetail listing={listing} waBase={waBase} />
        </Modal>
    );
}
