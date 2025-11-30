import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";

import { stripe } from "@/lib/stripe";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error("[WEBHOOK_ERROR]", error);
        return new NextResponse(`Webhook Error: ${error}`, { status: 400 });
    }



    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;

            if (!session?.metadata?.userId) {
                return new NextResponse("User ID is required", { status: 400 });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subAny = subscription as any;
            const periodEnd = subAny.current_period_end
                ? subAny.current_period_end * 1000
                : Date.now() + 2592000000; // Fallback to 30 days if missing

            await convex.mutation(api.stripe.create, {
                userId: session.metadata.userId,
                stripeCustomerId: subscription.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: periodEnd,
            });
        }

        if (event.type === "invoice.payment_succeeded") {
            const invoice = event.data.object as Stripe.Invoice;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subscriptionId = typeof (invoice as any).subscription === 'string'
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (invoice as any).subscription
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                : ((invoice as any).subscription)?.id;

            if (!subscriptionId) {
                return new NextResponse(null, { status: 200 });
            }

            const subscription = await stripe.subscriptions.retrieve(
                subscriptionId as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subAny = subscription as any;
            const periodEnd = subAny.current_period_end
                ? subAny.current_period_end * 1000
                : Date.now() + 2592000000; // Fallback to 30 days if missing

            await convex.mutation(api.stripe.update, {
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: periodEnd,
            });
        }

        if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object as Stripe.Subscription;

            await convex.mutation(api.stripe.remove, {
                stripeSubscriptionId: subscription.id,
            });
        }

        if ((event.type as string) === "organization.created") {
            const { id, name, image_url } = event.data.object as unknown as { id: string; name: string; image_url: string };

            await convex.mutation(api.organizations.create, {
                orgId: id,
                name: name,
                imageUrl: image_url,
            });
        }

        if ((event.type as string) === "organization.updated") {
            const { id, name, image_url } = event.data.object as unknown as { id: string; name: string; image_url: string };

            await convex.mutation(api.organizations.update, {
                orgId: id,
                name: name,
                imageUrl: image_url,
            });
        }

        if ((event.type as string) === "organization.deleted") {
            const { id } = event.data.object as unknown as { id: string };

            await convex.mutation(api.organizations.deleteOrg, {
                orgId: id,
            });
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("[WEBHOOK_PROCESSING_ERROR]", error);
        return new NextResponse(JSON.stringify({ error: "Webhook processing failed", details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
