import { v } from "convex/values";
import { mutation, query, internalMutation, QueryCtx, MutationCtx } from "./_generated/server";

// Check if user is admin
export async function checkAdmin(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthorized");
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();

    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }

    return user;
}

export const checkAdminIdentity = query({
    args: {},
    handler: async (ctx) => {
        try {
            await checkAdmin(ctx);
            return true;
        } catch {
            return false;
        }
    }
});

export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        return await ctx.db.get(args.userId);
    }
});

export const banUserInternal = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { role: "banned" });
    }
});

export const unbanUserInternal = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { role: "user" });
    }
});

export const updateUser = mutation({
    args: { userId: v.id("users"), name: v.string(), role: v.string() },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        await ctx.db.patch(args.userId, { name: args.name, role: args.role });
    },
});

export const deleteUser = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);

        const user = await ctx.db.get(args.userId);
        if (!user) return;

        const subscription = await ctx.db
            .query("userSubscription")
            .withIndex("by_user", (q) => q.eq("userId", user.clerkId))
            .unique();

        if (subscription) {
            await ctx.db.delete(subscription._id);
        }

        await ctx.db.delete(args.userId);
    },
});

export const deleteUsers = mutation({
    args: { userIds: v.array(v.id("users")) },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        for (const id of args.userIds) {
            await ctx.db.delete(id);
        }
    },
});

export const cancelSubscriptionInternal = internalMutation({
    args: { subscriptionId: v.string() },
    handler: async (ctx, args) => {
        const subscriptions = await ctx.db
            .query("userSubscription")
            .withIndex("by_subscription", (q) => q.eq("stripeSubscriptionId", args.subscriptionId))
            .collect();

        for (const subscription of subscriptions) {
            await ctx.db.delete(subscription._id);
        }
    },
});

export const cancelSubscriptionsInternal = internalMutation({
    args: { subscriptionIds: v.array(v.string()) },
    handler: async (ctx, args) => {
        for (const subscriptionId of args.subscriptionIds) {
            const subscriptions = await ctx.db
                .query("userSubscription")
                .withIndex("by_subscription", (q) => q.eq("stripeSubscriptionId", subscriptionId))
                .collect();

            for (const subscription of subscriptions) {
                await ctx.db.delete(subscription._id);
            }
        }
    },
});

export const deleteOrganization = mutation({
    args: { orgId: v.string() },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        // Delete all boards
        const boards = await ctx.db
            .query("boards")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .collect();

        for (const board of boards) {
            await ctx.db.delete(board._id);
        }

        // Delete subscription
        const subscriptions = await ctx.db
            .query("orgSubscription")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .collect();

        for (const subscription of subscriptions) {
            await ctx.db.delete(subscription._id);
        }

        // Delete organization
        const org = await ctx.db
            .query("organizations")
            .withIndex("by_org_id", (q) => q.eq("orgId", args.orgId))
            .unique();

        if (org) {
            await ctx.db.delete(org._id);
        }
    },
});

export const deleteOrganizations = mutation({
    args: { orgIds: v.array(v.string()) },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        for (const orgId of args.orgIds) {
            // Delete all boards
            const boards = await ctx.db
                .query("boards")
                .withIndex("by_org", (q) => q.eq("orgId", orgId))
                .collect();

            for (const board of boards) {
                await ctx.db.delete(board._id);
            }

            // Delete subscription
            const subscriptions = await ctx.db
                .query("orgSubscription")
                .withIndex("by_org", (q) => q.eq("orgId", orgId))
                .collect();

            for (const subscription of subscriptions) {
                await ctx.db.delete(subscription._id);
            }

            // Delete organization
            const org = await ctx.db
                .query("organizations")
                .withIndex("by_org_id", (q) => q.eq("orgId", orgId))
                .unique();

            if (org) {
                await ctx.db.delete(org._id);
            }
        }
    },
});

export const deleteOrganizationInternal = internalMutation({
    args: { orgId: v.string() },
    handler: async (ctx, args) => {
        // Delete all boards
        const boards = await ctx.db
            .query("boards")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .collect();

        for (const board of boards) {
            await ctx.db.delete(board._id);
        }

        // Delete subscription
        const subscriptions = await ctx.db
            .query("orgSubscription")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .collect();

        for (const subscription of subscriptions) {
            await ctx.db.delete(subscription._id);
        }

        // Delete organization
        const org = await ctx.db
            .query("organizations")
            .withIndex("by_org_id", (q) => q.eq("orgId", args.orgId))
            .unique();

        if (org) {
            await ctx.db.delete(org._id);
        }
    },
});

