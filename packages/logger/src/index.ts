import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Root logger instance for the IKIGAI platform.
 * Uses structured JSON output in production, pino-pretty in development.
 * All logs include ISO timestamps and string-level labels.
 */
const baseConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Redact PII fields — never log personal data
  redact: {
    paths: ["email", "phone", "*.email", "*.phone", "password", "*.password"],
    censor: "[REDACTED]",
  },
};

if (isDev) {
  baseConfig.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss.l",
      ignore: "pid,hostname",
    },
  };
}

export const logger = pino(baseConfig);

/**
 * Create a child logger bound to a specific service context.
 * Each service (orchestrator, pricing-model, etc.) gets its own logger
 * with the service name automatically attached to every log line.
 *
 * @example
 * ```ts
 * const log = createServiceLogger("orchestrator");
 * log.info({ event: "chat_started" }, "New conversation initiated");
 * ```
 */
export function createServiceLogger(service: string) {
  return logger.child({ service });
}

/**
 * Create a child logger for a specific request context.
 * Attaches requestId, userId, and other per-request metadata.
 */
export function createRequestLogger(context: {
  requestId: string;
  userId?: string;
  channel?: string;
}) {
  return logger.child({
    requestId: context.requestId,
    userId: context.userId,
    channel: context.channel,
  });
}

/**
 * Log an LLM API call with cost tracking metadata.
 * Per Section 7, Rule 9: every LLM call must log model, tokens, latency, and cost.
 */
export function logLLMCall(
  log: pino.Logger,
  data: {
    model: string;
    promptTokens: number;
    completionTokens: number;
    latencyMs: number;
    toolCalls?: string[];
    conversationId?: string;
  },
) {
  const costPer1kInput = data.model.includes("opus") ? 0.015 : 0.003;
  const costPer1kOutput = data.model.includes("opus") ? 0.075 : 0.015;
  const estimatedCost =
    (data.promptTokens / 1000) * costPer1kInput +
    (data.completionTokens / 1000) * costPer1kOutput;

  log.info(
    {
      event: "llm_call",
      model: data.model,
      promptTokens: data.promptTokens,
      completionTokens: data.completionTokens,
      totalTokens: data.promptTokens + data.completionTokens,
      latencyMs: data.latencyMs,
      estimatedCostUsd: Math.round(estimatedCost * 10000) / 10000,
      toolCalls: data.toolCalls,
      conversationId: data.conversationId,
    },
    `LLM call: ${data.model} (${data.promptTokens + data.completionTokens} tokens, ${data.latencyMs}ms)`,
  );
}

export type Logger = pino.Logger;
