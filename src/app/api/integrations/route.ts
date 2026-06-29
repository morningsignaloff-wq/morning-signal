import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getConnectedIntegrations,
  getStripeIntegration,
  getUserPlan,
} from "@/lib/subscription-db";
import { getConnectorLimit } from "@/lib/plans";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(user.id);
  const connected = await getConnectedIntegrations(user.id);
  const stripe = connected.find((c) => c.provider === "stripe") ?? (await getStripeIntegration(user.id));

  return NextResponse.json({
    plan,
    connectorLimit: getConnectorLimit(plan),
    connectedProviders: connected.map((c) => c.provider),
    stripe: {
      connected: Boolean(stripe),
      connectedAt: stripe?.connected_at ?? null,
      canConnect: plan === "pro" || plan === "growth",
    },
  });
}
