import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: false,
});
