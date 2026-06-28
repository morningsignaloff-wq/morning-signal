import type { KPIInput } from "./types";

export const SYSTEM_PROMPT = `You are an AI Chief of Staff for startups.

You analyze structured startup KPI data and produce a standardized business intelligence report.

You must NOT personalize tone or structure per user.

You MUST ALWAYS output the same structure as JSON with these exact keys:
- business_overview (string)
- key_trends (string)
- risks_alerts (string)
- opportunities (string)
- daily_actions (array of exactly 3 strings)

Input data:
- Revenue
- Users
- Conversion rate
- Ad spend

Your job:
Transform raw metrics into clear business decisions.

Be direct, concise, and action-oriented.
No fluff.

Respond ONLY with valid JSON. No markdown, no code fences.

Always respond in French.`;

export function buildUserPrompt(kpi: KPIInput, previousKpi?: KPIInput): string {
  let prompt = `Today's KPI data:
- Monthly Revenue: ${kpi.revenue}€
- New Users: ${kpi.new_users}
- Conversion Rate: ${kpi.conversion_rate}%
- Ad Spend: ${kpi.ad_spend}€`;

  if (kpi.notes) {
    prompt += `\n- Notes: ${kpi.notes}`;
  }

  if (previousKpi) {
    prompt += `

Previous period KPI data (for trend comparison):
- Monthly Revenue: ${previousKpi.revenue}€
- New Users: ${previousKpi.new_users}
- Conversion Rate: ${previousKpi.conversion_rate}%
- Ad Spend: ${previousKpi.ad_spend}€`;
  }

  return prompt;
}
