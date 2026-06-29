import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateReport } from "@/lib/openai";
import {
  assertCanGenerateReport,
  incrementReportUsage,
} from "@/lib/report-usage";
import { fetchStripeKPIs } from "@/lib/connectors/stripe";
import {
  getStripeSecretKey,
  userCanUseConnector,
} from "@/lib/subscription-db";
import type { KPIInput } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await assertCanGenerateReport(user.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Limite atteinte";
    return NextResponse.json({ error: message }, { status: 429 });
  }

  const body = (await request.json()) as KPIInput;

  let kpiInput: KPIInput = { ...body };

  const canStripe = await userCanUseConnector(user.id, "stripe");
  if (canStripe) {
    const stripeKey = await getStripeSecretKey(user.id);
    if (stripeKey) {
      try {
        const stripeData = await fetchStripeKPIs(stripeKey);
        kpiInput = {
          ...kpiInput,
          revenue: stripeData.revenue || kpiInput.revenue,
          new_users: stripeData.new_customers || kpiInput.new_users,
          notes: [
            kpiInput.notes,
            `[Stripe sync] Revenu 30j: ${stripeData.revenue}€, ${stripeData.new_customers} nouveaux clients.`,
          ]
            .filter(Boolean)
            .join(" "),
        };
      } catch {
        // Continue with manual KPIs if Stripe fetch fails
      }
    }
  }

  if (
    kpiInput.revenue == null ||
    kpiInput.new_users == null ||
    kpiInput.conversion_rate == null ||
    kpiInput.ad_spend == null
  ) {
    return NextResponse.json(
      { error: "Missing required KPI fields" },
      { status: 400 }
    );
  }

  const { data: previousEntries } = await supabase
    .from("kpi_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const previousKpi = previousEntries?.[0] as KPIInput | undefined;

  const { data: kpiEntry, error: kpiError } = await supabase
    .from("kpi_entries")
    .insert({
      user_id: user.id,
      revenue: kpiInput.revenue,
      new_users: kpiInput.new_users,
      conversion_rate: kpiInput.conversion_rate,
      ad_spend: kpiInput.ad_spend,
      notes: kpiInput.notes ?? null,
    })
    .select()
    .single();

  if (kpiError) {
    return NextResponse.json({ error: kpiError.message }, { status: 500 });
  }

  try {
    const report = await generateReport(kpiInput, previousKpi);

    const { data: savedReport, error: reportError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        kpi_entry_id: kpiEntry.id,
        priority_insights: report.priority_insights,
        business_overview: report.business_overview,
        key_trends: report.key_trends,
        risks_alerts: report.risks_alerts,
        opportunities: report.opportunities,
        daily_actions: report.daily_actions,
      })
      .select()
      .single();

    if (reportError) {
      return NextResponse.json({ error: reportError.message }, { status: 500 });
    }

    await incrementReportUsage(user.id);

    return NextResponse.json({ report: savedReport });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Report generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
