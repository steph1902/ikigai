/**
 * @ikigai/vr — VR/3D Client
 *
 * TypeScript client for the vr-engine service.
 * Handles floor plan → 3D model generation and WebXR viewer integration.
 *
 * Pipeline:
 * 1. Upload 2D floor plan image
 * 2. vr-engine detects walls/windows/doors via CV
 * 3. Generates GLTF 3D model
 * 4. Returns URL for embedding in React Three Fiber / WebXR viewer
 */

import { z } from "zod";
import { createServiceLogger } from "@ikigai/logger";

const log = createServiceLogger("vr");

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const floorPlanRequestSchema = z.object({
    image_url: z.string().url(),
    property_id: z.string(),
});
export type FloorPlanRequest = z.infer<typeof floorPlanRequestSchema>;

export const modelResponseSchema = z.object({
    model_url: z.string().url(),
    format: z.enum(["gltf", "glb", "usdz"]).default("gltf"),
    status: z.enum(["completed", "processing", "failed"]),
});
export type ModelResponse = z.infer<typeof modelResponseSchema>;

// ─── Client ──────────────────────────────────────────────────────────────────

export interface VRClientConfig {
    baseUrl: string;
    timeout?: number;
}

/**
 * TypeScript client for the vr-engine FastAPI service.
 */
export class VRClient {
    private baseUrl: string;
    private timeout: number;

    constructor(config: VRClientConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.timeout = config.timeout ?? 60000; // 3D generation can take a while
    }

    /**
     * Generate a 3D model from a 2D floor plan image.
     *
     * @param imageUrl - URL to the floor plan image
     * @param propertyId - Property ID for tracking
     * @returns ModelResponse with GLTF model URL
     */
    async generateModel(imageUrl: string, propertyId: string): Promise<ModelResponse> {
        log.info({ propertyId }, "Requesting 3D model generation");

        const response = await fetch(`${this.baseUrl}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_url: imageUrl, property_id: propertyId }),
            signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
            const error = await response.text().catch(() => "Unknown error");
            log.error({ status: response.status, error }, "3D generation failed");
            throw new Error(`VR generation failed: ${response.status} ${error}`);
        }

        const data = await response.json();
        const result = modelResponseSchema.parse(data);

        log.info(
            { propertyId, format: result.format, status: result.status },
            "3D model generation complete",
        );

        return result;
    }

    /**
     * Health check for the vr-engine service.
     */
    async healthCheck(): Promise<{ status: string }> {
        const response = await fetch(`${this.baseUrl}/health`);
        return response.json();
    }
}

// ─── WebXR Viewer Configuration ──────────────────────────────────────────────

/**
 * Configuration for the React Three Fiber / WebXR viewer.
 * Used by the frontend to render 3D property models.
 */
export interface ViewerConfig {
    /** URL to the GLTF model */
    modelUrl: string;
    /** Enable WebXR AR mode (for mobile) */
    enableAR: boolean;
    /** Enable WebXR VR mode (for headsets) */
    enableVR: boolean;
    /** Background color */
    backgroundColor: string;
    /** Camera settings */
    camera: {
        position: [number, number, number];
        fov: number;
    };
    /** Lighting preset */
    lighting: "studio" | "outdoor" | "evening";
}

/**
 * Get default viewer configuration for a property.
 */
export function getDefaultViewerConfig(modelUrl: string): ViewerConfig {
    return {
        modelUrl,
        enableAR: true,
        enableVR: false,
        backgroundColor: "#FAFAFA",
        camera: {
            position: [5, 5, 5],
            fov: 50,
        },
        lighting: "studio",
    };
}
