/**
 * @ikigai/ai — AI Orchestration Client
 *
 * TypeScript client for the Python orchestrator service.
 * Handles streaming chat, tool call results, and mediation category tracking.
 */

export { OrchestratorClient } from "./client";
export { classifyMediationCategory, MEDIATION_RULES } from "./mediation";
export type {
    ChatRequest,
    ChatResponse,
    StreamEvent,
    OrchestratorConfig,
} from "./client";
export type { MediationCategory, MediationResult } from "./mediation";
