"use client";

import Input from "@/components/ui/Input";

const SearchIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

interface ListingSearchBarProps {
    value: string;
    onChange: (val: string) => void;
    sort: string;
    onSortChange: (val: string) => void;
    availableOnly: boolean;
    onAvailableOnlyChange: (val: boolean) => void;
    resultsCount: number;
}

const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low → High", value: "price_asc" },
    { label: "Price: High → Low", value: "price_desc" },
    { label: "Deadline Soon", value: "deadline_soon" },
];

export default function ListingSearchBar({
    value,
    onChange,
    sort,
    onSortChange,
    availableOnly,
    onAvailableOnlyChange,
    resultsCount,
}: ListingSearchBarProps) {
    return (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <Input
                        icon={SearchIcon}
                        placeholder="Search by item name, brand, area, category, or tag…"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        aria-label="Search listings"
                    />
                </div>

                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value)}
                    aria-label="Sort listings"
                    className="h-12 border border-[#EAEAEA] rounded-[8px] bg-white text-[#111111] text-sm px-3 pr-8 focus:outline-none focus:border-[#146C54] focus:ring-1 focus:ring-[#146C54] cursor-pointer"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-[#EFEFEF] pb-3">
                <p className="text-sm text-[#111111] font-medium">{resultsCount} items found</p>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={availableOnly}
                        onChange={(e) => onAvailableOnlyChange(e.target.checked)}
                        className="h-4 w-4 rounded border-[#CFCFCF] text-[#146C54] focus:ring-[#146C54]"
                        aria-label="Show available listings only"
                    />
                    <span className="text-sm text-[#2F2F2F]">Show available only</span>
                </label>
            </div>
        </div>
    );
}
