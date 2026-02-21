/**
 * @ikigai/pricing — Price Prediction Client
 *
 * TypeScript client for the pricing-model FastAPI service.
 * Handles property valuation, renovation cost estimation, and
 * explanatory factor interpretation for the AI chat.
 */

import { z } from "zod";
import { createServiceLogger } from "@ikigai/logger";

const log = createServiceLogger("pricing");

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const propertyFeaturesSchema = z.object({
    total_area_sqm: z.number().positive(),
    year_built: z.number().int().min(1945).max(2030),
    minutes_to_station: z.number().int().min(0),
    latitude: z.number(),
    longitude: z.number(),
    building_type: z.enum(["mansion", "kodate", "land"]),
    region: z.enum(["tokyo", "osaka", "nagoya"]).default("tokyo"),
});
export type PropertyFeatures = z.infer<typeof propertyFeaturesSchema>;

export const predictionResponseSchema = z.object({
    predicted_price: z.number(),
    confidence_interval: z.array(z.number()).length(2),
    explanation: z.string(),
});
export type PredictionResponse = z.infer<typeof predictionResponseSchema>;

export const renovationRequestSchema = z.object({
    total_area_sqm: z.number().positive(),
    scope: z.enum(["full", "kitchen", "bath", "wallpaper", "flooring"]),
    quality: z.enum(["standard", "high_end"]),
    region: z.enum(["tokyo", "osaka", "nagoya"]).default("tokyo"),
});
export type RenovationRequest = z.infer<typeof renovationRequestSchema>;

export const renovationResponseSchema = z.object({
    estimated_cost: z.number(),
    breakdown: z.record(z.number()),
    duration_weeks: z.number(),
});
export type RenovationResponse = z.infer<typeof renovationResponseSchema>;

// ─── Client ──────────────────────────────────────────────────────────────────

export interface PricingClientConfig {
    baseUrl: string;
    timeout?: number;
}

/**
 * TypeScript client for the pricing-model FastAPI service.
 */
export class PricingClient {
    private baseUrl: string;
    private timeout: number;

    constructor(config: PricingClientConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.timeout = config.timeout ?? 15000;
    }

    /**
     * Get an AI price prediction for a property.
     */
    async predict(features: PropertyFeatures): Promise<PredictionResponse> {
        const validated = propertyFeaturesSchema.parse(features);

        log.info(
            { region: validated.region, area: validated.total_area_sqm },
            "Requesting price prediction",
        );

        const response = await fetch(`${this.baseUrl}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validated),
            signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
            const error = await response.text().catch(() => "Unknown error");
            throw new Error(`Price prediction failed: ${response.status} ${error}`);
        }

        const data = await response.json();
        const result = predictionResponseSchema.parse(data);

        log.info(
            { predicted: result.predicted_price, confidence: result.confidence_interval },
            "Price prediction complete",
        );

        return result;
    }

    /**
     * Estimate renovation costs for a property.
     */
    async estimateRenovation(request: RenovationRequest): Promise<RenovationResponse> {
        const validated = renovationRequestSchema.parse(request);

        log.info({ scope: validated.scope, quality: validated.quality }, "Estimating renovation cost");

        const response = await fetch(`${this.baseUrl}/renovate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validated),
            signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
            const error = await response.text().catch(() => "Unknown error");
            throw new Error(`Renovation estimation failed: ${response.status} ${error}`);
        }

        const data = await response.json();
        return renovationResponseSchema.parse(data);
    }

    /**
     * Health check for the pricing-model service.
     */
    async healthCheck(): Promise<{ status: string; model_loaded: boolean }> {
        const response = await fetch(`${this.baseUrl}/health`);
        return response.json();
    }
}

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Format a price prediction for display, comparing to listing price.
 */
export function formatPredictionComparison(
    predictedPrice: number,
    listingPrice: number,
    locale: "ja" | "en" = "ja",
): { label: string; percentage: number; isOverpriced: boolean } {
    const diff = ((listingPrice - predictedPrice) / predictedPrice) * 100;
    const rounded = Math.round(Math.abs(diff));

    if (diff > 5) {
        return {
            label: locale === "ja" ? `相場より約${rounded}%高い` : `~${rounded}% above estimate`,
            percentage: diff,
            isOverpriced: true,
        };
    }
    if (diff < -5) {
        return {
            label: locale === "ja" ? `相場より約${rounded}%安い` : `~${rounded}% below estimate`,
            percentage: diff,
            isOverpriced: false,
        };
    }
    return {
        label: locale === "ja" ? "適正価格帯" : "Fair price range",
        percentage: diff,
        isOverpriced: false,
    };
}
