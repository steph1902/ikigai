import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Need to define vector type manually or use an extension helper if available.
// For now, using customType for vector and geometry.

// Helper for PostGIS geometry
// In Drizzle, we might use customType or just sql for migration if not strictly typed in columns
// But for query builder, customType is better.
import { customType } from "drizzle-orm/pg-core";

const geometry = customType<{ data: string }>({
  dataType() {
    return "geography(Point, 4326)";
  },
});

const vectorType = customType<{ data: number[] }>({
  dataType() {
    return "vector(1024)";
  },
});

export const sourceEnum = pgEnum("source", [
  "suumo",
  "homes",
  "athome",
  "reins",
  "partner_direct",
  "yahoo_re",
]);
export const buildingTypeEnum = pgEnum("building_type", ["mansion", "apartment", "kodate", "land"]);
export const structureEnum = pgEnum("structure", [
  "rc",
  "src",
  "steel",
  "wood",
  "light_steel",
  "other",
]);
export const earthquakeStandardEnum = pgEnum("earthquake_standard", [
  "old",
  "new",
  "grade1",
  "grade2",
  "grade3",
  "unknown",
]);

export const rainsStatusEnum = pgEnum("rains_status", ["synced", "attested", "exempt"]);

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: sourceEnum("source"),
    sourceListingId: text("source_listing_id"),
    address: text("address").notNull(),
    prefecture: text("prefecture"),
    municipality: text("municipality"),
    district: text("district"),
    location: geometry("location"), // PostGIS Point
    buildingType: buildingTypeEnum("building_type"),
    structure: structureEnum("structure"),
    totalAreaSqm: numeric("total_area_sqm", { precision: 10, scale: 2 }),
    landAreaSqm: numeric("land_area_sqm", { precision: 10, scale: 2 }),
    floorPlan: text("floor_plan"),
    numRooms: integer("num_rooms"),
    floorLevel: integer("floor_level"),
    totalFloors: integer("total_floors"),
    totalUnits: integer("total_units"),
    yearBuilt: integer("year_built"),
    yearRenovated: integer("year_renovated"),
    earthquakeStandard: earthquakeStandardEnum("earthquake_standard"),
    listingPrice: bigint("listing_price", { mode: "number" }),
    managementFee: integer("management_fee"),
    repairReserveFee: integer("repair_reserve_fee"),
    groundLeaseFee: integer("ground_lease_fee"),
    nearestStationName: text("nearest_station_name"),
    nearestStationLine: text("nearest_station_line"),
    nearestStationWalkMinutes: integer("nearest_station_walk_minutes"),
    zoning: text("zoning"),
    buildingCoverageRatio: numeric("building_coverage_ratio", { precision: 5, scale: 2 }),
    floorAreaRatio: numeric("floor_area_ratio", { precision: 5, scale: 2 }),
    features: jsonb("features"),
    images: jsonb("images"),
    floorPlanImageUrl: text("floor_plan_image_url"),
    listingUrl: text("listing_url"),
    description: text("description"),
    listingDate: date("listing_date"),
    isActive: boolean("is_active").default(true),
    lastScrapedAt: timestamp("last_scraped_at", { withTimezone: true }),
    embedding: vectorType("embedding"), // pgvector
    rainsStatus: rainsStatusEnum("rains_status"),
    designatedZone: boolean("designated_zone").default(false), // e.g. Urban Planning Zone requiring report
    psychologicalDefect: text("psychological_defect"), // "Jiko-bukken" details
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    unqSource: unique().on(t.source, t.sourceListingId),
    // idxLocation: index("idx_properties_location").using("gist", t.location),
    // idxEmbedding: index("idx_properties_embedding").using("hnsw", t.embedding),
    idxPrefMuniPrice: index("idx_properties_pref_muni_price").on(
      t.prefecture,
      t.municipality,
      t.listingPrice,
    ),
    idxWalkMinutes: index("idx_properties_walk_minutes").on(t.nearestStationWalkMinutes),
    idxIsActive: index("idx_properties_is_active").on(t.isActive),
  }),
);
