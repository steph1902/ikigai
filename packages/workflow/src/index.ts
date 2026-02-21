/**
 * @ikigai/workflow — Purchase Journey State Machine (XState v5)
 *
 * Models the entire Japanese property purchase workflow as a finite state machine.
 * Stages follow the legal transaction flow under the 宅地建物取引業法 (Takken Act).
 *
 * Stages:
 * 1. exploring     — 情報収集   — Browsing, learning about the market
 * 2. searching     — 物件検索   — Actively searching with criteria
 * 3. evaluating    — 物件検討   — Shortlisting, viewings, price predictions
 * 4. negotiating   — 交渉中     — Price/condition negotiation (Category C — 宅建士 required)
 * 5. contracting   — 契約手続   — 重要事項説明, contract signing
 * 6. closing       — 引渡準備   — Loan finalization, settlement preparation
 * 7. post_purchase — 購入完了   — Post-settlement, moving, registration
 */

import { setup, assign, createActor } from "xstate";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface JourneyContext {
    userId: string;
    journeyId: string;
    shortlistedProperties: string[];
    activePropertyId: string | null;
    viewingsScheduled: string[];
    viewingsCompleted: string[];
    offerSubmitted: boolean;
    offerAccepted: boolean;
    contractSigned: boolean;
    loanApproved: boolean;
    settlementDate: string | null;
    escalatedToAgent: boolean;
    locale: "ja" | "en";
}

export type JourneyEvent =
    | { type: "START_SEARCHING"; criteria?: Record<string, unknown> }
    | { type: "SHORTLIST_PROPERTY"; propertyId: string }
    | { type: "REMOVE_FROM_SHORTLIST"; propertyId: string }
    | { type: "SCHEDULE_VIEWING"; propertyId: string }
    | { type: "COMPLETE_VIEWING"; propertyId: string }
    | { type: "START_EVALUATION" }
    | { type: "REQUEST_PRICE_PREDICTION"; propertyId: string }
    | { type: "START_NEGOTIATION"; propertyId: string }
    | { type: "SUBMIT_OFFER"; propertyId: string; amount: number }
    | { type: "OFFER_ACCEPTED" }
    | { type: "OFFER_REJECTED" }
    | { type: "SIGN_CONTRACT" }
    | { type: "LOAN_APPROVED" }
    | { type: "LOAN_REJECTED" }
    | { type: "SET_SETTLEMENT_DATE"; date: string }
    | { type: "SETTLEMENT_COMPLETE" }
    | { type: "ESCALATE_TO_AGENT" }
    | { type: "BACK_TO_SEARCHING" };

// ─── State Machine Definition ────────────────────────────────────────────────

