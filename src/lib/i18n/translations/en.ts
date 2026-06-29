export const en = {
  nav: {
    integrations: "Integrations",
    pricing: "Pricing",
    earlyAccess: "Early access",
  },
  hero: {
    badge: "Early access — free during beta",
    title: "The one thing",
    titleItalic: "your startup needs to know today",
    subtitle:
      "Every morning, Morning Signal turns your KPIs into a clear brief — overview, trends, risks, opportunities, and 3 concrete actions. One framework, zero dashboard overload.",
    cta: "Join early access",
    trust: "No credit card · no API · integrations coming soon",
    scroll: "Scroll to explore",
  },
  story: {
    scenes: [
      {
        kicker: "Before sunrise",
        title: "The one thing",
        titleItalic: "your startup needs to know today",
        titleLines: [
          { text: "The one thing" },
          { text: "your startup" },
          { text: "needs to know ", emphasis: "today" },
        ],
        text: "Stripe, GA, Meta, a dozen tabs. Monday morning, you still don't know what to do first.",
      },
      {
        kicker: "First light",
        title: "Your numbers,",
        titleItalic: "finally readable",
        text: "No more jumping between dashboards. Morning Signal gathers every KPI in one place.",
      },
      {
        kicker: "Sunrise",
        title: "One signal,",
        titleItalic: "every single morning",
        text: "It reads your KPIs and writes a single, structured brief — the same framework, every day.",
      },
      {
        kicker: "Golden hour",
        title: "Overview, trends,",
        titleItalic: "risks & opportunities",
        text: "A clear read on what's working, what's slipping, and where to push next.",
      },
      {
        kicker: "Daylight",
        title: "Know your",
        titleItalic: "3 moves for today",
        text: "Three concrete actions, ready in 30 seconds. No dashboard overload.",
      },
    ],
  },
  stats: [
    {
      value: "5h+",
      label: "spent on average by founders analyzing metrics each week",
    },
    {
      value: "73%",
      label: "say they don't know what to prioritize each day",
    },
    {
      value: "30s",
      label: "to get today's signal with Morning Signal",
    },
  ],
  problem: {
    title: "You have Stripe, GA and Meta Ads.",
    titleItalic: "Still no clarity.",
    p1: "Monday morning, you spent hours in your dashboards — and you still don't know what to do first. The competitor who knows today's priority has already moved ahead.",
    p2Prefix: "Founders with 3+ data sources spend on average",
    p2Highlight: "5h+ per week",
    p2Suffix:
      "analyzing metrics without a clear action plan. At early stage, one misprioritized day is a lost week.",
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        num: "1",
        title: "Enter your KPIs.",
        desc: "Revenue, users, conversion, ad spend — 30 seconds, no API or setup. Available with early access.",
      },
      {
        num: "2",
        title: "AI generates your report.",
        desc: "Overview, trends, risks, opportunities — via a fixed BI framework. Same structure, every time.",
      },
      {
        num: "3",
        title: "3 actions every morning.",
        desc: "A concrete action plan on your dashboard. Coming soon: auto sync with Stripe, Google Ads, Meta and daily email (Pro plan).",
      },
    ],
  },
  integrations: {
    title: "All your data.",
    titleItalic: "One recap.",
    subtitle:
      "Stripe, Google Ads, Meta Ads, Google Analytics and more — in development. Meanwhile, enter your KPIs manually and generate your recap today.",
    comingSoon: "Coming soon",
    available: "Available",
    growthOnly: "Growth plan",
    proChoice: "Your pick (Pro)",
    connected: "Connected",
    categories: {
      revenue: "Revenue",
      ads: "Advertising",
      analytics: "Analytics",
    },
    descriptions: {
      stripe: "Revenue, MRR, new customers and churn — automatic sync.",
      "google-ads": "Ad budget, CPC, conversions and ROAS imported daily.",
      "meta-ads": "Facebook & Instagram spend, leads and cost per acquisition.",
      "google-analytics": "Traffic, sessions, conversion rate and acquisition sources.",
      "linkedin-ads": "B2B campaigns, qualified leads and cost per lead.",
      shopify: "E-commerce revenue, orders and average cart value in real time.",
    },
  },
  pricing: {
    title: "Simple.",
    titleItalic: "Transparent.",
    subtitle:
      "Free to try. Pro: 1 connector of your choice. Growth: automate everything.",
    free: {
      badge: "Free",
      name: "Free",
      price: "€0",
      period: "3 reports / month",
      cta: "Create account",
      features: [
        "Manual KPI entry",
        "3 AI reports per month",
        "Morning signals on demand",
        "Zero-setup dashboard",
        "No morning email",
      ],
    },
    pro: {
      badge: "Popular",
      name: "Pro",
      period: "per month",
      cta: "Choose Pro",
      checkoutLoading: "Redirecting to Stripe...",
      checkoutError: "Could not start checkout.",
      features: [
        "Unlimited AI reports",
        "1 connector of your choice (Stripe, Meta, Google Ads…)",
        "Morning email with signals",
        "Revenue & new customers sync",
        "Priority support",
      ],
    },
    growth: {
      badge: "Full",
      name: "Growth",
      period: "per month",
      cta: "Choose Growth",
      features: [
        "Everything in Pro",
        "All connectors (Meta, Google Ads, GA…)",
        "Automatic morning email",
        "Full daily analysis",
        "Priority support",
      ],
    },
  },
  cta: {
    title: "30 seconds. A real report.",
    titleItalic: "Available now.",
    subtitle:
      "Early access is open: AI reports with manual entry, no API required. Automatic integrations will arrive with the Pro plan — join the waitlist to get notified.",
    primary: "Join early access",
    secondary: "View pricing",
    login: "Already have an account? Sign in",
  },
  footer: "Fixed framework. Variable data. Zero consulting.",
  feedback: {
    eyebrow: "Feedback",
    title: "Your opinion matters",
    p1: "To keep improving our service and offer you the best possible experience, we need your feedback.",
    p2: "Your suggestions help us build new features and optimize our platform to best support your company's growth.",
    emailLabel: "Email",
    emailPlaceholder: "you@startup.com",
    messageLabel: "Your message",
    messagePlaceholder: "A missing feature, an idea, a bug…",
    submit: "Send feedback",
    sending: "Sending…",
    success: "Thank you — your feedback has been sent.",
    error: "Could not send your message. Please try again later.",
  },
  waitlist: {
    cta: "Notify me when Pro launches",
    loading: "Signing up...",
    success: "✓ You'll be notified when integrations launch",
  },
};

export type Translations = typeof en;
