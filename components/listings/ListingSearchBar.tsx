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
}

const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low → High", value: "price_asc" },
    { label: "Price: High → Low", value: "price_desc" },
    { label: "Deadline Soon", value: "deadline_soon" },
];

export default function ListingSearchBar({ value, onChange, sort, onSortChange }: ListingSearchBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
                <Input
                    icon={SearchIcon}
                    placeholder="Search by title, area, or category…"
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
    );
}
