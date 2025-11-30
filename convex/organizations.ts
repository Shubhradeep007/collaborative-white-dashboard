import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { checkAdmin } from "./admin";

export const create = mutation({
    args: {
        orgId: v.string(),
        name: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("organizations", {
            orgId: args.orgId,
            name: args.name,
            imageUrl: args.imageUrl,
        });
    },
});

export const update = mutation({
    args: {
        orgId: v.string(),
        name: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        const org = await ctx.db
            .query("organizations")
            .withIndex("by_org_id", (q) => q.eq("orgId", args.orgId))
            .unique();

        if (!org) {
            throw new Error("Organization not found");
        }

        await ctx.db.patch(org._id, {
            name: args.name,
            imageUrl: args.imageUrl,
        });
    },
});

export const deleteOrg = mutation({
    args: { orgId: v.string() },
    handler: async (ctx, args) => {
        const org = await ctx.db
            .query("organizations")
            .withIndex("by_org_id", (q) => q.eq("orgId", args.orgId))
            .unique();

        if (!org) {
            throw new Error("Organization not found");
        }

        await ctx.db.delete(org._id);
    },
});

export const sync = mutation({
    args: {
        organizations: v.array(
            v.object({
                orgId: v.string(),
                name: v.string(),
                imageUrl: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        for (const org of args.organizations) {
            const existing = await ctx.db
                .query("organizations")
                .withIndex("by_org_id", (q) => q.eq("orgId", org.orgId))
                .unique();

            if (existing) {
                await ctx.db.patch(existing._id, {
                    name: org.name,
                    imageUrl: org.imageUrl,
                });
            } else {
                await ctx.db.insert("organizations", {
                    orgId: org.orgId,
                    name: org.name,
                    imageUrl: org.imageUrl,
                });
            }
        }
    },
});
