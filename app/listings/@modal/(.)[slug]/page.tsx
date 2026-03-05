import { notFound } from "next/navigation";
import { fetchListingBySlug } from "@/lib/pocketbase";
import { ListingsListSchema } from "@/lib/schemas";
import Modal from "@/components/ui/Modal";
import ListingDetail from "@/components/listings/ListingDetail";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ListingModalPage({ params }: PageProps) {
    const { slug } = await params;

    const raw = await fetchListingBySlug(slug);
    const parsed = ListingsListSchema.safeParse(raw);
    const listing = parsed.success ? parsed.data.items[0] : null;

    if (!listing) notFound();

    return (
        <Modal>
            <ListingDetail listing={listing} waBase="https://wa.me/16479227067" />
        </Modal>
    );
}
