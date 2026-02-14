import { z } from "zod";

export const roleSchema = z.enum(["buyer", "partner_agent", "admin"]);
export const languageSchema = z.enum(["ja", "en"]);
export const ekycStatusSchema = z.enum(["not_started", "pending", "verified", "rejected"]);
export const communicationPreferenceSchema = z.enum(["detailed", "concise"]);

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullish(),
  phone: z.string().nullish(),
  languagePreference: languageSchema.default("ja"),
  lineUserId: z.string().nullish(),
  financialProfile: z.record(z.any()).nullish(), // jsonb
  ekycStatus: ekycStatusSchema.default("not_started"),
  ekycVerifiedAt: z.date().nullish(),
  role: roleSchema.default("buyer"),
  communicationPreference: communicationPreferenceSchema.default("detailed"),
  createdAt: z.date(),
  updatedAt: z.date(),
});
