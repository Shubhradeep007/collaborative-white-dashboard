import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

import { stripe } from "@/lib/stripe";
import { api } from "@/convex/_generated/api";

const settingsUrl = process.env.NEXT_PUBLIC_APP_URL + "/dashboard?success=true";
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
    try {
        const { userId, orgId } = await auth();
        const user = await currentUser();

        if (!userId || !user || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if user is banned
        // We use getUserRole which takes clerkId, so we don't need the auth token
        const userRole = await convex.query(api.users.getUserRole, { clerkId: userId });

        if (userRole === "banned") {
            return new NextResponse("Account Suspended", { status: 403 });
        }

        // Check for existing user subscription
        const userSubscription = await convex.query(api.subscriptions.getUserSubscription, { userId });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            return new NextResponse(JSON.stringify({ url: stripeSession.url }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "INR",
                        product_data: {
                            name: "Board Pro",
                            description: "Unlimited boards for you",
                        },
                        unit_amount: 49900,
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    } catch (error) {
        console.error("[STRIPE_ERROR]", error);
        return new NextResponse(JSON.stringify({ error: "Internal Error", details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
