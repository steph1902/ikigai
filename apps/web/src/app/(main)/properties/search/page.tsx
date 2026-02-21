"use client";

import { formatPrice, formatArea, formatStationAccessShort, formatBuildingAge } from "@ikigai/i18n/formatters";
import { Button } from "@ikigai/ui/button";
import { Input } from "@ikigai/ui/input";
import { Select } from "@ikigai/ui/select";
import {
    Building2,
    ChevronDown,
    Heart,
    MapPin,
    Ruler,
    Search,
    SlidersHorizontal,
    Train,
    X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Property {
    id: string;
    address: string;
    municipality: string;
    buildingType: string;
    floorPlan: string;
    totalAreaSqm: string;
    listingPrice: number;
    yearBuilt: number;
    nearestStationName: string;
    nearestStationLine: string;
    nearestStationWalkMinutes: number;
    earthquakeStandard: string;
    images: string;
    description: string;
    managementFee: number;
    repairReserveFee: number;
    features: string;
}

interface SearchResults {
    properties: Property[];
    pagination: {
        page: number;
        totalCount: number;
        totalPages: number;
        hasMore: boolean;
    };
}

const TOKYO_WARDS = [
    "渋谷区", "新宿区", "港区", "目黒区", "世田谷区", "中央区", "千代田区",
    "文京区", "台東区", "品川区", "豊島区", "杉並区", "中野区", "板橋区", "練馬区",
];

const LAYOUTS = ["1R", "1K", "1LDK", "2LDK", "3LDK", "4LDK"];

const SORT_OPTIONS = [
    { value: "newest", label: "新着順" },
    { value: "priceAsc", label: "価格の安い順" },
    { value: "priceDesc", label: "価格の高い順" },
    { value: "areaDesc", label: "面積の広い順" },
    { value: "walkMinutes", label: "駅近順" },
];

export default function PropertySearchPage() {
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    // Filter state
    const [ward, setWard] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [layout, setLayout] = useState("");
    const [walkMinutes, setWalkMinutes] = useState("");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (ward) params.set("ward", ward);
        if (priceMin) params.set("priceMin", priceMin);
        if (priceMax) params.set("priceMax", priceMax);
        if (layout) params.set("layout", layout);
        if (walkMinutes) params.set("walkMinutes", walkMinutes);
        params.set("sort", sort);
        params.set("page", String(page));

        try {
            const res = await fetch(`/api/properties?${params.toString()}`);
            const data = await res.json();
            setResults(data);
        } catch {
            console.error("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }, [ward, priceMin, priceMax, layout, walkMinutes, sort, page]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const toggleSave = (id: string) => {
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const clearFilters = () => {
        setWard("");
        setPriceMin("");
        setPriceMax("");
        setLayout("");
        setWalkMinutes("");
        setPage(1);
    };

    const hasActiveFilters = ward || priceMin || priceMax || layout || walkMinutes;

    const getImages = (images: string): string[] => {
        try {
            return JSON.parse(images) as string[];
        } catch {
            return [];
        }
    };

    const getFeatures = (features: string): string[] => {
        try {
            return JSON.parse(features) as string[];
        } catch {
            return [];
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Search Header */}
            <div className="sticky top-14 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex items-center gap-3 px-4 py-3">
                    <div className="flex flex-1 items-center gap-2 rounded-lg border bg-card px-3 py-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={ward}
                            onChange={(e) => { setWard(e.target.value); setPage(1); }}
                            className="flex-1 bg-transparent text-sm outline-none"
                        >
                            <option value="">全エリア</option>
                            {TOKYO_WARDS.map((w) => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="rounded-lg border bg-card px-3 py-2 text-sm"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${hasActiveFilters ? "border-accent bg-accent/10 text-accent" : "bg-card"
                            }`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">絞り込み</span>
                        {hasActiveFilters && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                                {[ward, priceMin, priceMax, layout, walkMinutes].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Expandable Filters Panel */}
                {showFilters && (
                    <div className="container mx-auto border-t px-4 py-4">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                    価格下限
                                </label>
                                <select
                                    value={priceMin}
                                    onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
                                    className="w-full rounded-md border bg-card px-2 py-1.5 text-sm"
                                >
                                    <option value="">指定なし</option>
                                    <option value="10000000">1,000万円</option>
                                    <option value="20000000">2,000万円</option>
                                    <option value="30000000">3,000万円</option>
                                    <option value="50000000">5,000万円</option>
                                    <option value="70000000">7,000万円</option>
                                    <option value="100000000">1億円</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                    価格上限
                                </label>
                                <select
                                    value={priceMax}
                                    onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
                                    className="w-full rounded-md border bg-card px-2 py-1.5 text-sm"
                                >
                                    <option value="">指定なし</option>
                                    <option value="30000000">3,000万円</option>
                                    <option value="50000000">5,000万円</option>
                                    <option value="70000000">7,000万円</option>
                                    <option value="100000000">1億円</option>
                                    <option value="150000000">1億5,000万円</option>
                                    <option value="200000000">2億円</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                    間取り
                                </label>
                                <select
                                    value={layout}
                                    onChange={(e) => { setLayout(e.target.value); setPage(1); }}
                                    className="w-full rounded-md border bg-card px-2 py-1.5 text-sm"
                                >
                                    <option value="">すべて</option>
                                    {LAYOUTS.map((l) => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                    駅徒歩
                                </label>
                                <select
                                    value={walkMinutes}
                                    onChange={(e) => { setWalkMinutes(e.target.value); setPage(1); }}
                                    className="w-full rounded-md border bg-card px-2 py-1.5 text-sm"
                                >
                                    <option value="">指定なし</option>
                                    <option value="3">3分以内</option>
                                    <option value="5">5分以内</option>
                                    <option value="7">7分以内</option>
                                    <option value="10">10分以内</option>
                                    <option value="15">15分以内</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    条件をクリア
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="container mx-auto px-4 py-6">
                {/* Results count */}
                {results && (
                    <p className="mb-4 text-sm text-muted-foreground">
                        {results.pagination.totalCount > 0
                            ? `${results.pagination.totalCount.toLocaleString("ja-JP")}件の物件`
                            : "条件に合う物件が見つかりませんでした"}
                    </p>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={`skeleton-${i}`} className="animate-pulse rounded-xl border bg-card">
                                <div className="aspect-[4/3] rounded-t-xl bg-muted" />
                                <div className="space-y-3 p-4">
                                    <div className="h-4 w-3/4 rounded bg-muted" />
                                    <div className="h-3 w-1/2 rounded bg-muted" />
                                    <div className="flex gap-3">
                                        <div className="h-3 w-16 rounded bg-muted" />
                                        <div className="h-3 w-16 rounded bg-muted" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Property grid */}
                {!loading && results && results.properties.length > 0 && (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {results.properties.map((property) => {
                                const images = getImages(property.images);
                                const features = getFeatures(property.features);
                                const currentYear = new Date().getFullYear();
                                const buildingAge = currentYear - property.yearBuilt;

                                return (
                                    <Link
                                        key={property.id}
                                        href={`/properties/${property.id}`}
                                        className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:border-accent/50 hover:shadow-lg"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            {images[0] ? (
                                                <img
                                                    src={images[0]}
                                                    alt={property.address}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <Building2 className="h-12 w-12 text-muted-foreground/30" />
                                                </div>
                                            )}

                                            {/* Save button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleSave(property.id);
                                                }}
                                                className="absolute right-3 top-3 rounded-full bg-black/40 p-2 backdrop-blur-sm transition-colors hover:bg-black/60"
                                            >
                                                <Heart
                                                    className={`h-4 w-4 ${savedIds.has(property.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                                                />
                                            </button>

                                            {/* Price badge */}
                                            <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                                                <span className="text-lg font-bold text-white">
                                                    {formatPrice(property.listingPrice)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-4">
                                            <div className="mb-2 flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="truncate">{property.municipality}</span>
                                                    </div>
                                                </div>
                                                <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                                                    {property.floorPlan}
                                                </span>
                                            </div>

                                            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Ruler className="h-3.5 w-3.5" />
                                                    {formatArea(Number(property.totalAreaSqm), false)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Train className="h-3.5 w-3.5" />
                                                    {formatStationAccessShort(property.nearestStationName, property.nearestStationWalkMinutes)}
                                                </span>
                                                <span>{formatBuildingAge(buildingAge)}</span>
                                            </div>

                                            {/* Monthly costs */}
                                            <div className="rounded-md bg-secondary/50 px-2.5 py-1.5 text-xs text-muted-foreground">
                                                管理費等 {(property.managementFee + property.repairReserveFee).toLocaleString("ja-JP")}円/月
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {results.pagination.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <Button
                                    variant="secondary"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    前へ
                                </Button>
                                <span className="px-4 text-sm text-muted-foreground">
                                    {page} / {results.pagination.totalPages}
                                </span>
                                <Button
                                    variant="secondary"
                                    disabled={!results.pagination.hasMore}
                                    onClick={() => setPage(page + 1)}
                                >
                                    次へ
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* Empty state */}
                {!loading && results && results.properties.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Building2 className="mb-4 h-16 w-16 text-muted-foreground/30" />
                        <h3 className="mb-2 text-lg font-medium">物件が見つかりませんでした</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            検索条件を変更してお試しください
                        </p>
                        <Button variant="secondary" onClick={clearFilters}>
                            条件をクリア
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
