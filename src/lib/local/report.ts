import type { GeneratedReport, KPIInput, PriorityInsight } from "@/lib/types";

function euro(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function fmtPct(change: number | null): string {
  if (change === null) return "";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(0)} %`;
}

function parseChannelNotes(notes?: string): { meta?: number; google?: number } {
  if (!notes) return {};
  const meta = notes.match(/meta[^0-9]*(\d+)/i);
  const google = notes.match(/google[^0-9]*(\d+)/i);
  return {
    meta: meta ? Number(meta[1]) : undefined,
    google: google ? Number(google[1]) : undefined,
  };
}

export function generateLocalReport(
  kpi: KPIInput,
  previous?: KPIInput
): GeneratedReport {
  const cac = kpi.ad_spend / Math.max(kpi.new_users, 1);
  const revenuePerUser = kpi.revenue / Math.max(kpi.new_users, 1);
  const channels = parseChannelNotes(kpi.notes);

  const revChange = previous ? pctChange(kpi.revenue, previous.revenue) : null;
  const convChange = previous
    ? pctChange(kpi.conversion_rate, previous.conversion_rate)
    : null;
  const cacPrev = previous
    ? previous.ad_spend / Math.max(previous.new_users, 1)
    : null;
  const cacChange = cacPrev ? pctChange(cac, cacPrev) : null;

  const priority_insights: PriorityInsight[] = [];

  if (revChange !== null && revChange >= 5) {
    priority_insights.push({
      type: "growth",
      text: `Revenu ${fmtPct(revChange)} depuis la dernière saisie — dynamique positive sur le MRR.`,
    });
  } else if (revChange !== null && revChange <= -5) {
    priority_insights.push({
      type: "alert",
      text: `Revenu ${fmtPct(revChange)} depuis la dernière saisie — investiguer le churn ou le pipeline.`,
    });
  } else if (!previous) {
    priority_insights.push({
      type: "growth",
      text: `Baseline établie : ${euro(kpi.revenue)} de revenu mensuel — revenez demain pour les tendances.`,
    });
  }

  if (cacChange !== null && cacChange >= 15) {
    const channel = channels.meta ? "Meta" : "l'acquisition";
    priority_insights.push({
      type: "warning",
      text: `Le coût d'acquisition ${channel} a augmenté de ${fmtPct(cacChange).trim()} depuis la dernière saisie.`,
    });
  }

  if (convChange !== null && convChange <= -10) {
    const page = /pricing|tarif/i.test(kpi.notes ?? "") ? "page Pricing" : "funnel";
    priority_insights.push({
      type: "alert",
      text: `Le taux de conversion a chuté de ${Math.abs(convChange).toFixed(0)} % sur la ${page}.`,
    });
  } else if (convChange !== null && convChange >= 10) {
    priority_insights.push({
      type: "growth",
      text: `Conversion ${fmtPct(convChange)} — le funnel convertit mieux qu'avant.`,
    });
  }

  if (channels.meta && channels.google) {
    const metaCac = channels.meta / Math.max(kpi.new_users * 0.5, 1);
    const googleCac = channels.google / Math.max(kpi.new_users * 0.5, 1);
    if (googleCac < metaCac * 0.85) {
      priority_insights.push({
        type: "tip",
        text: "Votre campagne Google Ads est désormais plus rentable que Meta — réallouez 20 % du budget.",
      });
    } else if (metaCac < googleCac * 0.85) {
      priority_insights.push({
        type: "tip",
        text: "Meta performe mieux que Google Ads cette période — doublez sur les créas gagnantes.",
      });
    }
  }

  if (cac > revenuePerUser && kpi.new_users > 0) {
    priority_insights.push({
      type: "alert",
      text: `CAC (${euro(cac)}) supérieur au revenu par utilisateur — l'acquisition n'est pas rentable.`,
    });
  }

  if (kpi.ad_spend > kpi.revenue * 0.5 && kpi.revenue > 0) {
    priority_insights.push({
      type: "warning",
      text: `Budget pub > 50 % du revenu (${euro(kpi.ad_spend)}) — surveillez le burn acquisition.`,
    });
  }

  if (priority_insights.length < 3) {
    priority_insights.push({
      type: "tip",
      text: `CAC actuel : ${euro(cac)} pour ${kpi.new_users} nouveaux users — documentez vos meilleures sources.`,
    });
  }
  if (priority_insights.length < 3) {
    priority_insights.push({
      type: "warning",
      text: "Ajoutez Meta / Google Ads dans les notes pour des insights canal par canal.",
    });
  }

  const business_overview = [
    `Revenu mensuel : ${euro(kpi.revenue)}.`,
    `${kpi.new_users} nouveaux utilisateurs, conversion ${kpi.conversion_rate}%.`,
    `Budget pub : ${euro(kpi.ad_spend)} (CAC : ${euro(cac)}).`,
  ].join(" ");

  let key_trends: string;
  if (previous) {
    key_trends = [
      `Revenu ${fmtPct(revChange)} vs dernière saisie.`,
      `Conversion ${fmtPct(convChange)}.`,
      `CAC ${fmtPct(cacChange)}.`,
    ].join(" ");
  } else {
    key_trends =
      "Premier point de données — les tendances s'activent dès la prochaine saisie.";
  }

  const risks_alerts =
    cac > revenuePerUser && kpi.new_users > 0
      ? `CAC non rentable. Conversion à ${kpi.conversion_rate}%.`
      : "Pas d'alerte critique sur les métriques actuelles.";

  const opportunities =
    kpi.conversion_rate >= 2
      ? `Bonne conversion (${kpi.conversion_rate}%) — scalez les canaux performants.`
      : "Testez une variante sur la page Pricing cette semaine.";

  const daily_actions: [string, string, string] = [
    priority_insights[0]?.text.includes("Google")
      ? "Réallouez 20 % du budget pub vers le canal le plus rentable."
      : `Analysez vos 3 sources de trafic — visez un CAC < ${euro(revenuePerUser * 0.3)}.`,
    convChange !== null && convChange < 0
      ? "Auditez la page Pricing : CTA, preuve sociale, temps de chargement."
      : "Documentez ce qui fonctionne dans le funnel pour l'équipe.",
    "Fixez un objectif chiffré pour la semaine (+10 % conversion ou -15 % CAC).",
  ];

  return {
    priority_insights: priority_insights.slice(0, 5),
    business_overview,
    key_trends,
    risks_alerts,
    opportunities,
    daily_actions,
  };
}
