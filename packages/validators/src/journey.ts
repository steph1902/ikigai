import { z } from "zod";

export const journeyStatusSchema = z.enum(["active", "completed", "paused"]);
export const shortlistStateSchema = z.enum([
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

export const journeySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  searchCriteria: z.record(z.any()).nullish(),
  status: journeyStatusSchema.default("active"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const shortlistedPropertySchema = z.object({
  id: z.string().uuid(),
  journeyId: z.string().uuid(),
  propertyId: z.string().uuid(),
  userNotes: z.string().nullish(),
  userRating: z.number().int().min(1).max(5).nullish(),
  state: shortlistStateSchema.default("shortlisted"),
  stateChangedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
