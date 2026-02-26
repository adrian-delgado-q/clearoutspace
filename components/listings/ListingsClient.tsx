"use client";

import { useState, useMemo } from "react";
import type { Listing } from "@/lib/schemas";
import ListingSearchBar from "./ListingSearchBar";
import ListingGrid from "./ListingGrid";
import ListingEmptyState from "./ListingEmptyState";
import { daysUntil } from "@/lib/dates";

type SortKey = "newest" | "price_asc" | "price_desc" | "deadline_soon";

interface ListingsClientProps {
    listings: Listing[];
}

export default function ListingsClient({ listings }: ListingsClientProps) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortKey>("newest");

    const filtered = useMemo(() => {
        let result = listings;

        if (query.trim()) {
            const q = query.toLowerCase();
            result = result.filter(
                (l) =>
                    l.attributes.title.toLowerCase().includes(q) ||
                    (l.attributes.area ?? "").toLowerCase().includes(q) ||
                    (l.attributes.category ?? "").toLowerCase().includes(q) ||
                    l.attributes.tags?.some((t) => t.tag.toLowerCase().includes(q)),
            );
        }

        switch (sort) {
            case "price_asc":
                result = [...result].sort((a, b) => a.attributes.price - b.attributes.price);
                break;
            case "price_desc":
                result = [...result].sort((a, b) => b.attributes.price - a.attributes.price);
                break;
            case "deadline_soon":
                result = [...result].sort((a, b) => {
                    const da = daysUntil(a.attributes.availableUntil) ?? 999;
                    const db = daysUntil(b.attributes.availableUntil) ?? 999;
                    return da - db;
                });
                break;
            default:
                // newest: keep server sort (descending createdAt)
                break;
        }

        return result;
    }, [listings, query, sort]);

    return (
        <>
            <div className="mb-8">
                <ListingSearchBar
                    value={query}
                    onChange={setQuery}
                    sort={sort}
                    onSortChange={(v) => setSort(v as SortKey)}
                />
            </div>

            {filtered.length === 0 && listings.length === 0 && <ListingEmptyState />}

            {filtered.length === 0 && listings.length > 0 && (
                <div className="py-16 text-center">
                    <p className="text-[#5A5A5A]">No listings match your search. Try a different keyword.</p>
                    <button
                        onClick={() => setQuery("")}
                        className="mt-3 text-sm text-[#146C54] hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {filtered.length > 0 && <ListingGrid listings={filtered} />}
        </>
    );
}
