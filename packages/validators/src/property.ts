import { z } from "zod";

export const sourceSchema = z.enum([
  "suumo",
  "homes",
  "athome",
  "reins",
  "partner_direct",
  "yahoo_re",
]);
export const buildingTypeSchema = z.enum(["mansion", "apartment", "kodate", "land"]);
export const structureSchema = z.enum(["rc", "src", "steel", "wood", "light_steel", "other"]);
export const earthquakeStandardSchema = z.enum([
  "old",
  "new",
  "grade1",
  "grade2",
  "grade3",
  "unknown",
]);

export const propertySchema = z.object({
  id: z.string().uuid(),
  source: sourceSchema.nullish(),
  sourceListingId: z.string().nullish(),
  address: z.string(),
  prefecture: z.string().nullish(),
  municipality: z.string().nullish(),
  district: z.string().nullish(),
  // location: z.any(), // GeoJSON or similar, skipping strict type for now
  buildingType: buildingTypeSchema.nullish(),
  structure: structureSchema.nullish(),
  totalAreaSqm: z.number().nullish(), // transformed from numeric string usually
  landAreaSqm: z.number().nullish(),
  floorPlan: z.string().nullish(),
  numRooms: z.number().int().nullish(),
  floorLevel: z.number().int().nullish(),
  totalFloors: z.number().int().nullish(),
  totalUnits: z.number().int().nullish(),
  yearBuilt: z.number().int().nullish(),
  yearRenovated: z.number().int().nullish(),
  earthquakeStandard: earthquakeStandardSchema.nullish(),
  listingPrice: z.number().nullish(),
  managementFee: z.number().int().nullish(),
  repairReserveFee: z.number().int().nullish(),
  groundLeaseFee: z.number().int().nullish(),
  nearestStationName: z.string().nullish(),
  nearestStationLine: z.string().nullish(),
  nearestStationWalkMinutes: z.number().int().nullish(),
  zoning: z.string().nullish(),
  buildingCoverageRatio: z.number().nullish(),
  floorAreaRatio: z.number().nullish(),
  features: z.array(z.string()).nullish(),
  images: z.array(z.object({ url: z.string(), type: z.string(), order: z.number() })).nullish(),
  floorPlanImageUrl: z.string().nullish(),
  listingUrl: z.string().nullish(),
  description: z.string().nullish(),
  listingDate: z.date().nullish(), // or string depending on handling
  isActive: z.boolean().default(true),
  lastScrapedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
