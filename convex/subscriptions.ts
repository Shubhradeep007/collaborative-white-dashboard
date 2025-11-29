import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
    args: { orgId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const orgSubscriptions = await ctx.db
            .query("orgSubscription")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .collect();

        if (orgSubscriptions.length === 0) {
            return null;
        }

        const validSubscription = orgSubscriptions.find((sub) =>
            sub.stripeCurrentPeriodEnd &&
            sub.stripeCurrentPeriodEnd + 86_400_000 > Date.now()
        );

        const subscriptionToReturn = validSubscription || orgSubscriptions[0];

        const isValid =
            subscriptionToReturn.stripePriceId &&
            subscriptionToReturn.stripeCurrentPeriodEnd + 86_400_000 > Date.now();

        return {
            ...subscriptionToReturn,
            isValid: !!isValid,
        };
    },
});
