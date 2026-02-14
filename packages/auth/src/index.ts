import { db, schema } from "@ikigai/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  //   socialProviders: {
  //     google: {
  //       clientId: process.env.GOOGLE_CLIENT_ID!,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //     },
  //   },
});
