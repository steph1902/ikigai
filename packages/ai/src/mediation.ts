/**
 * Mediation Boundary Detection.
 *
 * Classifies user intents into Category A/B/C per FSD Section 4.3.
 * This is a CRITICAL safety feature — Category C intents MUST be escalated
 * to a licensed professional (宅建士) under the Takken Act (宅地建物取引業法).
 *
 * Categories:
 * - A (Information): AI handles autonomously — property search, market info, general Q&A
 * - B (Logistics): AI handles with user approval — viewing scheduling, document requests
 * - C (Legal/Negotiation): MUST escalate — price negotiation, contract interpretation, legal advice
 */

export type MediationCategory = "A" | "B" | "C";

export interface MediationResult {
    category: MediationCategory;
    confidence: number;
    reason: string;
    requiresEscalation: boolean;
    escalationMessage?: string;
}

/**
 * Keyword-based rules for mediation classification.
 * In production, this is handled by the LLM in the orchestrator.
 * This client-side version provides fast pre-screening and UI hints.
 */
export const MEDIATION_RULES = {
    /**
     * Category C keywords — these MUST trigger escalation.
     * Any match = immediate escalation to licensed professional.
     */
    categoryC: {
        ja: [
            "値下げ", "値引き", "価格交渉", "ネゴ",
            "契約書", "契約内容", "条項", "約款",
            "重要事項説明", "重説",
            "法的", "法律", "訴訟", "紛争",
            "手付金", "違約金", "損害賠償",
            "瑕疵", "契約不適合", "告知義務",
            "仲介手数料", "報酬",
        ],
        en: [
            "negotiate", "negotiation", "bargain", "discount",
            "contract", "clause", "terms", "agreement",
            "legal", "lawsuit", "dispute",
            "deposit", "penalty", "damages",
            "defect", "liability", "disclosure",
            "commission",
        ],
    },

    /**
     * Category B keywords — require user confirmation before acting.
     */
    categoryB: {
        ja: [
            "内見", "見学", "予約", "アポ",
            "申し込み", "申込", "エントリー",
            "審査", "ローン申請",
            "書類", "提出",
        ],
        en: [
            "viewing", "visit", "schedule", "appointment",
            "apply", "application", "entry",
            "loan", "mortgage",
            "submit", "document",
        ],
    },
} as const;

/**
 * Classify a user message into mediation category.
 * This is a fast client-side pre-screening. The orchestrator performs
 * the authoritative classification using the LLM.
 */
export function classifyMediationCategory(
    message: string,
    locale: "ja" | "en" = "ja",
): MediationResult {
    const lowerMessage = message.toLowerCase();

    // Check Category C first (highest priority)
    for (const keyword of MEDIATION_RULES.categoryC[locale]) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
            return {
                category: "C",
                confidence: 0.85,
                reason: `Contains regulated keyword: "${keyword}"`,
                requiresEscalation: true,
                escalationMessage:
                    locale === "ja"
                        ? "この内容は宅地建物取引士の確認が必要です。専門スタッフにおつなぎします。"
                        : "This topic requires review by a licensed real estate professional. Connecting you now.",
            };
        }
    }

    // Check Category B
    for (const keyword of MEDIATION_RULES.categoryB[locale]) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
            return {
                category: "B",
                confidence: 0.8,
                reason: `Contains action keyword: "${keyword}"`,
                requiresEscalation: false,
            };
        }
    }

    // Default: Category A (information)
    return {
        category: "A",
        confidence: 0.9,
        reason: "General information request",
        requiresEscalation: false,
    };
}
