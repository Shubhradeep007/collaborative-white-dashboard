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

    // Check if user is banned
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user?.role === "banned") {
      throw new Error("Your account has been suspended.");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Check subscription status
    const userSubscription = await ctx.db
      .query("userSubscription")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();

    const isPro =
      userSubscription &&
      userSubscription.stripeCurrentPeriodEnd &&
      userSubscription.stripeCurrentPeriodEnd + 86_400_000 > Date.now();

    // Enforce board limit for free users
    if (!isPro) {
      const boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .collect();

      const maxBoardsSetting = await ctx.db
        .query("systemSettings")
        .withIndex("by_key", (q) => q.eq("key", "maxBoards"))
        .unique();

      const limit = maxBoardsSetting ? parseInt(maxBoardsSetting.value) : 2; // Default to 2 if not set

      if (boards.length >= limit) {
        throw new Error(`You have reached your limit of ${limit} boards. Upgrade to Pro for unlimited boards!`);
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

    const patchData: Record<string, unknown> = {};
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
