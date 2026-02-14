import { bigint, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { properties } from "./properties";

export const propertyPricePredictions = pgTable("property_price_predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .references(() => properties.id)
    .notNull(),
  modelVersion: text("model_version"),
  predictedPrice: bigint("predicted_price", { mode: "number" }),
  confidenceLower: bigint("confidence_lower", { mode: "number" }),
  confidenceUpper: bigint("confidence_upper", { mode: "number" }),
  mapeAtPredictionTime: numeric("mape_at_prediction_time", { precision: 5, scale: 2 }),
  topPositiveFactors: jsonb("top_positive_factors"),
  topNegativeFactors: jsonb("top_negative_factors"),
  explanationTextJa: text("explanation_text_ja"),
  explanationTextEn: text("explanation_text_en"),
  predictedAt: timestamp("predicted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
