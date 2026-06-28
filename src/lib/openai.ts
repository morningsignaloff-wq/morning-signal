import OpenAI from "openai";
import type { GeneratedReport, KPIInput } from "./types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey: key });
}

export async function generateReport(
  kpi: KPIInput,
  previousKpi?: KPIInput
): Promise<GeneratedReport> {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(kpi, previousKpi) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(content) as GeneratedReport;

  if (
    !parsed.business_overview ||
    !parsed.key_trends ||
    !parsed.risks_alerts ||
    !parsed.opportunities ||
    !Array.isArray(parsed.daily_actions) ||
    parsed.daily_actions.length !== 3
  ) {
    throw new Error("Invalid report structure from OpenAI");
  }

  return parsed;
}
