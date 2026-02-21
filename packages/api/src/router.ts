import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "./index";

// ─── Property Router ─────────────────────────────────────────────────────────

const propertyRouter = createTRPCRouter({
    /** List properties with filters */
    list: publicProcedure
        .input(
            z.object({
                prefectures: z.array(z.string()).optional(),
                priceMin: z.number().optional(),
                priceMax: z.number().optional(),
                layouts: z.array(z.string()).optional(),
                maxWalkMinutes: z.number().optional(),
                yearBuiltAfter: z.number().optional(),
                sortBy: z.enum(["relevance", "price_asc", "price_desc", "newest"]).default("relevance"),
                limit: z.number().min(1).max(50).default(20),
                offset: z.number().min(0).default(0),
            }).optional(),
        )
        .query(async ({ input }) => {
            // In production: query db with drizzle filters
            // Portfolio: return shaped mock data
            return {
                items: [],
                total: 0,
                page: Math.floor((input?.offset ?? 0) / (input?.limit ?? 20)) + 1,
                pageSize: input?.limit ?? 20,
                hasMore: false,
            };
        }),

    /** Get single property by ID */
    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            return { id: input.id, title: "", price: 0 };
        }),

    /** Get AI price prediction for a property */
    predict: protectedProcedure
        .input(z.object({ propertyId: z.string() }))
        .query(async ({ input }) => {
            return {
                predictedPrice: 0,
                confidenceLower: 0,
                confidenceUpper: 0,
                factors: [],
            };
        }),
});

// ─── Journey Router ──────────────────────────────────────────────────────────

const journeyRouter = createTRPCRouter({
    /** Get the current user's active journey */
    current: protectedProcedure.query(async ({ ctx }) => {
        return {
            id: "",
            userId: ctx.userId,
            stage: "exploring" as const,
            shortlistedProperties: [],
            createdAt: new Date(),
        };
    }),

    /** Update journey stage */
    updateStage: protectedProcedure
        .input(
            z.object({
                stage: z.enum([
                    "exploring",
                    "actively_searching",
                    "evaluating",
                    "negotiating",
                    "contracting",
                    "closing",
                    "post_purchase",
                ]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return { success: true, stage: input.stage };
        }),

    /** Add property to shortlist */
    shortlist: protectedProcedure
        .input(z.object({ propertyId: z.string() }))
        .mutation(async ({ input }) => {
            return { success: true, propertyId: input.propertyId };
        }),
});

// ─── Conversation Router ─────────────────────────────────────────────────────

const conversationRouter = createTRPCRouter({
    /** Start a new conversation */
    create: protectedProcedure
        .input(z.object({ channel: z.enum(["web", "mobile", "line"]) }))
        .mutation(async ({ ctx, input }) => {
            return {
                id: crypto.randomUUID(),
                userId: ctx.userId,
                channel: input.channel,
                messages: [],
            };
        }),

    /** Send a message to the AI orchestrator */
    sendMessage: protectedProcedure
        .input(
            z.object({
                conversationId: z.string(),
                content: z.string().min(1).max(4000),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // In production: forward to orchestrator service
            return {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                content: "AI response placeholder",
                mediationCategory: "A" as const,
            };
        }),

    /** List conversations for current user */
    list: protectedProcedure.query(async ({ ctx }) => {
        return { items: [], total: 0 };
    }),
});

// ─── Transaction Router ──────────────────────────────────────────────────────

const transactionRouter = createTRPCRouter({
    /** Get transaction by ID */
    byId: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            return null;
        }),

    /** List user's transactions */
    list: protectedProcedure.query(async ({ ctx }) => {
        return { items: [], total: 0 };
    }),
});

// ─── Document Router ─────────────────────────────────────────────────────────

const documentRouter = createTRPCRouter({
    /** Get analysis results for a document */
    analysis: protectedProcedure
        .input(z.object({ documentId: z.string() }))
        .query(async ({ input }) => {
            return null;
        }),

    /** List documents for current user */
    list: protectedProcedure.query(async ({ ctx }) => {
        return { items: [], total: 0 };
    }),
});

// ─── User Router ─────────────────────────────────────────────────────────────

const userRouter = createTRPCRouter({
    /** Get current user profile */
    me: protectedProcedure.query(async ({ ctx }) => {
        return {
            id: ctx.userId,
            locale: ctx.locale,
        };
    }),

    /** Update user preferences */
    updatePreferences: protectedProcedure
        .input(
            z.object({
                locale: z.enum(["ja", "en"]).optional(),
                notificationsEnabled: z.boolean().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            return { success: true };
        }),
});

// ─── Notification Router ─────────────────────────────────────────────────────

const notificationRouter = createTRPCRouter({
    /** List unread notifications */
    unread: protectedProcedure.query(async ({ ctx }) => {
        return { items: [], count: 0 };
    }),

    /** Mark notification as read */
    markRead: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            return { success: true };
        }),
});

// ─── Admin Router ────────────────────────────────────────────────────────────

const adminRouter = createTRPCRouter({
    /** Dashboard stats */
    stats: adminProcedure.query(async () => {
        return {
            totalProperties: 324,
            activeUsers: 1205,
            avgPrice: 45000000,
            systemHealth: 0.98,
            mediationBreakdown: { A: 65, B: 25, C: 10 },
        };
    }),

    /** List all conversations for monitoring */
    conversations: adminProcedure
        .input(
            z.object({
                category: z.enum(["A", "B", "C"]).optional(),
                limit: z.number().default(50),
            }).optional(),
        )
        .query(async () => {
            return { items: [], total: 0 };
        }),
});

// ─── Root Router ─────────────────────────────────────────────────────────────

export const appRouter = createTRPCRouter({
    property: propertyRouter,
    journey: journeyRouter,
    conversation: conversationRouter,
    transaction: transactionRouter,
    document: documentRouter,
    user: userRouter,
    notification: notificationRouter,
    admin: adminRouter,
});

export type AppRouter = typeof appRouter;
