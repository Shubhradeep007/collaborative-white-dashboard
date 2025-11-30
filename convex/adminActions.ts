"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { createClerkClient } from '@clerk/nextjs/server';
import Stripe from "stripe";

export const banUser = action({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const admin = await ctx.runQuery(api.admin.checkAdminIdentity);
        if (!admin) throw new Error("Unauthorized");

        const user = await ctx.runQuery(api.admin.getUserById, { userId: args.userId });
        if (!user) throw new Error("User not found");

        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

        try {
            await clerk.users.banUser(user.clerkId);
        } catch (error) {
            console.error("Failed to ban user in Clerk:", error);
        }

        await ctx.runMutation(internal.admin.banUserInternal, { userId: args.userId });
    },
});

export const unbanUser = action({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const admin = await ctx.runQuery(api.admin.checkAdminIdentity);
        if (!admin) throw new Error("Unauthorized");

        const user = await ctx.runQuery(api.admin.getUserById, { userId: args.userId });
        if (!user) throw new Error("User not found");

        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

        try {
            await clerk.users.unbanUser(user.clerkId);
        } catch (error) {
            console.error("Failed to unban user in Clerk:", error);
        }

        await ctx.runMutation(internal.admin.unbanUserInternal, { userId: args.userId });
    },
});

export const cancelSubscription = action({
    args: { subscriptionId: v.string(), userId: v.string() },
    handler: async (ctx, args) => {
        const admin = await ctx.runQuery(api.admin.checkAdminIdentity);
        if (!admin) throw new Error("Unauthorized");

        const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            apiVersion: "2025-11-17.clover" as any,
        });

        try {
            await stripe.subscriptions.cancel(args.subscriptionId);
        } catch (error) {
            console.error("Failed to cancel subscription in Stripe:", error);
        }

        await ctx.runMutation(internal.admin.cancelSubscriptionInternal, { subscriptionId: args.subscriptionId });
    },
});

export const deleteOrganization = action({
    args: { orgId: v.string(), subscriptionId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const admin = await ctx.runQuery(api.admin.checkAdminIdentity);
        if (!admin) throw new Error("Unauthorized");

        const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            apiVersion: "2025-11-17.clover" as any,
        });

        if (args.subscriptionId) {
            try {
                await stripe.subscriptions.cancel(args.subscriptionId);
            } catch (error) {
                console.error("Failed to cancel subscription in Stripe:", error);
            }
        }

        await ctx.runMutation(internal.admin.deleteOrganizationInternal, { orgId: args.orgId });
    },
});

export const deleteOrganizations = action({
    args: {
        orgs: v.array(v.object({
            orgId: v.string(),
            subscriptionId: v.optional(v.string())
        }))
    },
    handler: async (ctx, args) => {
        const admin = await ctx.runQuery(api.admin.checkAdminIdentity);
        if (!admin) throw new Error("Unauthorized");

        const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            apiVersion: "2025-11-17.clover" as any,
        });

        for (const org of args.orgs) {
            if (org.subscriptionId) {
                try {
                    await stripe.subscriptions.cancel(org.subscriptionId);
                } catch (error) {
                    console.error(`Failed to cancel subscription for org ${org.orgId}:`, error);
                }
            }
        }

        await ctx.runMutation(internal.admin.deleteOrganizationsInternal, {
            orgIds: args.orgs.map(o => o.orgId)
        });
    },
});

export const cancelSubscriptions = action({
    args: {
        subscriptions: v.array(v.object({
            subscriptionId: v.string(),
            userId: v.string()
        }))
    },
    handler: async (ctx, args) => {
        const admin = await ctx.runQuery(api.admin.checkAdminIdentity);
        if (!admin) throw new Error("Unauthorized");

        const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            apiVersion: "2025-11-17.clover" as any,
        });

        for (const sub of args.subscriptions) {
            try {
                await stripe.subscriptions.cancel(sub.subscriptionId);
            } catch (error) {
                console.error(`Failed to cancel subscription ${sub.subscriptionId}:`, error);
            }
        }

        await ctx.runMutation(internal.admin.cancelSubscriptionsInternal, {
            subscriptionIds: args.subscriptions.map(s => s.subscriptionId)
        });
    },
});
