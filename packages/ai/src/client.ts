import { createServiceLogger } from "@ikigai/logger";

const log = createServiceLogger("ai-client");

/**
 * Configuration for the orchestrator client.
 */
export interface OrchestratorConfig {
    baseUrl: string;
    timeout?: number;
}

/**
 * Chat request to the orchestrator service.
 */
export interface ChatRequest {
    userId: string;
    message: string;
    conversationId?: string;
    channel: "web" | "mobile" | "line" | "voice";
    locale?: "ja" | "en";
}

/**
 * Response from the orchestrator service.
 */
export interface ChatResponse {
    response: string;
    conversationId: string;
    mediationCategory: "A" | "B" | "C";
    toolCalls?: ToolCallResult[];
    actionRequests?: ActionRequest[];
}

export interface ToolCallResult {
    tool: string;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
}

export interface ActionRequest {
    id: string;
    action: string;
    description: string;
    permissionLevel: "autonomous" | "user_approval" | "professional_required";
    status: "pending" | "approved" | "denied";
}

/**
 * Server-Sent Event from the streaming endpoint.
 */
export interface StreamEvent {
    type: "text" | "tool_call" | "tool_result" | "action_request" | "done";
    data: unknown;
}

/**
 * TypeScript client for the Python LangGraph orchestrator.
 *
 * Supports:
 * - Single-shot chat (POST /chat)
 * - Streaming chat (POST /chat/stream) via SSE
 * - Health check (GET /health)
 */
export class OrchestratorClient {
    private baseUrl: string;
    private timeout: number;

    constructor(config: OrchestratorConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.timeout = config.timeout ?? 30000;
    }

    /**
     * Send a chat message and receive a complete response.
     */
    async chat(request: ChatRequest): Promise<ChatResponse> {
        log.info(
            { userId: request.userId, channel: request.channel },
            "Sending chat request to orchestrator",
        );

        const response = await fetch(`${this.baseUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: request.userId,
                message: request.message,
                conversation_id: request.conversationId,
                channel: request.channel,
                locale: request.locale ?? "ja",
            }),
            signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            log.error({ status: response.status, error: errorText }, "Orchestrator request failed");
            throw new OrchestratorError(
                `Orchestrator returned ${response.status}: ${errorText}`,
                response.status,
            );
        }

        const data = await response.json();
        log.info(
            { conversationId: data.conversation_id, category: data.mediation_category },
            "Chat response received",
        );

        return {
            response: data.response,
            conversationId: data.conversation_id,
            mediationCategory: data.mediation_category ?? "A",
            toolCalls: data.tool_calls,
            actionRequests: data.action_requests,
        };
    }

    /**
     * Stream a chat response via Server-Sent Events.
     * Returns an async iterator of StreamEvents.
     */
    async *chatStream(request: ChatRequest): AsyncGenerator<StreamEvent> {
        const response = await fetch(`${this.baseUrl}/chat/stream`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/event-stream",
            },
            body: JSON.stringify({
                user_id: request.userId,
                message: request.message,
                conversation_id: request.conversationId,
                channel: request.channel,
                locale: request.locale ?? "ja",
            }),
        });

        if (!response.ok || !response.body) {
            throw new OrchestratorError(
                `Stream request failed: ${response.status}`,
                response.status,
            );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const jsonStr = line.slice(6);
                        if (jsonStr === "[DONE]") {
                            yield { type: "done", data: null };
                            return;
                        }
                        try {
                            const event = JSON.parse(jsonStr) as StreamEvent;
                            yield event;
                        } catch {
                            // Skip malformed events
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    /**
     * Check orchestrator health.
     */
    async healthCheck(): Promise<{ status: string }> {
        const response = await fetch(`${this.baseUrl}/health`);
        return response.json();
    }
}

/**
 * Custom error for orchestrator failures.
 */
export class OrchestratorError extends Error {
    constructor(
        message: string,
        public statusCode: number,
    ) {
        super(message);
        this.name = "OrchestratorError";
    }
}