export const journeyMachine = setup({
    types: {
        context: {} as JourneyContext,
        events: {} as JourneyEvent,
    },
    guards: {
        hasShortlistedProperties: ({ context }) =>
            context.shortlistedProperties.length > 0,
        hasCompletedViewings: ({ context }) =>
            context.viewingsCompleted.length > 0,
        isOfferAccepted: ({ context }) =>
            context.offerAccepted,
        isLoanApproved: ({ context }) =>
            context.loanApproved,
    },
}).createMachine({
    id: "purchaseJourney",
    initial: "exploring",
    context: ({ input }: { input: { userId: string; journeyId: string; locale?: "ja" | "en" } }) => ({
        userId: input.userId,
        journeyId: input.journeyId,
        shortlistedProperties: [],
        activePropertyId: null,
        viewingsScheduled: [],
        viewingsCompleted: [],
        offerSubmitted: false,
        offerAccepted: false,
        contractSigned: false,
        loanApproved: false,
        settlementDate: null,
        escalatedToAgent: false,
        locale: input.locale ?? "ja",
    }),
    states: {
        exploring: {
            meta: { labelJa: "情報収集", labelEn: "Exploring" },
            on: {
                START_SEARCHING: { target: "searching" },
                SHORTLIST_PROPERTY: {
                    actions: assign({
                        shortlistedProperties: ({ context, event }) => [
                            ...context.shortlistedProperties,
                            event.propertyId,
                        ],
                    }),
                },
            },
        },

        searching: {
            meta: { labelJa: "物件検索", labelEn: "Searching" },
            on: {
                SHORTLIST_PROPERTY: {
                    actions: assign({
                        shortlistedProperties: ({ context, event }) => [
                            ...context.shortlistedProperties,
                            event.propertyId,
                        ],
                    }),
                },
                REMOVE_FROM_SHORTLIST: {
                    actions: assign({
                        shortlistedProperties: ({ context, event }) =>
                            context.shortlistedProperties.filter((id) => id !== event.propertyId),
                    }),
                },
                SCHEDULE_VIEWING: {
                    actions: assign({
                        viewingsScheduled: ({ context, event }) => [
                            ...context.viewingsScheduled,
                            event.propertyId,
                        ],
                    }),
                },
                START_EVALUATION: {
                    target: "evaluating",
                    guard: "hasShortlistedProperties",
                },
            },
        },

        evaluating: {
            meta: { labelJa: "物件検討", labelEn: "Evaluating" },
            on: {
                COMPLETE_VIEWING: {
                    actions: assign({
                        viewingsCompleted: ({ context, event }) => [
                            ...context.viewingsCompleted,
                            event.propertyId,
                        ],
                    }),
                },
                START_NEGOTIATION: {
                    target: "negotiating",
                    guard: "hasCompletedViewings",
                    actions: assign({
                        activePropertyId: ({ event }) => event.propertyId,
                        escalatedToAgent: () => true, // Category C — must involve 宅建士
                    }),
                },
                BACK_TO_SEARCHING: { target: "searching" },
            },
        },

        negotiating: {
            meta: {
                labelJa: "交渉中",
                labelEn: "Negotiating",
                requiresProfessional: true, // 🔴 Category C — 宅建士 required
            },
            on: {
                SUBMIT_OFFER: {
                    actions: assign({
                        offerSubmitted: () => true,
                    }),
                },
                OFFER_ACCEPTED: {
                    target: "contracting",
                    actions: assign({
                        offerAccepted: () => true,
                    }),
                },
                OFFER_REJECTED: {
                    // Stay in negotiating — can re-offer
                    actions: assign({
                        offerSubmitted: () => false,
                    }),
                },
                BACK_TO_SEARCHING: { target: "searching" },
            },
        },

        contracting: {
            meta: {
                labelJa: "契約手続",
                labelEn: "Contracting",
                requiresProfessional: true, // 重要事項説明 must be done by 宅建士
            },
            on: {
                SIGN_CONTRACT: {
                    target: "closing",
                    actions: assign({
                        contractSigned: () => true,
                    }),
                },
            },
        },

        closing: {
            meta: { labelJa: "引渡準備", labelEn: "Closing" },
            on: {
                LOAN_APPROVED: {
                    actions: assign({
                        loanApproved: () => true,
                    }),
                },
                SET_SETTLEMENT_DATE: {
                    actions: assign({
                        settlementDate: ({ event }) => event.date,
                    }),
                },
                SETTLEMENT_COMPLETE: {
                    target: "post_purchase",
                },
            },
        },

        post_purchase: {
            meta: { labelJa: "購入完了", labelEn: "Complete" },
            type: "final",
        },
    },
});

// ─── Factory Function ────────────────────────────────────────────────────────

/**
 * Create a new purchase journey actor.
 *
 * @example
 * ```ts
 * const journey = createJourney({ userId: "usr_001", journeyId: "jrn_001" });
 * journey.start();
 * journey.send({ type: "START_SEARCHING" });
 * journey.send({ type: "SHORTLIST_PROPERTY", propertyId: "prop_001" });
 * console.log(journey.getSnapshot().value); // "searching"
 * ```
 */
export function createJourney(input: {
    userId: string;
    journeyId: string;
    locale?: "ja" | "en";
}) {
    return createActor(journeyMachine, { input });
}

/**
 * Get the Japanese label for a journey stage.
 */
export function getStageLabel(
    stage: string,
    locale: "ja" | "en" = "ja",
): string {
    const labels: Record<string, { ja: string; en: string }> = {
        exploring: { ja: "情報収集", en: "Exploring" },
        searching: { ja: "物件検索", en: "Searching" },
        evaluating: { ja: "物件検討", en: "Evaluating" },
        negotiating: { ja: "交渉中", en: "Negotiating" },
        contracting: { ja: "契約手続", en: "Contracting" },
        closing: { ja: "引渡準備", en: "Closing" },
        post_purchase: { ja: "購入完了", en: "Complete" },
    };
    return labels[stage]?.[locale] ?? stage;
}
