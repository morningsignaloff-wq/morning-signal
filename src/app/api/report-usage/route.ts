import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getReportUsage } from "@/lib/report-usage";
import { isPaidUser } from "@/lib/subscription-db";
import { FREE_REPORT_LIMIT } from "@/lib/usage";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [used, paid] = await Promise.all([getReportUsage(user.id), isPaidUser(user.id)]);

  return NextResponse.json({
    used,
    limit: paid ? null : FREE_REPORT_LIMIT,
    isPro: paid,
    isPaid: paid,
    remaining: paid ? null : Math.max(0, FREE_REPORT_LIMIT - used),
  });
}
