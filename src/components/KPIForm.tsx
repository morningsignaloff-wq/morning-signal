"use client";

import { useEffect, useState } from "react";
import type { KPIInput, Report } from "@/lib/types";
import { isLocalMode } from "@/lib/mode";
import { getSession } from "@/lib/local/auth";
import {
  canGenerateReport,
  getPreviousKpi,
  saveKpiEntry,
  saveReport,
} from "@/lib/local/store";
import { generateLocalReport } from "@/lib/local/report";
import { FREE_REPORT_LIMIT } from "@/lib/usage";

interface KPIFormProps {
  onReportGenerated: (report: Report) => void;
  usage?: { used: number; limit: number };
  onUsageChange?: () => void;
}

const fields = [
  {
    key: "revenue" as const,
    label: "Revenu mensuel",
    unit: "€",
    placeholder: "12000",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "new_users" as const,
    label: "Nouveaux utilisateurs",
    unit: "",
    placeholder: "540",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    key: "conversion_rate" as const,
    label: "Taux de conversion",
    unit: "%",
    placeholder: "2.1",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
  {
    key: "ad_spend" as const,
    label: "Budget pub",
    unit: "€",
    placeholder: "800",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.662.331a.75.75 0 01-.928 0l-.662-.331a1.125 1.125 0 01-.463-1.511c.4-.891.732-1.821.985-2.783m0 0V4.5m0 12.75V4.5" />
      </svg>
    ),
  },
];

export function KPIForm({
  onReportGenerated,
  usage,
  onUsageChange,
}: KPIFormProps) {
  const [form, setForm] = useState<KPIInput>({
    revenue: 0,
    new_users: 0,
    conversion_rate: 0,
    ad_spend: 0,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const local = isLocalMode();

  function updateField(field: keyof KPIInput, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: field === "notes" ? value : parseFloat(value) || 0,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (local) {
        const session = getSession();
        if (!session) throw new Error("Non authentifié");

        if (!canGenerateReport(session.id)) {
          throw new Error(
            `Limite atteinte : ${FREE_REPORT_LIMIT} rapports par mois sur le plan gratuit.`
          );
        }

        await new Promise((r) => setTimeout(r, 800));

        const previousKpi = getPreviousKpi(session.id);
        const kpiEntryId = saveKpiEntry(session.id, form);
        const generated = generateLocalReport(form, previousKpi);
        const report = saveReport(session.id, kpiEntryId, generated);

        onReportGenerated(report);
        onUsageChange?.();
        return;
      }

      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Échec de la génération du rapport");
      }

      onReportGenerated(data.report);
      onUsageChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {usage && (
        <p className="text-xs text-zinc-500">
          Plan gratuit —{" "}
          <span className="font-medium text-zinc-700">
            {usage.used}/{usage.limit} rapports ce mois-ci
          </span>
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, unit, placeholder, icon }) => (
          <div key={key}>
            <label htmlFor={key} className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
              <span className="text-violet-600">{icon}</span>
              {label}
            </label>
            <div className="relative">
              <input
                id={key}
                type="number"
                step="any"
                required
                value={form[key] || ""}
                onChange={(e) => updateField(key, e.target.value)}
                placeholder={placeholder}
                className="input-marketing pr-10"
              />
              {unit && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium">
                  {unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
          Notes <span className="text-zinc-400 normal-case">(optionnel)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          value={form.notes ?? ""}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Nouvelle landing page lancée, Google Ads en pause..."
          className="input-marketing resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-marketing justify-center !rounded-xl disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Génération du rapport...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Générer le rapport du jour
          </>
        )}
      </button>
    </form>
  );
}
