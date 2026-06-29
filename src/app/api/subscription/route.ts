import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getReportUsage } from "@/lib/report-usage";
import { getConnectedIntegrations, getUserPlan, getUserSubscription, isPaidUser } from "@/lib/subscription-db";
import { FREE_REPORT_LIMIT } from "@/lib/usage";
import { getConnectorLimit, hasMorningEmail } from "@/lib/plans";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [used, paid, plan, subscription, connected] = await Promise.all([
    getReportUsage(user.id),
    isPaidUser(user.id),
    getUserPlan(user.id),
    getUserSubscription(user.id),
    getConnectedIntegrations(user.id),
  ]);

  return NextResponse.json({
    plan,
    isPro: paid,
    isPaid: paid,
    morningEmail: hasMorningEmail(plan),
    connectorLimit: getConnectorLimit(plan),
    connectedProviders: connected.map((c) => c.provider),
    stripeConnected: connected.some((c) => c.provider === "stripe"),
    used,
    limit: paid ? null : FREE_REPORT_LIMIT,
    remaining: paid ? null : Math.max(0, FREE_REPORT_LIMIT - used),
    status: subscription?.status ?? null,
    currentPeriodEnd: subscription?.current_period_end ?? null,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
  });
}
