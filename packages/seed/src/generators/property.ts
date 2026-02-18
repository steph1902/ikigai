/**
 * @file property.ts
 * @description Generates synthetic property data for the Japanese real estate market.
 * Includes logic for different regions (Tokyo, Osaka, Nagoya), building types, and realistic pricing.
 */
import { faker } from "@faker-js/faker/locale/ja";
import { getPropertyImageUrl } from "./images";

import {
  NAGOYA_AREAS,
  NAGOYA_STATIONS,
  OSAKA_AREAS,
  OSAKA_STATIONS,
  TOKYO_AREAS,
  TOKYO_STATIONS,
} from "../constants/regions";
import { BUILDING_TYPES, LAYOUT_TYPES } from "../constants/types";

// Explicit interfaces to avoid "as const" inference hell
interface Station {
  name: string;
  lines: string[];
  lat: number;
  lng: number;
}

interface Area {
  name: string;
  zip: string;
  priceMod: number;
  characteristics: string[];
}

// Earthquake resistance standard cutoff: June 1981
// (Used conceptually — yearBuilt determines standard in schema)

function generateFeatures(buildingAge: number, areaCharacteristics: string[]): string[] {
  const features: string[] = [];

  // Basic features based on age
  if (buildingAge < 5) features.push("新築", "築浅");
  if (buildingAge < 10) features.push("オートロック", "宅配ボックス");
  if (buildingAge >= 10 && buildingAge < 20) features.push("リノベーション済み");

  // Area specific
  if (areaCharacteristics.includes("luxury")) features.push("タワーマンション", "コンシェルジュ");
  if (areaCharacteristics.includes("family")) features.push("公園近い", "文教地区");

  // Random common features
  const common = [
    "ペット可",
    "駐車場あり",
    "南向き",
    "角部屋",
    "最上階",
    "カウンターキッチン",
    "床暖房",
  ];
  features.push(...faker.helpers.arrayElements(common, { min: 2, max: 4 }));

  return [...new Set(features)];
}

function generateDescription(
  area: Area,
  station: Station,
  buildingAge: number,
  features: string[],
): string {
  const timeToStation = faker.number.int({ min: 1, max: 15 });
  return `
    ${area.name}エリアの${features[0] || "素敵な"}物件です。
    ${station.name}駅まで徒歩${timeToStation}分。
    周辺には${faker.helpers.arrayElement(["スーパー", "コンビニ", "公園", "病院"])}があり、生活に便利です。
    築${buildingAge}年ですが、管理状態は良好です。
  `.trim();
}

// Helper to determine region array from string
function getAreasForRegion(region: string) {
  switch (region) {
    case "tokyo":
      return TOKYO_AREAS;
    case "osaka":
      return OSAKA_AREAS;
    case "nagoya":
      return NAGOYA_AREAS;
    default:
      return TOKYO_AREAS;
  }
}

// Helper to get stations (mock implementation as station data was split differently in constants)
// In a real scenario, stations would be linked to areas in the constants.
// For now, we picking a random station logic or assuming constants provided adequate data.
// Looking at the constants I created: TOKYO_STATIONS etc are separate export.
// I need to import them too.

export function generateProperty(region = "tokyo") {
  const areas = getAreasForRegion(region);
  const area = faker.helpers.arrayElement(areas);

  // We need stations to reference. Since constants file has them separately,
  // we might just pick a random compatible one or a generic one if not perfectly linked.
  // For simplicity in this seed, we'll pick from the matching region list.

  // Note: In the original file, stations were nested in areas.
  // In my extracted constants, they are separate lists (TOKYO_STATIONS).
  // I will assume for now we pick a random station from the region's list.



  // Since I need to access them dynamically:
  const regionStations =
    {
      tokyo: TOKYO_STATIONS,
      osaka: OSAKA_STATIONS,
      nagoya: NAGOYA_STATIONS,
    }[region] || TOKYO_STATIONS;

  const station = faker.helpers.arrayElement(regionStations as Station[]);

  const buildingTypeObj = faker.helpers.arrayElement(BUILDING_TYPES);
  const layoutObj = faker.helpers.arrayElement(LAYOUT_TYPES);

  const buildingDate = faker.date.past({ years: 40 });
  const buildingAge = new Date().getFullYear() - buildingDate.getFullYear();

  const exclusiveArea = faker.number.float({
    min: layoutObj.minSqm,
    max: layoutObj.maxSqm,
    multipleOf: 0.01,
  });

  // Calculate rent
  const baseRentPerSqm = 3000 * area.priceMod;
  const ageDiscount = Math.max(0.5, 1 - buildingAge * 0.01);
  const rent = Math.floor((exclusiveArea * baseRentPerSqm * ageDiscount) / 1000) * 1000;

  // Calculate price (buy)
  const basePricePerSqm = 800000 * area.priceMod;
  const price = Math.floor((exclusiveArea * basePricePerSqm * ageDiscount) / 100000) * 100000;

  const features = generateFeatures(buildingAge, area.characteristics);
  const id = `prop_${faker.string.nanoid(12)}`;

  // Generate Image URLs
  const imageUrls = Array.from({ length: 4 }, (_, i) =>
    getPropertyImageUrl(id, i, buildingTypeObj.type as any),
  );

  return {
    id,
    name: `${area.name} ${layoutObj.layout} ${buildingTypeObj.label}`,
    address: `〒${area.zip} ${area.name} ${faker.location.streetAddress()}`,
    prefecture: region === "tokyo" ? "東京都" : region === "osaka" ? "大阪府" : "愛知県",
    municipality: area.name,
    district: area.name,
    // biome-ignore lint/suspicious/noExplicitAny: Raw SQL geometry handling
    location: null,
    lat: station.lat + faker.number.float({ min: -0.008, max: 0.008 }),
    lng: station.lng + faker.number.float({ min: -0.008, max: 0.008 }),
    buildingType: buildingTypeObj.type,
    structure: faker.helpers.arrayElement(["RC", "SRC", "Wooden", "Steel"]),
    totalAreaSqm: exclusiveArea.toFixed(2),
    landAreaSqm: (exclusiveArea * 0.8).toFixed(2),
    buildingAreaSqm: exclusiveArea.toFixed(2),
    floorPlanImageUrl:
      imageUrls.find((url) => url.includes("floorplan")) || getPropertyImageUrl(id, 0, "floorplan"),
    images: imageUrls.filter((url) => !url.includes("floorplan")),
    description: generateDescription(area, station, buildingAge, features),
    listingDate: faker.date.recent({ days: 90 }),
    status: faker.helpers.weightedArrayElement([
      { value: "active" as const, weight: 75 },
      { value: "sold" as const, weight: 20 },
      { value: "reserved" as const, weight: 5 },
    ]),
    rent,
    price,
    layout: layoutObj.layout,
    features,
    yearBuilt: buildingDate.getFullYear(),
    monthBuilt: buildingDate.getMonth() + 1,
    totalFloors: faker.number.int(buildingTypeObj.floors),
    floor: faker.number.int({ min: 1, max: 10 }), // Simplified
    managementFee: Math.floor(rent * 0.05),
    repairReserveFund: Math.floor(rent * 0.02),
    parkingAvailable: features.includes("駐車場あり"),
    parkingFee: features.includes("駐車場あり") ? 30000 : 0,
    bicycleParkingAvailable: true,
    bikeParkingAvailable: faker.datatype.boolean(),

    // Agent/Owner data (mock)
    agentId: "agent_01",
    ownerId: "owner_01",
  };
}

export function generateDataset(count: number, region = "tokyo") {
  return Array.from({ length: count }, () => generateProperty(region));
}
