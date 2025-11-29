"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function syncOrganizations() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const client = await clerkClient();
    const organizations = await client.organizations.getOrganizationList({
        limit: 100,
    });

    const orgsToSync = organizations.data.map((org) => ({
        orgId: org.id,
        name: org.name,
        imageUrl: org.imageUrl,
    }));

    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });

    await fetchMutation(api.organizations.sync, {
        organizations: orgsToSync,
    }, { token: token! });

    return { success: true, count: orgsToSync.length };
}

export async function deleteOrganizationAction(orgId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const client = await clerkClient();

    try {
        await client.organizations.deleteOrganization(orgId);
    } catch (error) {
        console.error("Failed to delete organization from Clerk:", error);
        // Continue to delete from Convex even if Clerk fails (e.g. if already deleted)
    }

    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });

    await fetchMutation(api.admin.deleteOrganization, {
        orgId,
    }, { token: token! });

    return { success: true };
}

export async function deleteOrganizationsAction(orgIds: string[]) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const client = await clerkClient();

    for (const orgId of orgIds) {
        try {
            await client.organizations.deleteOrganization(orgId);
        } catch (error) {
            console.error(`Failed to delete organization ${orgId} from Clerk:`, error);
        }
    }

    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });

    await fetchMutation(api.admin.deleteOrganizations, {
        orgIds,
    }, { token: token! });

    return { success: true };
}
