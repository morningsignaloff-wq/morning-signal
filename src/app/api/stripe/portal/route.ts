import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "@/lib/subscription-db";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const sub = await getUserSubscription(user.id);
  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "Aucun abonnement Stripe trouvé." }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
