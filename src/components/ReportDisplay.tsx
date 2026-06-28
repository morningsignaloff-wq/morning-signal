import type { Report } from "@/lib/types";

interface ReportDisplayProps {
  report: Report;
}

const sections = [
  {
    key: "business_overview" as const,
    title: "Vue d'ensemble",
    border: "border-l-violet-400",
    dot: "bg-violet-500",
    iconBg: "bg-violet-50 border border-violet-100",
    iconColor: "text-violet-600",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    key: "key_trends" as const,
    title: "Tendances clés",
    border: "border-l-blue-400",
    dot: "bg-blue-500",
    iconBg: "bg-blue-50 border border-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    key: "risks_alerts" as const,
    title: "Risques / Alertes",
    border: "border-l-amber-400",
    dot: "bg-amber-500",
    iconBg: "bg-amber-50 border border-amber-100",
    iconColor: "text-amber-600",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    key: "opportunities" as const,
    title: "Opportunités",
    border: "border-l-emerald-400",
    dot: "bg-emerald-500",
    iconBg: "bg-emerald-50 border border-emerald-100",
    iconColor: "text-emerald-600",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-8.973-5.478.75.75 0 00-1.152-.082A9 9 0 1015.9 18.75c-.5.478-.985.926-1.5 1.322m-3.75-1.942V18" />
      </svg>
    ),
  },
];

export function ReportDisplay({ report }: ReportDisplayProps) {
  const date = new Date(report.created_at).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-1">
            Rapport du jour
          </p>
          <h2 className="text-xl font-medium text-zinc-900 capitalize">{date}</h2>
        </div>
        <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="grid gap-3">
        {sections.map(({ key, title, border, dot, iconBg, iconColor, icon }) => (
          <div
            key={key}
            className={`report-section-card p-5 border-l-4 ${border}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
                {icon}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                <h3 className="text-sm font-medium text-zinc-800">{title}</h3>
              </div>
            </div>
            <p className="text-zinc-600 leading-relaxed text-sm pl-11">
              {report[key]}
            </p>
          </div>
        ))}

        <div className="dashboard-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white border border-violet-200 flex items-center justify-center text-violet-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-violet-900">Plan d&apos;action du jour</h3>
          </div>
          <ol className="space-y-3">
            {report.daily_actions.map((action, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-zinc-700 leading-relaxed">{action}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
