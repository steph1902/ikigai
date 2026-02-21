/**
 * @ikigai/search — Search Engine Client
 *
 * Unified search interface combining:
 * - SQL full-text search via PostgreSQL tsvector (structured property search)
 * - Semantic vector search via Cohere embeddings (natural language queries)
 *
 * In portfolio mode, SQL search is the primary path.
 * The semantic search layer provides the architecture for scaling to vector search.
 */

import { z } from "zod";
import { createServiceLogger } from "@ikigai/logger";

const log = createServiceLogger("search");

// ─── Search Criteria Schema ──────────────────────────────────────────────────

export const searchCriteriaSchema = z.object({
    /** Natural language query — sent to embedding service for semantic search */
    query: z.string().optional(),

    /** Structured filters */
    prefectures: z.array(z.string()).optional(),
    municipalities: z.array(z.string()).optional(),
    priceMin: z.number().min(0).optional(),
    priceMax: z.number().min(0).optional(),
    areaMinSqm: z.number().min(0).optional(),
    areaMaxSqm: z.number().min(0).optional(),
    buildingTypes: z.array(z.enum(["mansion", "kodate", "land"])).optional(),
    maxWalkMinutes: z.number().int().min(0).optional(),
    yearBuiltAfter: z.number().int().optional(),
    floorPlanTypes: z.array(z.string()).optional(),
    featuresRequired: z.array(z.string()).optional(),
    newEarthquakeStandard: z.boolean().optional(),

    /** Pagination & Sort */
    sortBy: z
        .enum(["relevance", "price_asc", "price_desc", "newest", "closest_station"])
        .default("relevance"),
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
});

export type SearchCriteria = z.infer<typeof searchCriteriaSchema>;

// ─── Search Results ──────────────────────────────────────────────────────────

export interface SearchResult {
    id: string;
    title: string;
    price: number;
    layout: string;
    areaSqm: number;
    stationName: string;
    walkMinutes: number;
    yearBuilt: number;
    prefecture: string;
    municipality: string;
    buildingType: string;
    imageUrl?: string;
    score?: number; // Relevance score (for semantic search)
}

export interface SearchResponse {
    items: SearchResult[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
    searchMode: "sql" | "semantic" | "hybrid";
}

// ─── Search Client ───────────────────────────────────────────────────────────

export interface SearchClientConfig {
    /** Base URL for the API (tRPC or direct) */
    apiBaseUrl: string;
    /** Base URL for the embedding service (for semantic search) */
    embeddingBaseUrl?: string;
}

/**
 * Unified search client.
 */
export class SearchClient {
    private apiBaseUrl: string;
    private embeddingBaseUrl?: string;

    constructor(config: SearchClientConfig) {
        this.apiBaseUrl = config.apiBaseUrl.replace(/\/$/, "");
        this.embeddingBaseUrl = config.embeddingBaseUrl?.replace(/\/$/, "");
    }

    /**
     * Execute a property search.
     * Uses SQL when structured filters are provided, semantic when a natural language
     * query is provided, or hybrid when both are present.
     */
    async search(criteria: SearchCriteria): Promise<SearchResponse> {
        const validated = searchCriteriaSchema.parse(criteria);

        const searchMode = this.determineSearchMode(validated);
        log.info({ searchMode, query: validated.query }, "Executing property search");

        const response = await fetch(`${this.apiBaseUrl}/api/properties`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...validated, searchMode }),
        });

        if (!response.ok) {
            throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();

        log.info(
            { total: data.total, mode: searchMode },
            `Search complete: ${data.total} results`,
        );

        return {
            ...data,
            searchMode,
        };
    }

    /**
     * Get search suggestions as the user types.
     */
    async suggest(query: string, limit = 5): Promise<string[]> {
        if (!query || query.length < 2) return [];

        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/properties/suggest?q=${encodeURIComponent(query)}&limit=${limit}`,
            );
            if (!response.ok) return [];
            const data = await response.json();
            return data.suggestions ?? [];
        } catch {
            return [];
        }
    }

    private determineSearchMode(criteria: SearchCriteria): "sql" | "semantic" | "hybrid" {
        const hasQuery = !!criteria.query && criteria.query.trim().length > 0;
        const hasFilters =
            criteria.prefectures?.length ||
            criteria.priceMin ||
            criteria.priceMax ||
            criteria.buildingTypes?.length ||
            criteria.floorPlanTypes?.length;

        if (hasQuery && hasFilters) return "hybrid";
        if (hasQuery) return "semantic";
        return "sql";
    }
}

// ─── Utility Functions ──────────────────────────────────────────────────────

/**
 * Build a human-readable search summary in Japanese.
 */
export function buildSearchSummary(criteria: SearchCriteria, locale: "ja" | "en" = "ja"): string {
    const parts: string[] = [];

    if (criteria.prefectures?.length) {
        parts.push(criteria.prefectures.join("・"));
    }
    if (criteria.floorPlanTypes?.length) {
        parts.push(criteria.floorPlanTypes.join("/"));
    }
    if (criteria.priceMax) {
        const man = criteria.priceMax / 10000;
        parts.push(locale === "ja" ? `${man.toLocaleString()}万円以下` : `Under ¥${man.toLocaleString()}M`);
    }
    if (criteria.maxWalkMinutes) {
        parts.push(
            locale === "ja"
                ? `徒歩${criteria.maxWalkMinutes}分以内`
                : `≤${criteria.maxWalkMinutes}min walk`,
        );
    }

    return parts.length > 0
        ? parts.join(locale === "ja" ? "、" : ", ")
        : locale === "ja"
            ? "条件なし"
            : "No filters applied";
}
