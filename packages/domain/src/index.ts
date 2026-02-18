export { calculateBrokerageFee, calculatePurchaseCosts } from "./rules/fees";
export { assessPropertyRisk } from "./rules/risk";
export type { RiskAssessment, RiskFactor, RiskLevel } from "./rules/risk";
export { calculateAffordability, calculateMonthlyPayment } from "./rules/budget";
export type { AffordabilityResult } from "./rules/budget";
export {
    JOURNEY_STAGES,
    STAGE_INFO,
    canTransition,
    getStageProgress,
    getJourneyContext,
} from "./journey/journey";
export type { JourneyStage, JourneyStageInfo } from "./journey/journey";
