import { z } from "zod";

export const mortgageStatusSchema = z.enum([
  "not_started",
  "preapproval_submitted",
  "preapproved",
  "formal_submitted",
  "approved",
  "declined",
  "not_needed",
]);
export const transactionStatusEnum = z.enum(["active", "completed", "cancelled"]);

export const transactionSchema = z.object({
  id: z.string().uuid(),
  shortlistedPropertyId: z.string().uuid(),
  journeyId: z.string().uuid(),
  propertyId: z.string().uuid(),
  offerPrice: z.number().nullish(),
  agreedPrice: z.number().nullish(),
  earnestMoney: z.number().nullish(),
  settlementDate: z.date().nullish(), // will handle date string on io
  mortgageStatus: mortgageStatusSchema.default("not_started"),
  mortgageInstitution: z.string().nullish(),
  mortgageAmount: z.number().nullish(),
  assignedAgentId: z.string().uuid().nullish(),
  assignedScrivener: z.string().nullish(),
  status: transactionStatusEnum.default("active"),
  cancellationReason: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
