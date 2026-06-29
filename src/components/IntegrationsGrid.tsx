"use client";

import { integrations } from "@/lib/integrations";
import { IntegrationLogo } from "@/components/IntegrationLogo";
import { useOptionalLanguage } from "@/lib/i18n/context";
import { getTranslations } from "@/lib/i18n";
import type { PlanId } from "@/lib/plans";

interface IntegrationsGridProps {
  variant?: "marketing" | "dashboard";
  plan?: PlanId;
  connectedProviders?: string[];
}

const dashboardCategories = {
  revenue: "Revenu",
  ads: "Publicité",
  analytics: "Analytics",
};

export function IntegrationsGrid({
  variant = "marketing",
  plan = "free",
  connectedProviders = [],
}: IntegrationsGridProps) {
  const isMarketing = variant === "marketing";
  const lang = useOptionalLanguage();
  const i18n = lang?.t.integrations ?? getTranslations("fr").integrations;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map((integration) => {
        const description =
          i18n.descriptions[integration.id as keyof typeof i18n.descriptions] ??
          integration.description;
        const categoryLabel = isMarketing
          ? i18n.categories[integration.category]
          : dashboardCategories[integration.category];

        const isConnected = connectedProviders.includes(integration.id);
        const isLive = integration.status === "available";
        const isProChoice = plan === "pro" && !isConnected;
        const isGrowthUnlocked = plan === "growth" && isLive;

        let badge = i18n.comingSoon;
        let badgeClass = "bg-amber-50 text-amber-700 border border-amber-200";

        if (isConnected) {
          badge = i18n.connected;
          badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";
        } else if (isGrowthUnlocked || (plan === "pro" && isLive && isProChoice)) {
          badge = isProChoice ? i18n.proChoice : i18n.available;
          badgeClass = isProChoice
            ? "bg-violet-50 text-violet-700 border border-violet-200"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200";
        } else if (isProChoice) {
          badge = i18n.proChoice;
          badgeClass = "bg-violet-50 text-violet-700 border border-violet-200";
        } else if (plan === "growth") {
          badge = i18n.growthOnly;
          badgeClass = "bg-violet-50 text-violet-700 border border-violet-200";
        }

        return (
          <div
            key={integration.id}
            className={
              isMarketing
                ? "marketing-card p-5 relative"
                : "marketing-card p-5 relative shadow-sm"
            }
          >
            <span
              className={`absolute top-4 right-4 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${badgeClass}`}
            >
              {badge}
            </span>

            <div className="flex items-start justify-between mb-4 pr-16">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-zinc-100 p-2.5 shrink-0 opacity-90">
                <IntegrationLogo id={integration.id} className="w-full h-full" />
              </div>
            </div>

            <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full inline-block mb-3 text-zinc-400 bg-zinc-100">
              {categoryLabel}
            </span>

            <h3 className="font-medium mb-1.5 text-zinc-900">{integration.name}</h3>
            <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
          </div>
        );
      })}
    </div>
  );
}
