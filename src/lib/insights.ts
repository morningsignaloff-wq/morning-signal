import type { PriorityInsight, PriorityInsightType } from "./types";

export const INSIGHT_EMOJI: Record<PriorityInsightType, string> = {
  growth: "📈",
  warning: "⚠️",
  alert: "🚨",
  tip: "💡",
};

const VALID_TYPES = new Set<PriorityInsightType>(["growth", "warning", "alert", "tip"]);

export function normalizeInsights(raw: unknown): PriorityInsight[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (item): item is PriorityInsight =>
        typeof item === "object" &&
        item !== null &&
        VALID_TYPES.has((item as PriorityInsight).type) &&
        typeof (item as PriorityInsight).text === "string" &&
        (item as PriorityInsight).text.trim().length > 0
    )
    .map((item) => ({
      type: item.type,
      text: item.text.trim(),
    }))
    .slice(0, 5);
}

export function formatInsightLine(insight: PriorityInsight): string {
  return `${INSIGHT_EMOJI[insight.type]} ${insight.text}`;
}
