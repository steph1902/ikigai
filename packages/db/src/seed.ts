import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { faker } from "@faker-js/faker";
import { db } from "./index";
import { users } from "./schema";

async function main() {
  console.log("Seeding database...");

  // Seed Users
  const userData = [];
  for (let i = 0; i < 10; i++) {
    userData.push({
      email: faker.internet.email(),
      displayName: faker.person.fullName(),
      role: i === 0 ? "admin" : i === 1 ? "partner_agent" : "buyer",
      languagePreference: i % 2 === 0 ? "ja" : "en",
    });
  }
  // @ts-ignore
  await db.insert(users).values(userData).onConflictDoNothing();
  console.log("Seeded 10 users.");

  // Seed Properties
  const propertyData = [];
  for (let i = 0; i < 50; i++) {
    // Start with 50 for speed, easy to scale to 500
    propertyData.push({
      source: "partner_direct",
      sourceListingId: faker.string.uuid(),
      address: `Tokyo, ${faker.location.city()}, ${faker.location.streetAddress()}`,
      prefecture: "Tokyo",
      municipality: faker.location.city(),
      buildingType: "mansion",
      structure: "rc",
      totalAreaSqm: faker.number.float({ min: 20, max: 200, multipleOf: 0.01 }).toString(), // Drizzle numeric is string in JS
      numRooms: faker.number.int({ min: 1, max: 5 }),
      yearBuilt: faker.number.int({ min: 1980, max: 2024 }),
      listingPrice: faker.number.int({ min: 10000000, max: 100000000 }),
      nearestStationName: "Shinjuku",
      nearestStationWalkMinutes: faker.number.int({ min: 1, max: 15 }),
      description: faker.lorem.paragraph(),
      isActive: true,
      // location: ... (need postgis helper or raw sql insert for geometry)
    });
  }

  // Note: Geometry insertion might require raw SQL or specific Drizzle handling.
  // Skipping geometry for simple seed for now or using a helper.
  // await db.insert(properties).values(propertyData);
  // console.log("Seeded properties.");

  console.log("Seeding complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
