/**
 * @ikigai/actions — LAM Action Engine
 *
 * Manages the execution of AI-proposed actions with proper permission gating.
 * Implements the three-tier permission model from FSD Section 3.2:
 *
 * 1. AUTONOMOUS — AI executes without asking (search, data retrieval)
 * 2. USER_APPROVAL — Requires explicit user confirmation (schedule viewing, submit offer)
 * 3. PROFESSIONAL_REQUIRED — Must be reviewed by 宅建士 (contract, legal interpretation)
 */

import { z } from "zod";
import { createServiceLogger } from "@ikigai/logger";

const log = createServiceLogger("action-engine");

// ─── Action Schemas ──────────────────────────────────────────────────────────

export const actionRequestSchema = z.object({
    id: z.string().uuid(),
    type: z.string(),
    description: z.string(),
    descriptionJa: z.string(),
    params: z.record(z.unknown()),
    permissionLevel: z.enum(["autonomous", "user_approval", "professional_required"]),
    status: z.enum(["pending", "approved", "denied", "executed", "failed"]),
    createdAt: z.date(),
    resolvedAt: z.date().optional(),
    resolvedBy: z.string().optional(),
});

export type ActionRequest = z.infer<typeof actionRequestSchema>;

export const actionResultSchema = z.object({
    actionId: z.string().uuid(),
    success: z.boolean(),
    result: z.unknown().optional(),
    error: z.string().optional(),
    executedAt: z.date(),
});

export type ActionResult = z.infer<typeof actionResultSchema>;

// ─── Action Registry ─────────────────────────────────────────────────────────

/**
 * Registered action types with their permission levels.
 * This is the master registry of all actions the AI can propose.
 */
export const ACTION_REGISTRY: Record<
    string,
    { permissionLevel: ActionRequest["permissionLevel"]; descriptionJa: string; descriptionEn: string }
> = {
    // Category A — Autonomous
    "property.search": {
        permissionLevel: "autonomous",
        descriptionJa: "物件を検索します",
        descriptionEn: "Search for properties",
    },
    "property.detail": {
        permissionLevel: "autonomous",
        descriptionJa: "物件の詳細情報を取得します",
        descriptionEn: "Get property details",
    },
    "pricing.predict": {
        permissionLevel: "autonomous",
        descriptionJa: "AI価格推定を実行します",
        descriptionEn: "Run AI price prediction",
    },
    "document.analyze": {
        permissionLevel: "autonomous",
        descriptionJa: "書類を分析します",
        descriptionEn: "Analyze document",
    },
    "market.trends": {
        permissionLevel: "autonomous",
        descriptionJa: "市場動向を取得します",
        descriptionEn: "Fetch market trends",
    },

    // Category B — User Approval Required
    "viewing.schedule": {
        permissionLevel: "user_approval",
        descriptionJa: "内見を予約します",
        descriptionEn: "Schedule a property viewing",
    },
    "offer.submit": {
        permissionLevel: "user_approval",
        descriptionJa: "購入申込書を提出します",
        descriptionEn: "Submit a purchase offer",
    },
    "loan.preapproval": {
        permissionLevel: "user_approval",
        descriptionJa: "住宅ローン事前審査を申請します",
        descriptionEn: "Apply for mortgage pre-approval",
    },
    "journey.advance": {
        permissionLevel: "user_approval",
        descriptionJa: "購入ステージを進めます",
        descriptionEn: "Advance purchase journey stage",
    },

    // Category C — Professional Required
    "contract.review": {
        permissionLevel: "professional_required",
        descriptionJa: "契約書の確認が必要です（宅建士対応）",
        descriptionEn: "Contract review required (licensed professional)",
    },
    "negotiation.price": {
        permissionLevel: "professional_required",
        descriptionJa: "価格交渉には宅建士の関与が必要です",
        descriptionEn: "Price negotiation requires licensed professional",
    },
    "legal.interpretation": {
        permissionLevel: "professional_required",
        descriptionJa: "法的解釈には宅建士の確認が必要です",
        descriptionEn: "Legal interpretation requires licensed professional",
    },
} as const;

// ─── Action Engine ───────────────────────────────────────────────────────────

/**
 * Create an action request from the AI's proposed action.
 */
export function createActionRequest(
    type: string,
    params: Record<string, unknown>,
): ActionRequest {
    const registration = ACTION_REGISTRY[type];
    if (!registration) {
        throw new Error(`Unknown action type: ${type}`);
    }

    const action: ActionRequest = {
        id: crypto.randomUUID(),
        type,
        description: registration.descriptionEn,
        descriptionJa: registration.descriptionJa,
        params,
        permissionLevel: registration.permissionLevel,
        status: registration.permissionLevel === "autonomous" ? "approved" : "pending",
        createdAt: new Date(),
    };

    log.info(
        { actionId: action.id, type: action.type, permission: action.permissionLevel },
        `Action created: ${action.type}`,
    );

    return action;
}

/**
 * Approve a pending action (user or professional).
 */
export function approveAction(
    action: ActionRequest,
    approvedBy: string,
): ActionRequest {
    if (action.status !== "pending") {
        throw new Error(`Cannot approve action in status: ${action.status}`);
    }

    const approved = {
        ...action,
        status: "approved" as const,
        resolvedAt: new Date(),
        resolvedBy: approvedBy,
    };

    log.info(
        { actionId: action.id, approvedBy },
        `Action approved: ${action.type}`,
    );

    return approved;
}

/**
 * Deny a pending action.
 */
export function denyAction(
    action: ActionRequest,
    deniedBy: string,
): ActionRequest {
    const denied = {
        ...action,
        status: "denied" as const,
        resolvedAt: new Date(),
        resolvedBy: deniedBy,
    };

    log.info(
        { actionId: action.id, deniedBy },
        `Action denied: ${action.type}`,
    );

    return denied;
}

/**
 * Check if an action can be auto-executed (autonomous permission level).
 */
export function canAutoExecute(action: ActionRequest): boolean {
    return action.permissionLevel === "autonomous";
}

/**
 * Check if an action requires professional review.
 */
export function requiresProfessional(action: ActionRequest): boolean {
    return action.permissionLevel === "professional_required";
}
