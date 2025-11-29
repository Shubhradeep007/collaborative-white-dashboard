import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
    args: {
        orgId: v.string(),
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.string(),
        stripePriceId: v.string(),
        stripeCurrentPeriodEnd: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("orgSubscription", {
            orgId: args.orgId,
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
        stripeCurrentPeriodEnd: v.number(),
        stripePriceId: v.string(),
    },
    handler: async (ctx, args) => {
        const subscription = await ctx.db
            .query("orgSubscription")
            .withIndex("by_subscription", (q) =>
                q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
            )
            .unique();

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        await ctx.db.patch(subscription._id, {
            stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
            stripePriceId: args.stripePriceId,
        });
    },
});

export const remove = mutation({
    args: {
        stripeSubscriptionId: v.string(),
    },
    handler: async (ctx, args) => {
        const subscription = await ctx.db
            .query("orgSubscription")
            .withIndex("by_subscription", (q) =>
                q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
            )
            .unique();

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        await ctx.db.delete(subscription._id);
    },
});
