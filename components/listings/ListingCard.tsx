import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getPbFileUrl } from "@/lib/pocketbase";
import { pickupUrgency } from "@/lib/dates";
import type { Listing } from "@/lib/schemas";

interface ListingCardProps {
    listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
    const { title, slug, price, currency, area, availableUntil, condition, images, status, isFeatured } =
        listing;

    const firstImageFilename = images?.[0] ?? null;
    const firstImageUrl = getPbFileUrl(listing.collectionName, listing.id, firstImageFilename, { thumb: "800x600f" });
    const firstImageAlt = title;

    const urgency = pickupUrgency(availableUntil);
    const isSold = status === "Sold";
    const isPending = status === "Pending";

    return (
        <Link
            href={`/listings/${slug}`}
            className="group block border border-[#EAEAEA] rounded-[8px] overflow-hidden hover:border-[#146C54] transition-colors bg-white"
            aria-label={`View listing: ${title}`}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F7F7]">
                <Image
                    src={firstImageUrl}
                    alt={firstImageAlt ?? title}
                    fill
                    className={["object-cover transition-transform duration-300 group-hover:scale-[1.02]",
                        isSold ? "opacity-50" : ""].join(" ")}
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                />

                {isFeatured && !isSold && (
                    <div className="absolute top-2 left-2">
                        <Badge variant="green">Featured</Badge>
                    </div>
                )}

                {isSold && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black/70 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                            Sold
                        </span>
                    </div>
                )}

                {isPending && !isSold && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="yellow">Pending</Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-[#111111] text-[15px] leading-tight mb-1 line-clamp-2">
                    {title}
                </h3>

                <p className="text-[#146C54] font-semibold text-base mb-2">
                    ${price.toLocaleString()} {currency}
                </p>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                    {area && (
                        <span className="text-[13px] text-[#5A5A5A]">{area}</span>
                    )}
                    {condition && (
                        <span className="text-[13px] text-[#5A5A5A]">{condition}</span>
                    )}
                </div>

                {urgency && (
                    <p
                        className={["mt-2 text-[12px] font-medium",
                            urgency.includes("day") && !urgency.includes("Last") ? "text-amber-600" : "",
                            urgency === "Last day!" ? "text-red-600" : "",
                            urgency === "Expired" ? "text-red-600 line-through" : "",
                            !urgency.match(/(day|Expired|Last)/) ? "text-[#5A5A5A]" : "",
                        ].join(" ")}
                    >
                        {urgency}
                    </p>
                )}
            </div>
        </Link>
    );
}
