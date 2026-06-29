import { Resend } from "resend";
import type { GeneratedReport } from "./types";
import { BRAND_NAME, BRAND_SLOGAN } from "./brand";
import { formatInsightLine, normalizeInsights } from "./insights";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(key);
}

export async function sendDailyReportEmail(
  to: string,
  report: GeneratedReport
) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? `${BRAND_NAME} <onboarding@resend.dev>`;
  const insights = normalizeInsights(report.priority_insights);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const insightsHtml =
    insights.length > 0
      ? `
      <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #7c3aed; margin-bottom: 16px;">
        Vos signaux du matin
      </h2>
      <ul style="list-style: none; padding: 0; margin: 0 0 32px 0;">
        ${insights
          .map(
            (insight) => `
          <li style="margin-bottom: 12px; padding: 14px 16px; background: #f8f6ff; border-radius: 10px; border-left: 4px solid #7c3aed; font-size: 15px; line-height: 1.45;">
            ${formatInsightLine(insight)}
          </li>`
          )
          .join("")}
      </ul>`
      : "";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">${BRAND_NAME}</h1>
      <p style="color: #666; margin-bottom: 32px;">${BRAND_SLOGAN}</p>

      ${insightsHtml}

      <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #888;">Plan d'action</h2>
      <ol style="margin-bottom: 32px; padding-left: 20px;">
        ${report.daily_actions.map((action) => `<li style="margin-bottom: 8px;">${action}</li>`).join("")}
      </ol>

      <p style="color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 16px;">
        <a href="${appUrl}/dashboard" style="color: #6366f1;">Voir l'analyse complète dans le dashboard</a>
      </p>
    </div>
  `;

  const count = insights.length || 3;

  return resend.emails.send({
    from,
    to,
    subject: `${count} signaux ${BRAND_NAME} — ${new Date().toLocaleDateString("fr-FR")}`,
    html,
  });
}
