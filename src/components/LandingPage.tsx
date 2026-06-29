"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MarketingLayout } from "@/components/MarketingLayout";
import { IntegrationsGrid } from "@/components/IntegrationsGrid";
import { PricingSection } from "@/components/PricingSection";
import { FeedbackSection } from "@/components/FeedbackSection";
import { Reveal } from "@/components/Reveal";
import { ScrollStory } from "@/components/ScrollStory";
import { SkyBackground } from "@/components/SkyBackground";
import { useLanguage } from "@/lib/i18n/context";
import { BRAND_NAME } from "@/lib/brand";

export function LandingPage() {
  const { t } = useLanguage();

  return (
    <MarketingLayout>
      {/* Animated sunrise behind the whole page */}
      <SkyBackground />

      <div className="sky-content">
      {/* ── Scroll-scrubbed sunrise hero ── */}
      <ScrollStory />

      {/* ── Stats ── */}
      <section className="marketing-tint-violet">
        <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {t.stats.map(({ value, label }, i) => (
            <Reveal key={value} delay={i * 100}>
              <div className="marketing-stat-card text-center sm:text-left">
                <p className="marketing-stat">{value}</p>
                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="marketing-divider marketing-tint-blue">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <Reveal>
            <div className="marketing-problem-card text-center">
              <h2 className="marketing-section-heading">
                {t.problem.title}{" "}
                <span className="serif-italic">{t.problem.titleItalic}</span>
              </h2>

              <p className="mt-8 text-lg text-zinc-700 leading-relaxed">{t.problem.p1}</p>

              <p className="mt-6 text-base text-zinc-600 leading-relaxed">
                {t.problem.p2Prefix}{" "}
                <strong className="text-zinc-800 font-medium">{t.problem.p2Highlight}</strong>{" "}
                {t.problem.p2Suffix}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="marketing-divider marketing-tint-mint">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <Reveal>
            <h2 className="marketing-section-heading text-center mb-16">{t.howItWorks.title}</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.howItWorks.steps.map(({ num, title, desc }, i) => (
              <Reveal key={num} delay={i * 120}>
                <div className="marketing-step-card">
                  <p className="step-number">{num}</p>
                  <h3 className="text-lg font-medium text-zinc-900 mb-3">{title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integrations ── */}
      <section id="integrations" className="marketing-divider marketing-tint-blue">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="marketing-section-heading">
                {t.integrations.title}{" "}
                <span className="serif-italic">{t.integrations.titleItalic}</span>
              </h2>
              <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">{t.integrations.subtitle}</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <IntegrationsGrid variant="marketing" plan="pro" />
          </Reveal>
        </div>
      </section>

      <PricingSection />

      {/* ── Final CTA ── */}
      <section className="marketing-divider marketing-tint-violet">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <Reveal>
            <div className="marketing-cta-card text-center">
              <h2 className="marketing-section-heading">
                {t.cta.title}{" "}
                <span className="serif-italic">{t.cta.titleItalic}</span>
              </h2>

              <p className="mt-6 text-zinc-600 leading-relaxed">{t.cta.subtitle}</p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup" className="btn-marketing">
                  {t.cta.primary}
                  <span aria-hidden>→</span>
                </Link>
                <Link href="#tarifs" className="btn-marketing-outline">
                  {t.cta.secondary}
                </Link>
              </div>

              <p className="mt-6">
                <Link
                  href="/login"
                  className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors underline underline-offset-4"
                >
                  {t.cta.login}
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <FeedbackSection />

      <footer className="marketing-divider">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo variant="dark" size="sm" />
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} {BRAND_NAME}. {t.footer}
          </p>
        </div>
      </footer>
      </div>
    </MarketingLayout>
  );
}
