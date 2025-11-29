import { v } from 'convex/values'
import { defineSchema, defineTable } from 'convex/server'

export default defineSchema({
    boards: defineTable({
        title: v.string(),
        orgId: v.string(),
        authorId: v.string(),
        authorName: v.string(),
        imageUrl: v.string()
    })
        .index("by_org", ["orgId"])
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ['orgId']
        }),
    usesFavroites: defineTable({
        orgId: v.string(),
        userId: v.string(),
        boardId: v.id("boards")
    })
        .index("by_board", ["boardId"])
        .index("by_user_org", ["userId", "orgId"])
        .index("by_user_board", ["userId", "boardId"])
        .index("by_user_board_org", ["userId", "boardId", "orgId"]),
    orgSubscription: defineTable({
        orgId: v.string(),
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.string(),
        stripePriceId: v.string(),
        stripeCurrentPeriodEnd: v.number(),
    })
        .index("by_org", ["orgId"])
        .index("by_subscription", ["stripeSubscriptionId"]),
    userSubscription: defineTable({
        userId: v.string(),
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.string(),
        stripePriceId: v.string(),
        stripeCurrentPeriodEnd: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_subscription", ["stripeSubscriptionId"]),
    users: defineTable({
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        imageUrl: v.string(),
        role: v.string(), // 'admin' | 'user'
    })
        .index("by_clerk_id", ["clerkId"]),
    organizations: defineTable({
        orgId: v.string(),
        name: v.string(),
        imageUrl: v.string(),
    })
        .index("by_org_id", ["orgId"]),
    systemSettings: defineTable({
        key: v.string(),
        value: v.any(),
    })
        .index("by_key", ["key"])
})