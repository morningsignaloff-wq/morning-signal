import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDailyReportEmail } from "@/lib/email";
import { isProStatus } from "@/lib/stripe";
import { hasMorningEmail } from "@/lib/plans";
import type { GeneratedReport } from "@/lib/types";
import type { PlanId } from "@/lib/plans";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  const results: { email: string; status: string }[] = [];

  for (const user of users.users) {
    if (!user.email) continue;

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle();

    const plan = (sub?.plan ?? "free") as PlanId;
    const active = sub && isProStatus(sub.status);

    if (!active || !hasMorningEmail(plan)) {
      results.push({ email: user.email, status: "skipped — free plan" });
      continue;
    }

    const { data: reports } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (!reports?.length) {
      results.push({ email: user.email, status: "skipped — no report" });
      continue;
    }

    const report = reports[0];
    const reportData: GeneratedReport = {
      priority_insights: report.priority_insights ?? [],
      business_overview: report.business_overview,
      key_trends: report.key_trends,
      risks_alerts: report.risks_alerts,
      opportunities: report.opportunities,
      daily_actions: report.daily_actions,
    };

    try {
      await sendDailyReportEmail(user.email, reportData);
      results.push({ email: user.email, status: `sent (${plan})` });
    } catch {
      results.push({ email: user.email, status: "failed" });
    }
  }

  return NextResponse.json({ sent: results.length, results });
}
