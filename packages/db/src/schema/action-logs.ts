import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { transactions } from "./transactions";
import { users } from "./users";

export const permissionLevelEnum = pgEnum("permission_level", [
  "autonomous",
  "user_approval",
  "professional_required",
]);
export const executionStatusEnum = pgEnum("execution_status", [
  "pending_approval",
  "executing",
  "completed",
  "failed",
  "cancelled",
]);

export const actionLogs = pgTable("action_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  transactionId: uuid("transaction_id").references(() => transactions.id),
  actionName: text("action_name").notNull(),
  actionInputs: jsonb("action_inputs"),
  actionOutputs: jsonb("action_outputs"),
  permissionLevel: permissionLevelEnum("permission_level").notNull(),
  approvalRecord: jsonb("approval_record"),
  executionStatus: executionStatusEnum("execution_status").default("pending_approval"),
  errorDetail: text("error_detail"),
  executedAt: timestamp("executed_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
