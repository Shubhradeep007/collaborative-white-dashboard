import { v } from "convex/values";
import { mutation } from "./_generated/server";

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

    //Todo: later check to favariote reation as well

    await ctx.db.delete(args.id);
  },
});

export const upadate = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized!");
    }

    if (!title) {
      throw new Error("Title is Requried!");
    }

    if (title.length > 60) {
      throw new Error("Title can not be more then 60 character");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

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
      .withIndex("by_user_board_org", (q) =>
        q.eq("userId", userId).eq("boardId", board._id).eq("orgId", args.orgId)
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
      // todo: check if orgID needed
      )
      .unique();

    if (!exsistingFavorite) {
      throw new Error("Favorited Board not found");
    }

    await ctx.db.delete(exsistingFavorite._id)

    return board;
  },
});

