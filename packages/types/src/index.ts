import type * as validators from "@ikigai/validators";
import type { z } from "zod";

// ─── Schema-Inferred Types ───────────────────────────────────────────────────
// These are the canonical types, derived from Zod schemas in @ikigai/validators.
// NEVER define these shapes manually elsewhere — import from here.

export type User = z.infer<typeof validators.userSchema>;
export type Property = z.infer<typeof validators.propertySchema>;
export type Journey = z.infer<typeof validators.journeySchema>;
export type Transaction = z.infer<typeof validators.transactionSchema>;
export type Document = z.infer<typeof validators.documentSchema>;
export type Conversation = z.infer<typeof validators.conversationSchema>;
export type Message = z.infer<typeof validators.messageSchema>;

// Re-export all validators for convenience
export * from "@ikigai/validators";

// ─── API Response Types ──────────────────────────────────────────────────────

/** Standard API response envelope */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
}

/** Paginated list response */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ─── Search Types ────────────────────────────────────────────────────────────

/** Property search criteria matching the orchestrator's search tool schema */
export interface SearchCriteria {
    prefectures?: string[];
    municipalities?: string[];
    priceMin?: number;
    priceMax?: number;
    areaMinSqm?: number;
    areaMaxSqm?: number;
    buildingTypes?: Array<"mansion" | "kodate" | "land">;
    maxWalkMinutes?: number;
    yearBuiltAfter?: number;
    floorPlanTypes?: string[];
    featuresRequired?: string[];
    sortBy?: "relevance" | "price_asc" | "price_desc" | "newest" | "closest_station";
    limit?: number;
    offset?: number;
}

// ─── Journey Types ───────────────────────────────────────────────────────────

/** Purchase journey stages matching the workflow state machine */
export type JourneyStage =
    | "exploring"
    | "actively_searching"
    | "evaluating"
    | "negotiating"
    | "contracting"
    | "closing"
    | "post_purchase";

/** Property state within a journey */
export type PropertyState =
    | "shortlisted"
    | "viewing_scheduled"
    | "viewed"
    | "offering"
    | "negotiating"
    | "contract_prep"
    | "contract_signed"
    | "settlement_prep"
    | "settled"
    | "dropped"
    | "cancelled";

// ─── AI/Chat Types ───────────────────────────────────────────────────────────

/** Channels through which users can interact with IKIGAI */
export type Channel = "web" | "mobile" | "line" | "voice";

/** Supported languages */
export type Locale = "ja" | "en";

/** AI action permission levels (FSD Section 3.2) */
export type PermissionLevel =
    | "autonomous"
    | "user_approval"
    | "professional_required";

/** Mediation category for intent classification */
export type MediationCategory =
    | "A" // Information — AI can handle autonomously
    | "B" // Logistics — AI can handle with user approval
    | "C"; // Legal/Negotiation — must escalate to licensed professional

/** Chat message for streaming */
export interface ChatStreamEvent {
    type: "text" | "tool_call" | "tool_result" | "action_request";
    data: unknown;
}

// ─── Price Prediction Types ──────────────────────────────────────────────────

/** Price prediction result from the pricing model service */
export interface PricePrediction {
    predictedPrice: number;
    confidenceLower: number;
    confidenceUpper: number;
    factors: Array<{
        feature: string;
        contribution: number;
        explanation: string;
    }>;
    explanationJa: string;
    explanationEn: string;
    modelVersion: string;
}

// ─── Risk Flag Types ─────────────────────────────────────────────────────────

/** Risk flag from document analysis */
export interface RiskFlag {
    severity: "low" | "medium" | "high" | "critical";
    category: string;
    descriptionJa: string;
    descriptionEn: string;
    action: string;
}
