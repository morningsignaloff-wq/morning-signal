import type { KPIInput, Report } from "@/lib/types";
import { FREE_REPORT_LIMIT, getCurrentMonthKey } from "@/lib/usage";

function kpiKey(userId: string) {
  return `asp_kpi_${userId}`;
}

function reportsKey(userId: string) {
  return `asp_reports_${userId}`;
}

export function getPreviousKpi(userId: string): KPIInput | undefined {
  const entries = getKpiEntries(userId);
  return entries[0] ?? undefined;
}

export function getKpiEntries(userId: string): KPIInput[] {
  try {
    return JSON.parse(localStorage.getItem(kpiKey(userId)) ?? "[]");
  } catch {
    return [];
  }
}

export function saveKpiEntry(userId: string, kpi: KPIInput): string {
  const entries = getKpiEntries(userId);
  const id = crypto.randomUUID();
  const entry = { ...kpi, id, created_at: new Date().toISOString() };
  localStorage.setItem(kpiKey(userId), JSON.stringify([entry, ...entries]));
  return id;
}

export function getLatestReport(userId: string): Report | null {
  const reports = getReports(userId);
  return reports[0] ?? null;
}

export function getReports(userId: string): Report[] {
  try {
    return JSON.parse(localStorage.getItem(reportsKey(userId)) ?? "[]");
  } catch {
    return [];
  }
}

export function getReportCountThisMonth(userId: string): number {
  const month = getCurrentMonthKey();
  return getReports(userId).filter(
    (r) => getCurrentMonthKey(new Date(r.created_at)) === month
  ).length;
}

export function canGenerateReport(userId: string): boolean {
  return getReportCountThisMonth(userId) < FREE_REPORT_LIMIT;
}

export function saveReport(
  userId: string,
  kpiEntryId: string,
  report: Omit<Report, "id" | "user_id" | "kpi_entry_id" | "created_at">
): Report {
  const saved: Report = {
    ...report,
    id: crypto.randomUUID(),
    user_id: userId,
    kpi_entry_id: kpiEntryId,
    created_at: new Date().toISOString(),
  };

  const reports = getReports(userId);
  localStorage.setItem(reportsKey(userId), JSON.stringify([saved, ...reports]));
  return saved;
}
