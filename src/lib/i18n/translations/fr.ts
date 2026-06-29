import type { Translations } from "./en";

export const fr: Translations = {
  nav: {
    integrations: "Intégrations",
    pricing: "Tarifs",
    earlyAccess: "Accès anticipé",
  },
  hero: {
    badge: "Accès anticipé — gratuit pendant la beta",
    title: "La seule chose",
    titleItalic: "que votre startup doit savoir aujourd'hui",
    subtitle:
      "Chaque matin, Morning Signal transforme vos KPIs en brief clair — vue d'ensemble, tendances, risques, opportunités, et 3 actions concrètes. Un framework, zéro surcharge de dashboards.",
    cta: "Rejoindre l'accès anticipé",
    trust: "Sans carte bancaire · sans API · intégrations à venir",
    scroll: "Défilez pour explorer",
  },
  story: {
    scenes: [
      {
        kicker: "Avant l'aube",
        title: "La seule chose",
        titleItalic: "que votre startup doit savoir aujourd'hui",
        titleLines: [
          { text: "La seule chose" },
          { text: "que votre startup" },
          { text: "doit savoir ", emphasis: "aujourd'hui" },
        ],
        text: "Stripe, GA, Meta, douze onglets. Lundi matin, vous ne savez toujours pas par où commencer.",
      },
      {
        kicker: "Les premières lueurs",
        title: "Vos chiffres,",
        titleItalic: "enfin lisibles",
        text: "Fini les allers-retours entre dashboards. Morning Signal réunit tous vos KPIs au même endroit.",
      },
      {
        kicker: "Le lever du jour",
        title: "Un signal,",
        titleItalic: "chaque matin",
        text: "Il lit vos KPIs et rédige un brief unique et structuré — le même framework, chaque jour.",
      },
      {
        kicker: "L'heure dorée",
        title: "Vue d'ensemble, tendances,",
        titleItalic: "risques & opportunités",
        text: "Une lecture claire de ce qui marche, ce qui décroche, et où pousser ensuite.",
      },
      {
        kicker: "Plein jour",
        title: "Vos",
        titleItalic: "3 actions du jour",
        text: "Trois actions concrètes, prêtes en 30 secondes. Sans surcharge de dashboards.",
      },
    ],
  },
  stats: [
    {
      value: "5h+",
      label: "de temps passé en moyenne par les fondateurs à analyser leurs métriques chaque semaine",
    },
    {
      value: "73%",
      label: "disent ne pas savoir quoi prioriser chaque jour",
    },
    {
      value: "30s",
      label: "pour obtenir le signal du jour avec Morning Signal",
    },
  ],
  problem: {
    title: "Vous avez Stripe, GA et Meta Ads.",
    titleItalic: "Toujours pas de clarté.",
    p1: "Lundi matin, vous avez passé des heures dans vos dashboards — et vous ne savez toujours pas quoi faire en premier. Le concurrent qui connaît sa priorité du jour a déjà avancé.",
    p2Prefix: "Les fondateurs avec 3+ sources de données passent en moyenne",
    p2Highlight: "5h+ par semaine",
    p2Suffix:
      "à analyser leurs métriques sans plan d'action clair. À stade early, un jour mal priorisé, c'est une semaine perdue.",
  },
  howItWorks: {
    title: "Comment ça marche",
    steps: [
      {
        num: "1",
        title: "Saisissez vos KPIs.",
        desc: "Revenu, utilisateurs, conversion, budget pub — 30 secondes, sans API ni configuration. Disponible dès l'accès anticipé.",
      },
      {
        num: "2",
        title: "L'IA génère votre rapport.",
        desc: "Vue d'ensemble, tendances, risques, opportunités — via un framework BI fixe. Même structure, à chaque fois.",
      },
      {
        num: "3",
        title: "3 actions chaque matin.",
        desc: "Un plan d'action concret sur votre dashboard. Bientôt : sync auto Stripe, Google Ads, Meta et email quotidien (plan Pro).",
      },
    ],
  },
  integrations: {
    title: "Toutes vos données.",
    titleItalic: "Un seul recap.",
    subtitle:
      "Stripe, Google Ads, Meta Ads, Google Analytics et plus — en cours de développement. En attendant, saisissez vos KPIs manuellement et générez votre recap dès aujourd'hui.",
    comingSoon: "À venir",
    available: "Disponible",
    growthOnly: "Plan Growth",
    proChoice: "Au choix (Pro)",
    connected: "Connecté",
    categories: {
      revenue: "Revenu",
      ads: "Publicité",
      analytics: "Analytics",
    },
    descriptions: {
      stripe: "Revenu, MRR, nouveaux clients et churn — synchronisation automatique.",
      "google-ads": "Budget pub, CPC, conversions et ROAS importés chaque jour.",
      "meta-ads": "Dépenses Facebook & Instagram, leads et coût par acquisition.",
      "google-analytics": "Trafic, sessions, taux de conversion et sources d'acquisition.",
      "linkedin-ads": "Campagnes B2B, leads qualifiés et coût par lead.",
      shopify: "Revenu e-commerce, commandes et panier moyen en temps réel.",
    },
  },
  pricing: {
    title: "Simple.",
    titleItalic: "Transparent.",
    subtitle:
      "Gratuit pour tester. Pro : 1 connecteur au choix. Growth : tout automatiser.",
    free: {
      badge: "Gratuit",
      name: "Free",
      price: "0€",
      period: "3 rapports / mois",
      cta: "Créer un compte",
      features: [
        "Saisie manuelle des KPIs",
        "3 rapports IA par mois",
        "Signaux du matin à la demande",
        "Dashboard sans configuration",
        "Pas d'email matinal",
      ],
    },
    pro: {
      badge: "Populaire",
      name: "Pro",
      period: "par mois",
      cta: "Choisir Pro",
      checkoutLoading: "Redirection Stripe...",
      checkoutError: "Impossible de lancer le paiement.",
      features: [
        "Rapports IA illimités",
        "1 connecteur au choix (Stripe, Meta, Google Ads…)",
        "Email matinal avec signaux",
        "Sync revenu & nouveaux clients",
        "Support prioritaire",
      ],
    },
    growth: {
      badge: "Complet",
      name: "Growth",
      period: "par mois",
      cta: "Choisir Growth",
      features: [
        "Tout le plan Pro",
        "Tous les connecteurs (Meta, Google Ads, GA…)",
        "Email matinal automatique",
        "Analyses quotidiennes complètes",
        "Support prioritaire",
      ],
    },
  },
  cta: {
    title: "30 secondes. Un vrai rapport.",
    titleItalic: "Dès maintenant.",
    subtitle:
      "L'accès anticipé est ouvert : rapports IA en saisie manuelle, sans API. Les intégrations automatiques arriveront avec le plan Pro — inscrivez-vous à la liste d'attente pour être prévenu.",
    primary: "Rejoindre l'accès anticipé",
    secondary: "Voir les tarifs",
    login: "Déjà un compte ? Se connecter",
  },
  footer: "Framework fixe. Données variables. Zéro consulting.",
  feedback: {
    eyebrow: "Retours",
    title: "Votre avis compte",
    p1: "Pour continuer à améliorer notre service et vous offrir la meilleure expérience possible, nous avons besoin de vos retours.",
    p2: "Vos suggestions nous permettent de développer de nouvelles fonctionnalités et d'optimiser notre plateforme afin de soutenir au mieux la croissance de votre entreprise.",
    emailLabel: "Email",
    emailPlaceholder: "vous@startup.com",
    messageLabel: "Votre message",
    messagePlaceholder: "Une fonctionnalité manquante, une idée, un bug…",
    submit: "Envoyer mon retour",
    sending: "Envoi…",
    success: "Merci — votre retour a bien été envoyé.",
    error: "Impossible d'envoyer le message. Réessayez plus tard.",
  },
  waitlist: {
    cta: "M'avertir au lancement Pro",
    loading: "Inscription...",
    success: "✓ Vous serez prévenu au lancement des intégrations",
  },
};
