import { db, schema } from "@ikigai/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

/**
 * Server-side Better Auth instance.
 *
 * Supports:
 * - Email/password authentication
 * - Google OAuth (when credentials configured)
 * - LINE Login (when credentials configured) — primary social provider for Japanese market
 * - Session management with JWT + refresh tokens
 */
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
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    }),
    ...(process.env.LINE_CHANNEL_ID && {
      line: {
        clientId: process.env.LINE_CHANNEL_ID,
        clientSecret: process.env.LINE_CHANNEL_SECRET ?? "",
      },
    }),
  },
  session: {
    expiresIn: 60 * 15, // 15 minutes — short-lived JWT
    updateAge: 60 * 60 * 24, // 24 hours — refresh token update cycle
  },
});

/**
 * Permission levels for the LAM Action Engine.
 * Maps to FSD Section 3.2 — determines what approval is needed before action execution.
 */
export const PERMISSION_LEVELS = {
  /** AI can execute without asking — e.g., search, fetch data */
  AUTONOMOUS: "autonomous",
  /** Requires explicit user confirmation — e.g., schedule viewing, submit offer */
  USER_APPROVAL: "user_approval",
  /** Requires licensed professional (宅建士) review — e.g., contract finalization */
  PROFESSIONAL_REQUIRED: "professional_required",
} as const;

export type PermissionLevel =
  (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS];

/**
 * Check if a user has completed step-up authentication for high-stakes actions.
 * In portfolio mode, this always returns true. In production, it would verify
 * TOTP or SMS OTP re-authentication within the last 5 minutes.
 */
export function hasStepUpAuth(_userId: string): boolean {
  // Portfolio mode: always authorized
  // Production: check Redis for recent re-authentication timestamp
  return true;
}

export type { auth as Auth };
