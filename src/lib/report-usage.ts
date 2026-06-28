import { createClient } from "@/lib/supabase/server";
import { FREE_REPORT_LIMIT, getCurrentMonthKey } from "@/lib/usage";

export async function getReportUsage(userId: string): Promise<number> {
  const supabase = await createClient();
  const month = getCurrentMonthKey();

  const { data } = await supabase
    .from("report_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle();

  return data?.count ?? 0;
}

export async function incrementReportUsage(userId: string): Promise<void> {
  const supabase = await createClient();
  const month = getCurrentMonthKey();
  const current = await getReportUsage(userId);

  const { error } = await supabase.from("report_usage").upsert(
    {
      user_id: userId,
      month,
      count: current + 1,
    },
    { onConflict: "user_id,month" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function assertCanGenerateReport(userId: string): Promise<void> {
  const used = await getReportUsage(userId);
  if (used >= FREE_REPORT_LIMIT) {
    throw new Error(
      `Limite atteinte : ${FREE_REPORT_LIMIT} rapports par mois sur le plan gratuit.`
    );
  }
}
