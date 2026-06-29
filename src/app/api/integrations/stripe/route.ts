import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getConnectedIntegrations,
  removeStripeIntegration,
  saveStripeIntegration,
  userCanUseConnector,
} from "@/lib/subscription-db";
import { fetchStripeKPIs, validateStripeKey } from "@/lib/connectors/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const canUse = await userCanUseConnector(user.id, "stripe");
  if (!canUse) {
    const connected = await getConnectedIntegrations(user.id);
    if (connected.length > 0 && !connected.some((c) => c.provider === "stripe")) {
      return NextResponse.json(
        {
          error:
            "Plan Pro : 1 seul connecteur. Déconnectez l'autre source ou passez au plan Growth.",
        },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Connecteur disponible avec le plan Pro (1 au choix) ou Growth." },
      { status: 403 }
    );
  }

  const body = (await request.json()) as { secretKey?: string };
  const secretKey = body.secretKey?.trim();

  if (!secretKey || (!secretKey.startsWith("sk_") && !secretKey.startsWith("rk_"))) {
    return NextResponse.json(
      { error: "Clé API Stripe invalide (sk_ ou rk_ requis)." },
      { status: 400 }
    );
  }

  const valid = await validateStripeKey(secretKey);
  if (!valid) {
    return NextResponse.json({ error: "Impossible de valider la clé Stripe." }, { status: 400 });
  }

  await saveStripeIntegration(user.id, secretKey);

  try {
    const kpis = await fetchStripeKPIs(secretKey);
    return NextResponse.json({
      ok: true,
      preview: kpis,
    });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  await removeStripeIntegration(user.id);
  return NextResponse.json({ ok: true });
}
