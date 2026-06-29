import { NextResponse } from "next/server";
import Stripe from "stripe";
import { upsertSubscription } from "@/lib/subscription-db";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanId } from "@/lib/plans";

export const runtime = "nodejs";

async function resolveUserId(subscription: Stripe.Subscription): Promise<string | null> {
  if (subscription.metadata.user_id) {
    return subscription.metadata.user_id;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return data?.user_id ?? null;
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const userId = await resolveUserId(subscription);

  if (!userId) {
    console.error("Stripe webhook: missing user_id for subscription", subscription.id);
    return;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const periodEnd = subscription.items.data[0]?.current_period_end;
  const planMeta = subscription.metadata.plan;
  const plan: PlanId | undefined =
    planMeta === "growth" || planMeta === "pro" ? planMeta : undefined;

  await upsertSubscription({
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    plan,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook non configuré." }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature invalide";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.user_id ?? session.client_reference_id;
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!userId || !customerId) break;

        const sessionPlan = session.metadata?.plan;
        const plan: PlanId | undefined =
          sessionPlan === "growth" || sessionPlan === "pro" ? sessionPlan : undefined;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await syncSubscription(subscription);
        } else {
          await upsertSubscription({
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: null,
            status: "active",
            plan,
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(subscription);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    console.error("Stripe webhook error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
