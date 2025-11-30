import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
    args: { orgId: v.optional(v.string()) }, // Made optional to not break existing calls immediately, but logic changes
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const userSubscription = await ctx.db
            .query("userSubscription")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .first();

        if (!userSubscription) {
            return null;
        }

        const isValid =
            userSubscription.stripePriceId &&
            userSubscription.stripeCurrentPeriodEnd + 86_400_000 > Date.now();

        return {
            ...userSubscription,
            isValid: !!isValid,
        };
    },
});

export const getUserSubscription = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userSubscription")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();
    },
});
