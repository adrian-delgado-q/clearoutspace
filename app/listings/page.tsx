import type { Metadata } from "next";
import { fetchListings } from "@/lib/pocketbase";
import { ListingsListSchema } from "@/lib/schemas";
import Container from "@/components/layout/Container";
import ListingsClient from "@/components/listings/ListingsClient";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Listings – Available From Recent Condo Moves",
    description:
        "Available furniture and items from recent condo clearouts in Toronto. Pickup required within 1–2 weeks. Managed by ClearoutSpaces.",
};

async function getData() {
    try {
        const [availableRaw, soldRaw] = await Promise.all([
            fetchListings(),
            fetchListings({
                filter: `(status='Sold')`,
                sort: "-updated",
                perPage: "3",
            }),
        ]);

        const availableParsed = ListingsListSchema.safeParse(availableRaw);
        const soldParsed = ListingsListSchema.safeParse(soldRaw);

        const listings = availableParsed.success ? availableParsed.data.items : [];
        const soldListings = soldParsed.success ? soldParsed.data.items : [];

        return { listings, soldListings };
    } catch {
        return { listings: [], soldListings: [] };
    }
}

export default async function ListingsPage() {
    const { listings, soldListings } = await getData();

    return (
        <section className="section-padding bg-white">
            <Container>
                {/* Header */}
                <div className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#146C54] mb-3">
                        Available Now
                    </p>
                    <h1
                        className="font-semibold text-[#111111] leading-[1.1] mb-3"
                        style={{ fontSize: "clamp(26px, 4vw, 44px)" }}
                    >
                        Available From Recent Condo Moves
                    </h1>
                    <p className="text-[15px] text-[#5A5A5A] max-w-2xl leading-relaxed">
                        All items must be picked up within 1–2 weeks as listed. We manage the sale — you schedule
                        the pickup.
                    </p>
                </div>

                {/* Search + grid (client-side filter) */}
                <ListingsClient listings={listings} soldListings={soldListings} />
            </Container>
        </section>
    );
}