export const deleteOrganizationsInternal = internalMutation({
    args: { orgIds: v.array(v.string()) },
    handler: async (ctx, args) => {
        for (const orgId of args.orgIds) {
            // Delete all boards
            const boards = await ctx.db
                .query("boards")
                .withIndex("by_org", (q) => q.eq("orgId", orgId))
                .collect();

            for (const board of boards) {
                await ctx.db.delete(board._id);
            }

            // Delete subscription
            const subscriptions = await ctx.db
                .query("orgSubscription")
                .withIndex("by_org", (q) => q.eq("orgId", orgId))
                .collect();

            for (const subscription of subscriptions) {
                await ctx.db.delete(subscription._id);
            }

            // Delete organization
            const org = await ctx.db
                .query("organizations")
                .withIndex("by_org_id", (q) => q.eq("orgId", orgId))
                .unique();

            if (org) {
                await ctx.db.delete(org._id);
            }
        }
    },
});

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        await checkAdmin(ctx);

        const usersCount = (await ctx.db.query("users").collect()).length;
        const boardsCount = (await ctx.db.query("boards").collect()).length;
        const subscriptions = await ctx.db.query("userSubscription").collect();
        const subscriptionsCount = subscriptions.length;

        // Mock revenue calculation: ₹499/month per subscription
        const revenue = subscriptionsCount * 499;

        return {
            usersCount,
            boardsCount,
            subscriptionsCount,
            revenue,
        };
    },
});

export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        await checkAdmin(ctx);
        const users = await ctx.db.query("users").collect();
        const subscriptions = await ctx.db.query("userSubscription").collect();

        const subMap = new Map(subscriptions.map(s => [s.userId, s]));

        return users.map(u => {
            const sub = subMap.get(u.clerkId);
            const isPro = sub && sub.stripeCurrentPeriodEnd && sub.stripeCurrentPeriodEnd + 86_400_000 > Date.now();
            return {
                ...u,
                plan: isPro ? "Pro" : "Free",
                subscriptionId: sub?.stripeSubscriptionId
            };
        });
    },
});

export const getBoards = query({
    args: {},
    handler: async (ctx) => {
        await checkAdmin(ctx);
        return await ctx.db.query("boards").collect();
    },
});

export const deleteBoard = mutation({
    args: { id: v.id("boards") },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        await ctx.db.delete(args.id);
    },
});

export const deleteBoards = mutation({
    args: { ids: v.array(v.id("boards")) },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        for (const id of args.ids) {
            await ctx.db.delete(id);
        }
    },
});

export const getOrganizations = query({
    args: {},
    handler: async (ctx) => {
        await checkAdmin(ctx);

        const organizations = await ctx.db.query("organizations").collect();
        const boards = await ctx.db.query("boards").collect();

        const boardCountMap = new Map();
        boards.forEach(b => {
            boardCountMap.set(b.orgId, (boardCountMap.get(b.orgId) || 0) + 1);
        });

        return organizations.map(org => ({
            orgId: org.orgId,
            name: org.name,
            imageUrl: org.imageUrl,
            boardCount: boardCountMap.get(org.orgId) || 0,
            createdAt: org._creationTime,
        }));
    },
});

export const getSubscriptions = query({
    args: {},
    handler: async (ctx) => {
        await checkAdmin(ctx);
        const subscriptions = await ctx.db.query("userSubscription").collect();
        const users = await ctx.db.query("users").collect();

        const userMap = new Map(users.map(u => [u.clerkId, u.name]));

        return subscriptions.map(sub => ({
            ...sub,
            userName: userMap.get(sub.userId) || "Unknown User"
        }));
    },
});

export const updateSettings = mutation({
    args: { key: v.string(), value: v.any() },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);

        const existing = await ctx.db
            .query("systemSettings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("systemSettings", { key: args.key, value: args.value });
        }
    },
});

export const getSettings = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        return await ctx.db
            .query("systemSettings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();
    },
});
