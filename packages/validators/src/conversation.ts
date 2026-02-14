import { z } from "zod";

export const channelSchema = z.enum(["web", "mobile", "line", "voice"]);
export const messageRoleSchema = z.enum(["user", "assistant", "system", "tool"]);

export const conversationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  channel: channelSchema,
  langgraphThreadId: z.string().nullish(),
  isActive: z.boolean().default(true),
  startedAt: z.date(),
  lastMessageAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const messageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  role: messageRoleSchema,
  content: z.string().nullish(),
  metadata: z.record(z.any()).nullish(),
  createdAt: z.date(),
});
