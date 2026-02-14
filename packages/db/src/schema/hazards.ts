import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { properties } from "./properties";

export const riskLevelEnum = pgEnum("risk_level", ["none", "low", "moderate", "high", "very_high"]);

export const propertyHazardData = pgTable("property_hazard_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .references(() => properties.id)
    .notNull(),
  floodRisk: riskLevelEnum("flood_risk"),
  landslideRisk: riskLevelEnum("landslide_risk"),
  tsunamiRisk: riskLevelEnum("tsunami_risk"),
  liquefactionRisk: riskLevelEnum("liquefaction_risk"),
  sourceUrl: text("source_url"),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
