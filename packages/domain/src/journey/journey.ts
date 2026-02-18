/**
 * Buyer Journey State Management.
 *
 * Defines the stages of the Japanese property purchase journey
 * and valid state transitions.
 */

export const JOURNEY_STAGES = [
    "search",
    "viewing",
    "offer",
    "contract",
    "loan",
    "closing",
] as const;

export type JourneyStage = (typeof JOURNEY_STAGES)[number];

export interface JourneyStageInfo {
    id: JourneyStage;
    order: number;
    label: string;
    labelJa: string;
    description: string;
    descriptionJa: string;
    icon: string;
    estimatedDuration: string;
    estimatedDurationJa: string;
    requiredDocuments: string[];
    requiredDocumentsJa: string[];
}

export const STAGE_INFO: Record<JourneyStage, JourneyStageInfo> = {
    search: {
        id: "search",
        order: 0,
        label: "Property Search",
        labelJa: "物件探し",
        description: "Browse and shortlist properties that match your criteria.",
        descriptionJa: "条件に合う物件を検索し、候補リストを作成します。",
        icon: "search",
        estimatedDuration: "2-4 weeks",
        estimatedDurationJa: "2〜4週間",
        requiredDocuments: [],
        requiredDocumentsJa: [],
    },
    viewing: {
        id: "viewing",
        order: 1,
        label: "Property Viewing",
        labelJa: "内覧",
        description: "Schedule and attend property viewings.",
        descriptionJa: "物件の内覧を予約し、実際に見学します。",
        icon: "eye",
        estimatedDuration: "1-3 weeks",
        estimatedDurationJa: "1〜3週間",
        requiredDocuments: ["ID"],
        requiredDocumentsJa: ["身分証明書"],
    },
    offer: {
        id: "offer",
        order: 2,
        label: "Purchase Offer",
        labelJa: "購入申込み",
        description: "Submit a purchase application (買付証明書).",
        descriptionJa: "購入申込書（買付証明書）を提出します。",
        icon: "file-text",
        estimatedDuration: "1 week",
        estimatedDurationJa: "1週間",
        requiredDocuments: ["Purchase Application", "Proof of Funds"],
        requiredDocumentsJa: ["買付証明書", "資金証明"],
    },
    contract: {
        id: "contract",
        order: 3,
        label: "Contract",
        labelJa: "売買契約",
        description: "Important matters explanation (重要事項説明) and contract signing.",
        descriptionJa: "重要事項説明を受け、売買契約書に署名・捺印します。",
        icon: "file-check",
        estimatedDuration: "1-2 weeks",
        estimatedDurationJa: "1〜2週間",
        requiredDocuments: [
            "Seal Certificate",
            "Seal Registration",
            "Deposit (5-10%)",
        ],
        requiredDocumentsJa: ["印鑑証明書", "実印", "手付金（5〜10%）"],
    },
    loan: {
        id: "loan",
        order: 4,
        label: "Loan Application",
        labelJa: "ローン審査",
        description: "Apply for and process your mortgage loan.",
        descriptionJa: "住宅ローンの本審査を申し込みます。",
        icon: "landmark",
        estimatedDuration: "2-4 weeks",
        estimatedDurationJa: "2〜4週間",
        requiredDocuments: [
            "Income Certificate",
            "Tax Records (3 years)",
            "Employment Certificate",
        ],
        requiredDocumentsJa: ["源泉徴収票", "確定申告書（3年分）", "在職証明書"],
    },
    closing: {
        id: "closing",
        order: 5,
        label: "Closing",
        labelJa: "決済・引き渡し",
        description: "Final payment and key handover.",
        descriptionJa: "残金決済を行い、鍵の引き渡しを受けます。",
        icon: "key",
        estimatedDuration: "1 day",
        estimatedDurationJa: "1日",
        requiredDocuments: ["Final Payment", "All registration documents"],
        requiredDocumentsJa: ["残代金", "登記関係書類一式"],
    },
};

/**
 * Valid stage transitions map.
 */
const VALID_TRANSITIONS: Record<JourneyStage, JourneyStage[]> = {
    search: ["viewing"],
    viewing: ["search", "offer"],
    offer: ["viewing", "contract"],
    contract: ["offer", "loan"],
    loan: ["contract", "closing"],
    closing: [],
};

/**
 * Check if a transition between stages is valid.
 */
export function canTransition(
    from: JourneyStage,
    to: JourneyStage,
): boolean {
    return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Get progress percentage for a stage.
 */
export function getStageProgress(stage: JourneyStage): number {
    const info = STAGE_INFO[stage];
    return Math.round(((info.order + 1) / JOURNEY_STAGES.length) * 100);
}

/**
 * Get stages before and after the current stage.
 */
export function getJourneyContext(currentStage: JourneyStage) {
    const currentOrder = STAGE_INFO[currentStage].order;

    return {
        current: STAGE_INFO[currentStage],
        completed: JOURNEY_STAGES.filter((s) => STAGE_INFO[s].order < currentOrder).map(
            (s) => STAGE_INFO[s],
        ),
        upcoming: JOURNEY_STAGES.filter((s) => STAGE_INFO[s].order > currentOrder).map(
            (s) => STAGE_INFO[s],
        ),
        progress: getStageProgress(currentStage),
    };
}
