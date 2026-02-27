"use client";

import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/lib/schemas";
import ListingSearchBar from "./ListingSearchBar";
import ListingGrid from "./ListingGrid";
import ListingEmptyState from "./ListingEmptyState";
import { daysUntil } from "@/lib/dates";

type SortKey = "newest" | "price_asc" | "price_desc" | "deadline_soon";

interface ListingsClientProps {
    listings: Listing[];
    soldListings: Listing[];
}

const PAGE_SIZE = 10;

export default function ListingsClient({ listings, soldListings }: ListingsClientProps) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortKey>("newest");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let result = listings;

        if (query.trim()) {
            const q = query.toLowerCase();
            result = result.filter(
                (l) =>
                    l.title.toLowerCase().includes(q) ||
                    (l.area ?? "").toLowerCase().includes(q) ||
                    (l.category ?? "").toLowerCase().includes(q) ||
                    (l.tags ?? "").toLowerCase().includes(q),
            );
        }

        switch (sort) {
            case "price_asc":
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case "deadline_soon":
                result = [...result].sort((a, b) => {
                    const da = daysUntil(a.availableUntil) ?? 999;
                    const db = daysUntil(b.availableUntil) ?? 999;
                    return da - db;
                });
                break;
            default:
                // newest: keep server sort (descending createdAt)
                break;
        }

        return result;
    }, [listings, query, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    useEffect(() => {
        setPage(1);
    }, [query, sort]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const paginated = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const pageButtons = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const start = Math.max(1, Math.min(page - 2, totalPages - 4));
        return Array.from({ length: 5 }, (_, i) => start + i);
    }, [page, totalPages]);

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

            {filtered.length > 0 && (
                <>
                    <ListingGrid listings={paginated} />

                    {totalPages > 1 && (
                        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Listings pagination">
                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="px-3 py-2 text-sm border border-[#E1E1E1] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#146C54]"
                            >
                                Previous
                            </button>

                            {pageButtons.map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => setPage(pageNumber)}
                                    className={[
                                        "min-w-9 px-3 py-2 text-sm border rounded-md",
                                        page === pageNumber
                                            ? "bg-[#146C54] text-white border-[#146C54]"
                                            : "border-[#E1E1E1] hover:border-[#146C54]",
                                    ].join(" ")}
                                    aria-current={page === pageNumber ? "page" : undefined}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-2 text-sm border border-[#E1E1E1] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#146C54]"
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </>
            )}

            {soldListings.length > 0 && (
                <section className="mt-16 border-t border-[#EFEFEF] pt-8">
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#5A5A5A] mb-2">
                            Recently Sold
                        </p>
                        <h2 className="text-xl font-semibold text-[#111111]">Last 3 sold items</h2>
                    </div>

                    <ListingGrid listings={soldListings.slice(0, 3)} ariaLabel="Recently sold listings" />
                </section>
            )}
        </>
    );
}
