import ListingCard from "./ListingCard";
import type { Listing } from "@/lib/schemas";

interface ListingGridProps {
    listings: Listing[];
    ariaLabel?: string;
}

export default function ListingGrid({ listings, ariaLabel = "Available listings" }: ListingGridProps) {
    return (
        <div
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
            role="list"
            aria-label={ariaLabel}
        >
            {listings.map((listing) => (
                <div key={listing.id} role="listitem">
                    <ListingCard listing={listing} />
                </div>
            ))}
        </div>
    );
}
