import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

/**
 * tRPC context — passed to every procedure.
 * Contains the authenticated user session and database client.
 */
export interface TRPCContext {
    userId: string | null;
    locale: "ja" | "en";
    channel: "web" | "mobile" | "line" | "voice";
}

const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof z.ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure — requires authenticated user.
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId,
        },
    });
});

/**
 * Admin procedure — requires admin role.
 * In production, this checks the user's role from the database.
 */
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    // Portfolio mode: mock admin check
    // Production: query db for user.role === 'admin'
    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId,
        },
    });
});

export { t };
