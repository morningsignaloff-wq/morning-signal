export interface Integration {
  id: string;
  name: string;
  description: string;
  category: "revenue" | "ads" | "analytics";
  status: "available" | "coming_soon";
}

export const integrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Revenu, MRR, nouveaux clients et churn — synchronisation automatique.",
    category: "revenue",
    status: "available",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Budget pub, CPC, conversions et ROAS importés chaque jour.",
    category: "ads",
    status: "coming_soon",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Dépenses Facebook & Instagram, leads et coût par acquisition.",
    category: "ads",
    status: "coming_soon",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Trafic, sessions, taux de conversion et sources d'acquisition.",
    category: "analytics",
    status: "coming_soon",
  },
  {
    id: "linkedin-ads",
    name: "LinkedIn Ads",
    description: "Campagnes B2B, leads qualifiés et coût par lead.",
    category: "ads",
    status: "coming_soon",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Revenu e-commerce, commandes et panier moyen en temps réel.",
    category: "revenue",
    status: "coming_soon",
  },
];

export const earlyAccessFeatures = [
  "Saisie manuelle des KPIs (30 secondes)",
  "Rapports IA structurés — framework fixe",
  "Vue d'ensemble, tendances, risques, 3 actions",
  "Dashboard sans configuration",
  "Gratuit pendant l'accès anticipé",
];

export const comingSoonProFeatures = [
  "Intégrations Stripe, Google Ads, Meta, GA…",
  "Sync KPIs chaque matin — fini le copier-coller",
  "Email récap quotidien",
  "Historique complet des rapports",
  "Support prioritaire",
];

export { PRO_PRICE, GROWTH_PRICE } from "@/lib/plans";

// Legacy aliases — à retirer quand Pro sera live
export const freeFeatures = earlyAccessFeatures;
export const proFeatures = comingSoonProFeatures;
