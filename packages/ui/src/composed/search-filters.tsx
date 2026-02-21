"use client";

import { cn } from "../utils";

/**
 * Property search filter panel.
 * Provides structured search criteria matching the orchestrator's search tool schema.
 * Filters follow Japanese real estate conventions (万円 pricing, 駅徒歩, 間取り codes).
 */

const PRICE_OPTIONS = [
    { value: "", label: "指定なし" },
    { value: "10000000", label: "1,000万円" },
    { value: "20000000", label: "2,000万円" },
    { value: "30000000", label: "3,000万円" },
    { value: "40000000", label: "4,000万円" },
    { value: "50000000", label: "5,000万円" },
    { value: "60000000", label: "6,000万円" },
    { value: "70000000", label: "7,000万円" },
    { value: "80000000", label: "8,000万円" },
    { value: "100000000", label: "1億円" },
    { value: "150000000", label: "1億5,000万円" },
    { value: "200000000", label: "2億円" },
];

const LAYOUT_OPTIONS = [
    { value: "1R", label: "1R" },
    { value: "1K", label: "1K" },
    { value: "1LDK", label: "1LDK" },
    { value: "2LDK", label: "2LDK" },
    { value: "3LDK", label: "3LDK" },
    { value: "4LDK", label: "4LDK" },
];

const WALK_OPTIONS = [
    { value: "3", label: "3分以内" },
    { value: "5", label: "5分以内" },
    { value: "7", label: "7分以内" },
    { value: "10", label: "10分以内" },
    { value: "15", label: "15分以内" },
];

const BUILDING_AGE_OPTIONS = [
    { value: "0", label: "新築" },
    { value: "5", label: "5年以内" },
    { value: "10", label: "10年以内" },
    { value: "15", label: "15年以内" },
    { value: "20", label: "20年以内" },
    { value: "30", label: "30年以内" },
];

export interface SearchFiltersValue {
    priceMin: string;
    priceMax: string;
    layouts: string[];
    maxWalkMinutes: string;
    maxBuildingAge: string;
    newEarthquakeStandardOnly: boolean;
}

interface SearchFiltersProps {
    value: SearchFiltersValue;
    onChange: (value: SearchFiltersValue) => void;
    className?: string;
}

export function SearchFilters({ value, onChange, className }: SearchFiltersProps) {
    const update = (partial: Partial<SearchFiltersValue>) =>
        onChange({ ...value, ...partial });

    return (
        <div className={cn("space-y-4", className)}>
            {/* Price Range */}
            <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">
                    価格帯
                </label>
                <div className="flex items-center gap-2">
                    <select
                        value={value.priceMin}
                        onChange={(e) => update({ priceMin: e.target.value })}
                        className="flex-1 rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white"
                    >
                        {PRICE_OPTIONS.map((o) => (
                            <option key={`min-${o.value}`} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                    <span className="text-[#6B6B80]">〜</span>
                    <select
                        value={value.priceMax}
                        onChange={(e) => update({ priceMax: e.target.value })}
                        className="flex-1 rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white"
                    >
                        {PRICE_OPTIONS.map((o) => (
                            <option key={`max-${o.value}`} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Layout */}
            <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">
                    間取り
                </label>
                <div className="flex flex-wrap gap-2">
                    {LAYOUT_OPTIONS.map((o) => {
                        const isSelected = value.layouts.includes(o.value);
                        return (
                            <button
                                key={o.value}
                                type="button"
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm border transition-colors",
                                    isSelected
                                        ? "bg-[#3D5A80] text-white border-[#3D5A80]"
                                        : "bg-white text-[#2D2D44] border-[#E0E0E8] hover:border-[#3D5A80]",
                                )}
                                onClick={() =>
                                    update({
                                        layouts: isSelected
                                            ? value.layouts.filter((l) => l !== o.value)
                                            : [...value.layouts, o.value],
                                    })
                                }
                            >
                                {o.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Walk Minutes */}
            <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">
                    駅徒歩
                </label>
                <select
                    value={value.maxWalkMinutes}
                    onChange={(e) => update({ maxWalkMinutes: e.target.value })}
                    className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white"
                >
                    <option value="">指定なし</option>
                    {WALK_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Building Age */}
            <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">
                    築年数
                </label>
                <select
                    value={value.maxBuildingAge}
                    onChange={(e) => update({ maxBuildingAge: e.target.value })}
                    className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white"
                >
                    <option value="">指定なし</option>
                    {BUILDING_AGE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* New Earthquake Standard */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="earthquake-standard"
                    checked={value.newEarthquakeStandardOnly}
                    onChange={(e) =>
                        update({ newEarthquakeStandardOnly: e.target.checked })
                    }
                    className="rounded border-[#E0E0E8]"
                />
                <label
                    htmlFor="earthquake-standard"
                    className="text-sm text-[#2D2D44]"
                >
                    新耐震基準のみ
                </label>
            </div>
        </div>
    );
}
