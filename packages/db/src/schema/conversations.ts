import { boolean, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const channelEnum = pgEnum("channel", ["web", "mobile", "line", "voice"]);
export const messageRoleEnum = pgEnum("message_role", ["user", "assistant", "system", "tool"]);

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  channel: channelEnum("channel").notNull(),
  langgraphThreadId: text("langgraph_thread_id"),
  isActive: boolean("is_active").default(true),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .references(() => conversations.id)
    .notNull(),
  role: messageRoleEnum("role").notNull(),
  content: text("content"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  // Partitioning by month is a physical table property, not fully supported in Drizzle ORM definition yet without raw SQL.
  // We'll rely on the migration script to handle partitioning if needed, or just standard table for now.
});
