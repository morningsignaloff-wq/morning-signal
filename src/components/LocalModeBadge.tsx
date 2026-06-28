export function LocalModeBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      Mode local — aucune API requise
    </div>
  );
}
