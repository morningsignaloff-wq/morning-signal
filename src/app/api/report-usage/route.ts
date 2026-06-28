import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getReportUsage } from "@/lib/report-usage";
import { FREE_REPORT_LIMIT } from "@/lib/usage";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const used = await getReportUsage(user.id);

  return NextResponse.json({
    used,
    limit: FREE_REPORT_LIMIT,
    remaining: Math.max(0, FREE_REPORT_LIMIT - used),
  });
}
