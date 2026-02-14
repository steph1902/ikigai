import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { transactions } from "./transactions";
import { users } from "./users";

export const documentTypeEnum = pgEnum("document_type", [
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
export const analysisStatusEnum = pgEnum("analysis_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);
export const reviewStatusEnum = pgEnum("review_status", [
  "draft",
  "pending_review",
  "reviewed",
  "approved",
]);

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionId: uuid("transaction_id").references(() => transactions.id),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  propertyId: uuid("property_id").references(() => properties.id),
  documentType: documentTypeEnum("document_type").notNull(),
  filePath: text("file_path").notNull(), // S3 key
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type"),
  analysisStatus: analysisStatusEnum("analysis_status").default("pending"),
  analysisResult: jsonb("analysis_result"),
  riskFlags: jsonb("risk_flags"),
  reviewStatus: reviewStatusEnum("review_status").default("draft"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
