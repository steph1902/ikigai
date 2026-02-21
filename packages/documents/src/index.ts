/**
 * @ikigai/documents — Document Intelligence Client
 *
 * TypeScript client for the document-ocr service.
 * Handles document upload, analysis result retrieval, and risk flag interpretation.
 *
 * Supported document types (Japanese real estate):
 * - 登記簿謄本 (Registry Transcript)
 * - 重要事項説明書 (Important Matter Explanation)
 * - 売買契約書 (Sale Contract)
 * - 建物状況調査 (Building Inspection Report)
 * - 管理規約 (Management Rules)
 */

import { z } from "zod";
import { createServiceLogger } from "@ikigai/logger";

const log = createServiceLogger("documents");

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const documentTypeSchema = z.enum([
    "registry_transcript",
    "important_matter_explanation",
    "sale_contract",
    "building_inspection",
    "management_rules",
    "other",
]);
export type DocumentType = z.infer<typeof documentTypeSchema>;

export const riskSeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export type RiskSeverity = z.infer<typeof riskSeveritySchema>;

export const riskFlagSchema = z.object({
    severity: riskSeveritySchema,
    category: z.string(),
    description_ja: z.string(),
    description_en: z.string(),
    action: z.string(),
});
export type RiskFlag = z.infer<typeof riskFlagSchema>;

export const analysisResultSchema = z.object({
    filename: z.string(),
    document_type: documentTypeSchema,
    text_content: z.string(),
    page_count: z.number(),
    risk_flags: z.array(riskFlagSchema),
    key_facts: z.record(z.boolean()),
    status: z.string(),
});
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

// ─── Client ──────────────────────────────────────────────────────────────────

export interface DocumentClientConfig {
    baseUrl: string;
    timeout?: number;
}

/**
 * TypeScript client for the document-ocr FastAPI service.
 */
export class DocumentClient {
    private baseUrl: string;
    private timeout: number;

    constructor(config: DocumentClientConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.timeout = config.timeout ?? 30000;
    }

    /**
     * Upload and analyze a PDF document.
     */
    async analyze(file: File | Blob, filename: string): Promise<AnalysisResult> {
        log.info({ filename }, "Uploading document for analysis");

        const formData = new FormData();
        formData.append("file", file, filename);

        const response = await fetch(`${this.baseUrl}/analyze`, {
            method: "POST",
            body: formData,
            signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
            const error = await response.text().catch(() => "Unknown error");
            log.error({ status: response.status, error }, "Document analysis failed");
            throw new Error(`Document analysis failed: ${response.status} ${error}`);
        }

        const data = await response.json();
        const result = analysisResultSchema.parse(data);

        log.info(
            {
                filename,
                type: result.document_type,
                riskCount: result.risk_flags.length,
                pages: result.page_count,
            },
            "Document analysis complete",
        );

        return result;
    }

    /**
     * Health check for the document-ocr service.
     */
    async healthCheck(): Promise<{ status: string }> {
        const response = await fetch(`${this.baseUrl}/health`);
        return response.json();
    }
}

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Get the Japanese name for a document type.
 */
export function getDocumentTypeLabel(type: DocumentType, locale: "ja" | "en" = "ja"): string {
    const labels: Record<DocumentType, { ja: string; en: string }> = {
        registry_transcript: { ja: "登記簿謄本", en: "Registry Transcript" },
        important_matter_explanation: { ja: "重要事項説明書", en: "Important Matter Statement" },
        sale_contract: { ja: "売買契約書", en: "Sale Contract" },
        building_inspection: { ja: "建物状況調査報告書", en: "Building Inspection Report" },
        management_rules: { ja: "管理規約", en: "Management Rules" },
        other: { ja: "その他", en: "Other" },
    };
    return labels[type]?.[locale] ?? type;
}

/**
 * Get severity label with appropriate urgency.
 */
export function getRiskSeverityLabel(severity: RiskSeverity, locale: "ja" | "en" = "ja"): string {
    const labels: Record<RiskSeverity, { ja: string; en: string }> = {
        low: { ja: "低", en: "Low" },
        medium: { ja: "中", en: "Medium" },
        high: { ja: "高", en: "High" },
        critical: { ja: "重大", en: "Critical" },
    };
    return labels[severity]?.[locale] ?? severity;
}

/**
 * Filter risk flags by minimum severity.
 */
export function filterRisksBySeverity(
    flags: RiskFlag[],
    minSeverity: RiskSeverity,
): RiskFlag[] {
    const severityOrder: RiskSeverity[] = ["low", "medium", "high", "critical"];
    const minIndex = severityOrder.indexOf(minSeverity);
    return flags.filter(
        (flag) => severityOrder.indexOf(flag.severity) >= minIndex,
    );
}
