"use client";

import { useState } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { getPbFileUrl } from "@/lib/pocketbase";
import { buildListingReserveUrl } from "@/lib/whatsapp";
import { formatLongDate, pickupUrgency, daysUntil } from "@/lib/dates";
import type { Listing } from "@/lib/schemas";

interface ListingDetailProps {
    listing: Listing;
    waBase?: string;
}

export default function ListingDetail({ listing, waBase = "https://wa.me/12268992255" }: ListingDetailProps) {
    const {
        title, slug, price, currency, area, availableUntil, pickupWindowText, pickupNotes,
        condition, dimensions, description, images, status, managedBy,
    } = listing;

    const imageList = images ?? [];
    const [activeIdx, setActiveIdx] = useState(0);

    const activeImageUrl = getPbFileUrl(listing.collectionName, listing.id, imageList[activeIdx] ?? null, { thumb: "1200x900f" });
    const activeImageAlt = title;

    const isSold = status === "Sold";
    const isPending = status === "Pending";
    const urgency = pickupUrgency(availableUntil);
    const days = daysUntil(availableUntil);
    const urgent = days !== null && days <= 3 && days >= 0;

    const reserveUrl = buildListingReserveUrl(waBase, title, price, currency, slug);

    return (
        <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_380px] gap-8 lg:gap-12">
                {/* Left: Images */}
                <div>
                    {/* Main image */}
                    <div className="relative aspect-[4/3] rounded-[8px] overflow-hidden bg-[#F7F7F7] mb-3">
                        {imageList.length > 0 ? (
                            <Image
                                src={activeImageUrl}
                                alt={activeImageAlt ?? title}
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 55vw, 100vw"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-[#AEAEAE] text-sm">No image</div>
                        )}
                        {isSold && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-black/80 text-white text-base font-semibold px-6 py-2 rounded-full">
                                    Sold
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {imageList.length > 1 && (
                        <div className="flex gap-2 flex-wrap" role="list" aria-label="Image thumbnails">
                            {imageList.map((img, i) => (
                                <button
                                    key={i}
                                    role="listitem"
                                    onClick={() => setActiveIdx(i)}
                                    aria-label={`View image ${i + 1}`}
                                    aria-pressed={activeIdx === i}
                                    className={[
                                        "relative w-16 h-16 rounded-[6px] overflow-hidden border-2 transition-colors",
                                        activeIdx === i ? "border-[#146C54]" : "border-[#EAEAEA] hover:border-[#146C54]",
                                    ].join(" ")}
                                >
                                    <Image
                                        src={getPbFileUrl(listing.collectionName, listing.id, img, { thumb: "200x200f" })}
                                        alt={`Image ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="flex flex-col gap-5">
                    {/* Trust badge */}
                    {managedBy !== false && (
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 border border-[#146C54] text-[#146C54] text-xs font-medium px-3 py-1 rounded-full">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <polyline points="9 12 11 14 15 10" />
                                </svg>
                                Managed by ClearoutSpaces · Verified Lister
                            </span>
                        </div>
                    )}

                    <div>
                        <h1 className="font-semibold text-[#111111] text-xl leading-tight mb-1">{title}</h1>
                        <p className="text-2xl font-semibold text-[#146C54]">
                            ${price.toLocaleString()} <span className="text-base font-normal text-[#5A5A5A]">{currency}</span>
                        </p>
                    </div>

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-2">
                        {area && <Badge variant="muted">{area}</Badge>}
                        {condition && <Badge variant="muted">{condition}</Badge>}
                        {isPending && <Badge variant="yellow">Sale Pending</Badge>}
                        {isSold && <Badge variant="red">Sold</Badge>}
                    </div>

                    {/* Pickup */}
                    <div className="bg-[#F7F7F7] rounded-[6px] p-4">
                        <p className={["text-sm font-semibold mb-1", urgent ? "text-red-600" : "text-[#111111]"].join(" ")}>
                            {urgency || (pickupWindowText ?? "Pickup window TBD")}
                        </p>
                        {availableUntil && (
                            <p className="text-[13px] text-[#5A5A5A]">Available until {formatLongDate(availableUntil)}</p>
                        )}
                        {pickupNotes && <p className="text-[13px] text-[#5A5A5A] mt-1">{pickupNotes}</p>}
                    </div>

                    {dimensions && (
                        <p className="text-[14px] text-[#5A5A5A]">
                            <span className="font-medium text-[#111111]">Dimensions:</span> {dimensions}
                        </p>
                    )}

                    {description && (
                        <div
                            className="prose prose-sm max-w-none text-[#5A5A5A]"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}

                    {/* Rules box */}
                    <div className="border border-[#EAEAEA] rounded-[6px] p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#5A5A5A] mb-3">Purchase Rules</p>
                        <ul className="flex flex-col gap-2">
                            {[
                                "First confirmed buyer secures the item",
                                `Pickup required before ${availableUntil ? formatLongDate(availableUntil) : "the listed deadline"}`,
                                "Final sale — no returns",
                                "No delivery available (self-pickup only)",
                            ].map((rule, i) => (
                                <li key={i} className="flex items-start gap-2 text-[13px] text-[#5A5A5A]">
                                    <span className="flex-shrink-0 mt-0.5 text-[#146C54]" aria-hidden="true">·</span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reserve CTA */}
                    {!isSold ? (
                        <a
                            href={reserveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center h-[52px] w-full text-base font-medium text-white bg-[#146C54] hover:bg-[#0f5540] rounded-[6px] transition-colors"
                            aria-label={`Reserve ${title} via WhatsApp`}
                        >
                            Reserve Pickup via WhatsApp
                        </a>
                    ) : (
                        <div className="flex items-center justify-center h-[52px] w-full text-base font-medium text-[#5A5A5A] border border-[#EAEAEA] rounded-[6px] bg-[#F7F7F7] cursor-not-allowed">
                            Item Sold
                        </div>
                    )}

                    <p className="text-[12px] text-[#5A5A5A] text-center">
                        Why are you messaging ClearoutSpaces, not a seller?{" "}
                        <span className="text-[#146C54]">This item is managed by us on behalf of the original owner.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
