import { boolean, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["buyer", "partner_agent", "admin"]);
export const languageEnum = pgEnum("language_preference", ["ja", "en"]);
export const ekycStatusEnum = pgEnum("ekyc_status", [
  "not_started",
  "pending",
  "verified",
  "rejected",
]);
export const communicationPreferenceEnum = pgEnum("communication_preference", [
  "detailed",
  "concise",
]);

export const residencyStatusEnum = pgEnum("residency_status", [
  "resident",
  "non_resident",
  "corporate",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"), // Better Auth standard
  displayName: text("display_name"),
  image: text("image"), // Better Auth standard
  emailVerified: boolean("email_verified").default(false), // Better Auth standard
  phone: text("phone"), // Encrypted in app
  languagePreference: languageEnum("language_preference").default("ja"),
  lineUserId: text("line_user_id").unique(),
  financialProfile: jsonb("financial_profile"), // Encrypted in app
  ekycStatus: ekycStatusEnum("ekyc_status").default("not_started"),
  ekycVerifiedAt: timestamp("ekyc_verified_at", { withTimezone: true }),
  role: roleEnum("role").default("buyer"),
  communicationPreference: communicationPreferenceEnum("communication_preference").default(
    "detailed",
  ),
  romanjiName: text("romanji_name"),
  katakanaName: text("katakana_name"),
  nationality: text("nationality"),
  residencyStatus: residencyStatusEnum("residency_status").default("resident"),
  domesticContactPerson: jsonb("domestic_contact_person"), // { name, phone, address }
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(), // Trigger handled by application/DB level if needed, or manually updated
});
