import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const checkSubscriptionExpiry = internalMutation({
    handler: async (ctx) => {
        const now = Date.now();
        const threeDaysFromNow = now + 3 * 24 * 60 * 60 * 1000;

        const expiringSubscriptions = await ctx.db
            .query("orgSubscription")
            .collect();

        for (const sub of expiringSubscriptions) {
            if (
                sub.stripeCurrentPeriodEnd > now &&
                sub.stripeCurrentPeriodEnd < threeDaysFromNow
            ) {
                // Email notification logic would go here
            }
        }
    },
});

const crons = cronJobs();

crons.daily(
    "check-subscription-expiry",
    { hourUTC: 0, minuteUTC: 0 },
    internal.crons.checkSubscriptionExpiry
);

export default crons;
