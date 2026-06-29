import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { PlanId } from "@/lib/plans";
import { GROWTH_PRICE, PRO_PRICE } from "@/lib/plans";
import { getUserSubscription } from "@/lib/subscription-db";
import { getStripe } from "@/lib/stripe";

const VALID_PLANS = new Set<PlanId>(["pro", "growth"]);

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe non configuré. Ajoutez STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Connectez-vous pour vous abonner." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { plan?: string };
  const plan = (body.plan === "growth" ? "growth" : "pro") as PlanId;

  if (!VALID_PLANS.has(plan)) {
    return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const priceId =
    plan === "growth"
      ? process.env.STRIPE_PRICE_ID_GROWTH ?? process.env.STRIPE_PRICE_ID
      : process.env.STRIPE_PRICE_ID_PRO ?? process.env.STRIPE_PRICE_ID;

  const existing = await getUserSubscription(user.id);
  const amount = plan === "growth" ? GROWTH_PRICE : PRO_PRICE;
  const productName = plan === "growth" ? "Morning Signal Growth" : "Morning Signal Pro";
  const productDesc =
    plan === "growth"
      ? "Tous les connecteurs + email matinal + rapports illimités"
      : "1 connecteur au choix + email matinal + rapports illimités";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan },
      subscription_data: {
        metadata: { user_id: user.id, plan },
      },
      customer: existing?.stripe_customer_id ?? undefined,
      customer_email: existing?.stripe_customer_id ? undefined : (user.email ?? undefined),
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: productName,
                  description: productDesc,
                },
                unit_amount: Math.round(amount * 100),
                recurring: { interval: "month" },
              },
              quantity: 1,
            },
          ],
      success_url: `${appUrl}/dashboard?upgraded=${plan}`,
      cancel_url: `${appUrl}/#tarifs`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Impossible de créer la session Stripe." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
