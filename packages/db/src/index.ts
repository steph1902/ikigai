import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"; // Use 'postgres' driver
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/ikigai";

// Use 'postgres' library for better performance and serverless support (if needed later)
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
export type Db = typeof db;

export { schema };
export * from "./schema";
