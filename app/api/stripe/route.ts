import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

import { stripe } from "@/lib/stripe";
import { api } from "@/convex/_generated/api";

const settingsUrl = process.env.NEXT_PUBLIC_APP_URL + "/dashboard?success=true";
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST() {
    try {
        const { userId, orgId } = await auth();
        const user = await currentUser();

        if (!userId || !user || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const orgSubscription = await convex.query(api.subscriptions.get, { orgId });

        if (orgSubscription && orgSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: orgSubscription.stripeCustomerId,
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
                        currency: "USD",
                        product_data: {
                            name: "Board Pro",
                            description: "Unlimited boards for your organization",
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                orgId,
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
