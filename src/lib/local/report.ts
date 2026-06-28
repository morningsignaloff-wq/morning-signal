import type { GeneratedReport, KPIInput } from "@/lib/types";

function euro(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function pctChange(current: number, previous: number): string {
  if (previous === 0) return "N/A";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function generateLocalReport(
  kpi: KPIInput,
  previous?: KPIInput
): GeneratedReport {
  const cac = kpi.ad_spend / Math.max(kpi.new_users, 1);
  const revenuePerUser = kpi.revenue / Math.max(kpi.new_users, 1);
  const paybackMonths = cac / Math.max(revenuePerUser / 12, 0.01);

  const business_overview = [
    `Revenu mensuel : ${euro(kpi.revenue)}.`,
    `${kpi.new_users} nouveaux utilisateurs acquis avec un taux de conversion de ${kpi.conversion_rate}%.`,
    `Budget pub : ${euro(kpi.ad_spend)} (CAC : ${euro(cac)}).`,
    kpi.notes ? `Contexte : ${kpi.notes}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  let key_trends: string;
  if (previous) {
    key_trends = [
      `Revenu ${pctChange(kpi.revenue, previous.revenue)} vs dernière saisie.`,
      `Nouveaux utilisateurs ${pctChange(kpi.new_users, previous.new_users)}.`,
      `Conversion ${pctChange(kpi.conversion_rate, previous.conversion_rate)}.`,
      `Budget pub ${pctChange(kpi.ad_spend, previous.ad_spend)}.`,
    ].join(" ");
  } else {
    key_trends =
      "Premier point de données enregistré. Revenez demain avec des KPIs mis à jour pour débloquer l'analyse de tendances.";
  }

  const risks: string[] = [];
  if (cac > revenuePerUser && kpi.new_users > 0) {
    risks.push(`Le CAC (${euro(cac)}) dépasse le revenu par utilisateur (${euro(revenuePerUser)}) — l'acquisition n'est pas rentable.`);
  }
  if (kpi.conversion_rate < 1) {
    risks.push(`Taux de conversion inférieur à 1% (${kpi.conversion_rate}%) — fuite probable sur la landing ou l'onboarding.`);
  }
  if (kpi.ad_spend > kpi.revenue * 0.5 && kpi.revenue > 0) {
    risks.push(`Le budget pub représente plus de 50% du revenu — burn élevé sur l'acquisition.`);
  }
  if (paybackMonths > 12 && kpi.new_users > 0) {
    risks.push(`Le retour sur CAC estimé dépasse 12 mois — croissance potentiellement non durable.`);
  }
  const risks_alerts =
    risks.length > 0
      ? risks.join(" ")
      : "Aucune alerte critique sur les métriques actuelles. Continuez à surveiller le CAC et la conversion chaque semaine.";

  const opportunities: string[] = [];
  if (kpi.conversion_rate >= 2) {
    opportunities.push(`Bonne conversion (${kpi.conversion_rate}%) — scalez vos canaux d'acquisition les plus performants.`);
  }
  if (previous && kpi.ad_spend < previous.ad_spend && kpi.new_users >= previous.new_users) {
    opportunities.push("Efficacité pub améliorée : plus d'utilisateurs pour moins de budget. Doublez la mise sur vos créas actuelles.");
  }
  if (kpi.revenue > 0 && kpi.ad_spend / kpi.revenue < 0.2) {
    opportunities.push("Ratio pub/revenu faible — marge pour augmenter le budget pub et accélérer la croissance.");
  }
  opportunities.push("Testez un nouveau canal d'acquisition cette semaine pour diversifier vos sources.");
  const opportunitiesText = opportunities.slice(0, 2).join(" ");

  const daily_actions: [string, string, string] = [
    cac > revenuePerUser
      ? `Pausez ou réduisez les campagnes pub les moins rentables. Visez un CAC inférieur à ${euro(revenuePerUser * 0.3)}.`
      : `Analysez vos 3 principales sources de trafic et réallouez 20% du budget vers la meilleure.`,
    kpi.conversion_rate < 2
      ? `Auditez votre funnel : temps de chargement, clarté du CTA, et points de drop-off à l'inscription.`
      : `Documentez ce qui fonctionne dans votre funnel et créez un playbook reproductible pour l'équipe.`,
    previous
      ? `Comparez les chiffres de cette semaine à la dernière saisie et mettez à jour votre objectif de croissance.`
      : `Fixez une baseline : visez +10% sur la conversion ou le CAC dans les 30 prochains jours.`,
  ];

  return {
    business_overview,
    key_trends,
    risks_alerts,
    opportunities: opportunitiesText,
    daily_actions,
  };
}
