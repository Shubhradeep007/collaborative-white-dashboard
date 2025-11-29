import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
    args: {
        userId: v.string(),
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.string(),
        stripePriceId: v.string(),
        stripeCurrentPeriodEnd: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("userSubscription", {
            userId: args.userId,
            stripeCustomerId: args.stripeCustomerId,
            stripeSubscriptionId: args.stripeSubscriptionId,
            stripePriceId: args.stripePriceId,
            stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
        });
    },
});

export const update = mutation({
    args: {
        stripeSubscriptionId: v.string(),
        stripePriceId: v.string(),
        stripeCurrentPeriodEnd: v.number(),
    },
    handler: async (ctx, args) => {
        const subscription = await ctx.db
            .query("userSubscription")
            .withIndex("by_subscription", (q) => q.eq("stripeSubscriptionId", args.stripeSubscriptionId))
            .unique();

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        await ctx.db.patch(subscription._id, {
            stripePriceId: args.stripePriceId,
            stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
        });
    },
});

export const remove = mutation({
    args: {
        stripeSubscriptionId: v.string(),
    },
    handler: async (ctx, args) => {
        const subscription = await ctx.db
            .query("userSubscription")
            .withIndex("by_subscription", (q) => q.eq("stripeSubscriptionId", args.stripeSubscriptionId))
            .unique();

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        await ctx.db.delete(subscription._id);
    },
});
