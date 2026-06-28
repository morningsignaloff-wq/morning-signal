import Stripe from "stripe";
import { NextResponse } from "next/server";
import { PRO_PRICE } from "@/lib/integrations";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST() {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe non configuré. Ajoutez STRIPE_SECRET_KEY dans .env.local" },
      { status: 503 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const priceId = process.env.STRIPE_PRICE_ID;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "Morning Signal Pro",
                  description: "Intégrations auto + rapports IA illimités",
                },
                unit_amount: Math.round(PRO_PRICE * 100),
                recurring: { interval: "month" },
              },
              quantity: 1,
            },
          ],
      success_url: `${appUrl}/dashboard?upgraded=1`,
      cancel_url: `${appUrl}/#tarifs`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
