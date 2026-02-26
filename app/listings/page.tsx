import type { Metadata } from "next";
import { fetchListings, fetchGlobalSettings } from "@/lib/strapi";
import { ListingsResponseSchema, GlobalSettingsSchema, parseSingleType } from "@/lib/schemas";
import Container from "@/components/layout/Container";
import ListingsClient from "@/components/listings/ListingsClient";
import ListingEmptyState from "@/components/listings/ListingEmptyState";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Listings – Available From Recent Condo Moves",
    description:
        "Available furniture and items from recent condo clearouts in Toronto. Pickup required within 1–2 weeks. Managed by ClearoutSpaces.",
};

async function getData() {
    try {
        const [listingsRaw, globalRaw] = await Promise.allSettled([
            fetchListings({}, { revalidate: 60 }),
            fetchGlobalSettings(),
        ]);

        let listings: ReturnType<typeof ListingsResponseSchema.parse>["data"] = [];
        if (listingsRaw.status === "fulfilled") {
            const parsed = ListingsResponseSchema.safeParse(listingsRaw.value);
            if (parsed.success) listings = parsed.data.data;
        }

        const global = globalRaw.status === "fulfilled"
            ? parseSingleType(GlobalSettingsSchema, globalRaw.value)
            : null;

        return { listings, global };
    } catch {
        return { listings: [], global: null };
    }
}

export default async function ListingsPage() {
    const { listings, global } = await getData();
    const waBase = global?.whatsappUrl ?? "https://wa.me/12268992255";

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
                <ListingsClient listings={listings} />
            </Container>
        </section>
    );
}
