import { Resend } from "resend";
import type { GeneratedReport } from "./types";
import { BRAND_NAME, BRAND_SLOGAN } from "./brand";

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

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">${BRAND_NAME}</h1>
      <p style="color: #666; margin-bottom: 32px;">${BRAND_SLOGAN}</p>

      <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #888;">Business Overview</h2>
      <p style="margin-bottom: 24px;">${report.business_overview}</p>

      <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #888;">Key Trends</h2>
      <p style="margin-bottom: 24px;">${report.key_trends}</p>

      <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #888;">Risks / Alerts</h2>
      <p style="margin-bottom: 24px;">${report.risks_alerts}</p>

      <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #888;">Opportunities</h2>
      <p style="margin-bottom: 24px;">${report.opportunities}</p>

      <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #888;">Daily Action Plan</h2>
      <ol style="margin-bottom: 32px; padding-left: 20px;">
        ${report.daily_actions.map((action) => `<li style="margin-bottom: 8px;">${action}</li>`).join("")}
      </ol>

      <p style="color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 16px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard" style="color: #6366f1;">View full report in dashboard</a>
      </p>
    </div>
  `;

  return resend.emails.send({
    from,
    to,
    subject: `Your ${BRAND_NAME} for today`,
    html,
  });
}
