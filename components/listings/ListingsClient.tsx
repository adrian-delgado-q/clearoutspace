"use client";

import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/lib/schemas";
import ListingSearchBar from "./ListingSearchBar";
import ListingGrid from "./ListingGrid";
import ListingEmptyState from "./ListingEmptyState";
import { daysUntil } from "@/lib/dates";
import { normalizeFilterToken, parseListingTags } from "@/lib/listings";

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
    const [availableOnly, setAvailableOnly] = useState(true);
    const [selectedArea, setSelectedArea] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedCondition, setSelectedCondition] = useState("all");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const areas = useMemo(
        () =>
            Array.from(new Set(listings.map((listing) => listing.area?.trim()).filter((v): v is string => Boolean(v)))).sort(
                (a, b) => a.localeCompare(b),
            ),
        [listings],
    );
    const categories = useMemo(
        () =>
            Array.from(
                new Set(listings.map((listing) => listing.category?.trim()).filter((v): v is string => Boolean(v))),
            ).sort((a, b) => a.localeCompare(b)),
        [listings],
    );
    const conditions = useMemo(
        () =>
            Array.from(
                new Set(listings.map((listing) => listing.condition?.trim()).filter((v): v is string => Boolean(v))),
            ).sort((a, b) => a.localeCompare(b)),
        [listings],
    );
    const tags = useMemo(
        () =>
            Array.from(new Set(listings.flatMap((listing) => parseListingTags(listing.tags)))).sort((a, b) =>
                a.localeCompare(b),
            ),
        [listings],
    );
    const priceBounds = useMemo(() => {
        if (listings.length === 0) return { min: 0, max: 0 };
        const prices = listings.map((listing) => listing.price);
        return { min: Math.min(...prices), max: Math.max(...prices) };
    }, [listings]);

    const filtered = useMemo(() => {
        let result = listings;

        if (availableOnly) {
            result = result.filter((listing) => listing.status === "Available");
        }

        if (selectedArea !== "all") {
            result = result.filter((listing) => (listing.area?.trim() ?? "") === selectedArea);
        }

        if (selectedCategory !== "all") {
            result = result.filter((listing) => (listing.category?.trim() ?? "") === selectedCategory);
        }

        if (selectedCondition !== "all") {
            result = result.filter((listing) => (listing.condition?.trim() ?? "") === selectedCondition);
        }

        const min = Number(minPrice);
        if (Number.isFinite(min) && minPrice !== "") {
            result = result.filter((listing) => listing.price >= min);
        }

        const max = Number(maxPrice);
        if (Number.isFinite(max) && maxPrice !== "") {
            result = result.filter((listing) => listing.price <= max);
        }

        if (selectedTags.length > 0) {
            const selected = new Set(selectedTags.map(normalizeFilterToken));
            result = result.filter((listing) => {
                const listingTags = parseListingTags(listing.tags).map(normalizeFilterToken);
                return listingTags.some((tag) => selected.has(tag));
            });
        }

        if (query.trim()) {
            const q = query.toLowerCase();
            result = result.filter(
                (l) =>
                    l.title.toLowerCase().includes(q) ||
                    (l.area ?? "").toLowerCase().includes(q) ||
                    (l.category ?? "").toLowerCase().includes(q) ||
                    parseListingTags(l.tags).some((tag) => tag.toLowerCase().includes(q)),
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
    }, [
        listings,
        availableOnly,
        selectedArea,
        selectedCategory,
        selectedCondition,
        selectedTags,
        minPrice,
        maxPrice,
        query,
        sort,
    ]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    useEffect(() => {
        setPage(1);
    }, [query, sort, availableOnly, selectedArea, selectedCategory, selectedCondition, minPrice, maxPrice, selectedTags]);

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

    const activeFilters = useMemo(() => {
        const chips: { id: string; label: string; clear: () => void }[] = [];

        if (selectedArea !== "all") {
            chips.push({ id: "area", label: selectedArea, clear: () => setSelectedArea("all") });
        }
        if (selectedCategory !== "all") {
            chips.push({ id: "category", label: selectedCategory, clear: () => setSelectedCategory("all") });
        }
        if (selectedCondition !== "all") {
            chips.push({ id: "condition", label: selectedCondition, clear: () => setSelectedCondition("all") });
        }
        if (minPrice !== "") {
            chips.push({ id: "min-price", label: `Min $${minPrice}`, clear: () => setMinPrice("") });
        }
        if (maxPrice !== "") {
            chips.push({ id: "max-price", label: `Max $${maxPrice}`, clear: () => setMaxPrice("") });
        }
        selectedTags.forEach((tag) => {
            chips.push({
                id: `tag-${tag}`,
                label: `#${tag}`,
                clear: () => setSelectedTags((prev) => prev.filter((item) => item !== tag)),
            });
        });

        return chips;
    }, [selectedArea, selectedCategory, selectedCondition, minPrice, maxPrice, selectedTags]);

    const clearAllFilters = () => {
        setAvailableOnly(true);
        setSelectedArea("all");
        setSelectedCategory("all");
        setSelectedCondition("all");
        setSelectedTags([]);
        setMinPrice("");
        setMaxPrice("");
        setQuery("");
        setSort("newest");
    };

    return (
        <>
            <div className="mb-8">
                <ListingSearchBar
                    value={query}
                    onChange={setQuery}
                    sort={sort}
                    onSortChange={(v) => setSort(v as SortKey)}
                    availableOnly={availableOnly}
                    onAvailableOnlyChange={setAvailableOnly}
                    resultsCount={filtered.length}
                />

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-[#5A5A5A]">Area</span>
                        <select
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            className="h-11 border border-[#EAEAEA] rounded-[8px] bg-white text-sm px-3 focus:outline-none focus:border-[#146C54] focus:ring-1 focus:ring-[#146C54]"
                            aria-label="Filter listings by area"
                        >
                            <option value="all">All Areas</option>
                            {areas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-[#5A5A5A]">Category</span>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="h-11 border border-[#EAEAEA] rounded-[8px] bg-white text-sm px-3 focus:outline-none focus:border-[#146C54] focus:ring-1 focus:ring-[#146C54]"
                            aria-label="Filter listings by category"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-[#5A5A5A]">Condition</span>
                        <select
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                            className="h-11 border border-[#EAEAEA] rounded-[8px] bg-white text-sm px-3 focus:outline-none focus:border-[#146C54] focus:ring-1 focus:ring-[#146C54]"
                            aria-label="Filter listings by condition"
                        >
                            <option value="all">Any Condition</option>
                            {conditions.map((condition) => (
                                <option key={condition} value={condition}>
                                    {condition}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-[#5A5A5A]">Min Price</span>
                            <input
                                type="number"
                                min={priceBounds.min}
                                placeholder={`$${priceBounds.min || 0}`}
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="h-11 border border-[#EAEAEA] rounded-[8px] bg-white text-sm px-3 focus:outline-none focus:border-[#146C54] focus:ring-1 focus:ring-[#146C54]"
                                aria-label="Minimum price"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-[#5A5A5A]">Max Price</span>
                            <input
                                type="number"
                                min={priceBounds.min}
                                placeholder={`$${priceBounds.max || 0}`}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="h-11 border border-[#EAEAEA] rounded-[8px] bg-white text-sm px-3 focus:outline-none focus:border-[#146C54] focus:ring-1 focus:ring-[#146C54]"
                                aria-label="Maximum price"
                            />
                        </label>
                    </div>
                </div>

                {tags.length > 0 && (
                    <div className="mt-4 rounded-[10px] border border-[#EAEAEA] p-3">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <p className="text-sm font-medium text-[#111111]">Filter by tags</p>
                            {selectedTags.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedTags([])}
                                    className="text-xs text-[#146C54] hover:underline"
                                >
                                    Clear tags
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => {
                                const active = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() =>
                                            setSelectedTags((prev) =>
                                                prev.includes(tag)
                                                    ? prev.filter((item) => item !== tag)
                                                    : [...prev, tag],
                                            )
                                        }
                                        className={[
                                            "px-3 py-1.5 rounded-full text-xs border transition-colors",
                                            active
                                                ? "border-[#146C54] bg-[#E6F4F0] text-[#146C54]"
                                                : "border-[#E1E1E1] bg-white text-[#3A3A3A] hover:border-[#146C54]",
                                        ].join(" ")}
                                        aria-pressed={active}
                                    >
                                        #{tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeFilters.length > 0 && (
                    <div className="mt-4 flex items-center flex-wrap gap-2">
                        {activeFilters.map((filterChip) => (
                            <button
                                key={filterChip.id}
                                type="button"
                                onClick={filterChip.clear}
                                className="inline-flex items-center gap-2 rounded-full border border-[#DCEEE8] bg-[#F2FBF7] px-3 py-1.5 text-xs text-[#146C54]"
                            >
                                {filterChip.label}
                                <span aria-hidden="true">×</span>
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-xs text-[#5A5A5A] hover:text-[#111111] underline underline-offset-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {filtered.length === 0 && listings.length === 0 && <ListingEmptyState />}

            {filtered.length === 0 && listings.length > 0 && (
                <div className="py-16 text-center">
                    <p className="text-[#5A5A5A]">No listings match your filters. Try broadening your filters.</p>
                    <button
                        onClick={clearAllFilters}
                        className="mt-3 text-sm text-[#146C54] hover:underline"
                    >
                        Clear all filters
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
