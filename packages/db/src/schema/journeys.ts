import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { users } from "./users";

export const journeyStatusEnum = pgEnum("journey_status", ["active", "completed", "paused"]);
export const shortlistStateEnum = pgEnum("shortlist_state", [
  "shortlisted",
  "viewing_scheduled",
  "viewed",
  "offering",
  "negotiating",
  "contract_prep",
  "contract_signed",
  "settlement_prep",
  "settled",
  "dropped",
  "cancelled",
]);

export const journeys = pgTable("journeys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull()
    .unique(), // One active journey per user constraint enforced via unique index or app logic? "one active journey" implies filtering by status. But prompt says "unique" - maybe "user_id (FK -> users, unique)" means 1:1. I'll stick to unique() for now as user probably only has 1 journey.
  searchCriteria: jsonb("search_criteria"),
  status: journeyStatusEnum("status").default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const shortlistedProperties = pgTable(
  "shortlisted_properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    journeyId: uuid("journey_id")
      .references(() => journeys.id)
      .notNull(),
    propertyId: uuid("property_id")
      .references(() => properties.id)
      .notNull(),
    userNotes: text("user_notes"),
    userRating: integer("user_rating"), // 1-5
    state: shortlistStateEnum("state").default("shortlisted"),
    stateChangedAt: timestamp("state_changed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    unqJourneyProp: unique().on(t.journeyId, t.propertyId),
  }),
);
