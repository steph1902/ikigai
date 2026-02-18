import { bigint, date, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { journeys, shortlistedProperties } from "./journeys";
import { properties } from "./properties";
import { users } from "./users";

export const mortgageStatusEnum = pgEnum("mortgage_status", [
  "not_started",
  "preapproval_submitted",
  "preapproved",
  "formal_submitted",
  "approved",
  "declined",
  "not_needed",
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "active",
  "completed",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", ["cash", "mortgage"]);
export const feftaStatusEnum = pgEnum("fefta_status", [
  "not_required",
  "review_pending",
  "approved",
  "submitted",
]);

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  shortlistedPropertyId: uuid("shortlisted_property_id")
    .references(() => shortlistedProperties.id)
    .notNull()
    .unique(),
  journeyId: uuid("journey_id")
    .references(() => journeys.id)
    .notNull(),
  propertyId: uuid("property_id")
    .references(() => properties.id)
    .notNull(),
  offerPrice: bigint("offer_price", { mode: "number" }),
  agreedPrice: bigint("agreed_price", { mode: "number" }),
  earnestMoney: bigint("earnest_money", { mode: "number" }),
  settlementDate: date("settlement_date"),
  paymentMethod: paymentMethodEnum("payment_method").default("mortgage"),
  feftaStatus: feftaStatusEnum("fefta_status").default("not_required"),
  mortgageStatus: mortgageStatusEnum("mortgage_status").default("not_started"),
  mortgageInstitution: text("mortgage_institution"),
  mortgageAmount: bigint("mortgage_amount", { mode: "number" }),
  assignedAgentId: uuid("assigned_agent_id").references(() => users.id),
  assignedScrivener: text("assigned_scrivener"),
  status: transactionStatusEnum("status").default("active"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
