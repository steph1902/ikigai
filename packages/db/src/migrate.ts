import * as dotenv from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
dotenv.config({ path: "../../.env" });
import { db } from "./index";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
