export type PlanId = "free" | "pro" | "growth";

export const PRO_PRICE = 29;
export const GROWTH_PRICE = 59;

export const ALL_CONNECTOR_IDS = [
  "stripe",
  "google-ads",
  "meta-ads",
  "google-analytics",
  "linkedin-ads",
  "shopify",
] as const;

export type ConnectorId = (typeof ALL_CONNECTOR_IDS)[number];

export const PLAN_LIMITS = {
  free: {
    reportsPerMonth: 3,
    connectorLimit: 0,
    morningEmail: false,
  },
  pro: {
    reportsPerMonth: null as number | null,
    connectorLimit: 1,
    morningEmail: true,
  },
  growth: {
    reportsPerMonth: null as number | null,
    connectorLimit: null as number | null,
    morningEmail: true,
  },
} as const;

export function formatPlanPrice(plan: "pro" | "growth", locale: "fr" | "en" = "fr"): string {
  const amount = plan === "pro" ? PRO_PRICE : GROWTH_PRICE;
  if (locale === "fr") {
    return `${amount.toFixed(0)}€`;
  }
  return `€${amount.toFixed(0)}`;
}

export function getConnectorLimit(plan: PlanId): number | null {
  return PLAN_LIMITS[plan].connectorLimit;
}

export function isConnectorInCatalog(connectorId: string): boolean {
  return (ALL_CONNECTOR_IDS as readonly string[]).includes(connectorId);
}

/** Plan allows this connector type in the catalog */
export function canAccessConnector(plan: PlanId, connectorId: string): boolean {
  if (plan === "free") return false;
  return isConnectorInCatalog(connectorId);
}

export function hasMorningEmail(plan: PlanId): boolean {
  return PLAN_LIMITS[plan].morningEmail;
}
