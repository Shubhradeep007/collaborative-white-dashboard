"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { createClerkClient } from '@clerk/nextjs/server';

export const syncUsers = action({
    args: {},
    handler: async (ctx) => {
        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        const users = await clerk.users.getUserList({ limit: 100 });

        for (const user of users.data) {
            const email = user.emailAddresses[0]?.emailAddress;
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

            await ctx.runMutation(internal.users.upsertUserInternal, {
                clerkId: user.id,
                email,
                name,
                imageUrl: user.imageUrl,
                role: "user",
            });
        }
        return { count: users.data.length };
    },
});
