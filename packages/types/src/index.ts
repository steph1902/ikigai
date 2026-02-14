import type * as validators from "@ikigai/validators";
import type { z } from "zod";

export type User = z.infer<typeof validators.userSchema>;
export type Property = z.infer<typeof validators.propertySchema>;
export type Journey = z.infer<typeof validators.journeySchema>;
export type Transaction = z.infer<typeof validators.transactionSchema>;
export type Document = z.infer<typeof validators.documentSchema>;
export type Conversation = z.infer<typeof validators.conversationSchema>;
export type Message = z.infer<typeof validators.messageSchema>;

export * from "@ikigai/validators";
