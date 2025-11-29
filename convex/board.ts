import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const images = ["/placeholder/1.jpg", "/placeholder/2.jpg"];

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Check subscription status
    const orgSubscriptions = await ctx.db
      .query("orgSubscription")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();

    const isPro = orgSubscriptions.some((sub) =>
      sub.stripeCurrentPeriodEnd &&
      sub.stripeCurrentPeriodEnd + 86_400_000 > Date.now()
    );

    // Enforce board limit for free users
    if (!isPro) {
      const boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .collect();

      if (boards.length >= 2) {
        throw new Error("You have reached your limit of 2 boards. Upgrade to Pro for unlimited boards!");
      }
    }

    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const userId = identity.subject

    const exsistingFavorite = await ctx.db
      .query("usesFavroites")
      .withIndex("by_user_board", (q) =>
        q
          .eq("userId", userId)
          .eq("boardId", args.id)
      )
      .unique()

    if (exsistingFavorite) {
      await ctx.db.delete(exsistingFavorite._id)
    }

    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("boards"), title: v.optional(v.string()), imageUrl: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const title = args.title ? args.title.trim() : undefined;

    if (args.title !== undefined && !title) {
      throw new Error("Title is Requried!");
    }

    if (title && title.length > 60) {
      throw new Error("Title can not be more then 60 character");
    }

    const patchData: any = {};
    if (title) patchData.title = title;
    if (args.imageUrl) patchData.imageUrl = args.imageUrl;

    const board = await ctx.db.patch(args.id, patchData);

    return board;
  },
});

export const Favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error("board not found!");
    }

    const userId = identity.subject;

    const exsistingFavorite = await ctx.db
      .query("usesFavroites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (exsistingFavorite) {
      throw new Error("Board Already exsisted!");
    }

    await ctx.db.insert("usesFavroites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

export const UnFavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized!");
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error("board not found!");
    }

    const userId = identity.subject;

    const exsistingFavorite = await ctx.db
      .query("usesFavroites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!exsistingFavorite) {
      throw new Error("Favorited Board not found");
    }

    await ctx.db.delete(exsistingFavorite._id)

    return board;
  },
});

export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id)
    return board
  }
})
