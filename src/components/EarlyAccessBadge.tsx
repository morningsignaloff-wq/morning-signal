interface EarlyAccessBadgeProps {
  variant?: "marketing" | "dashboard";
  label?: string;
}

const dashboardLabel = "Early access — integrations coming soon";
const marketingLabelDefault = "Early access — free during beta";

export function EarlyAccessBadge({
  variant = "marketing",
  label,
}: EarlyAccessBadgeProps) {
  const text = label ?? (variant === "dashboard" ? dashboardLabel : marketingLabelDefault);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-medium text-violet-700">
      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
      {text}
    </div>
  );
}
