import { query } from "./_generated/server";

export const getTrialDuration = query({
    args: {},
    handler: async (ctx) => {
        const setting = await ctx.db
            .query("systemSettings")
            .withIndex("by_key", (q) => q.eq("key", "trialDuration"))
            .unique();
        return setting ? parseInt(setting.value) : 0;
    },
});
