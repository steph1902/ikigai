import { z } from "zod";

export const documentTypeSchema = z.enum([
  "registry_transcript",
  "important_matter_explanation",
  "sale_contract",
  "building_inspection",
  "management_rules",
  "mortgage_application",
  "offer_letter",
  "identity_document",
  "other",
]);
export const analysisStatusSchema = z.enum(["pending", "processing", "completed", "failed"]);
export const reviewStatusSchema = z.enum(["draft", "pending_review", "reviewed", "approved"]);

export const documentSchema = z.object({
  id: z.string().uuid(),
  transactionId: z.string().uuid().nullish(),
  userId: z.string().uuid(),
  propertyId: z.string().uuid().nullish(),
  documentType: documentTypeSchema,
  filePath: z.string(),
  fileName: z.string(),
  mimeType: z.string().nullish(),
  analysisStatus: analysisStatusSchema.default("pending"),
  analysisResult: z.record(z.any()).nullish(),
  riskFlags: z.array(z.record(z.any())).nullish(),
  reviewStatus: reviewStatusSchema.default("draft"),
  reviewedBy: z.string().uuid().nullish(),
  reviewedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
