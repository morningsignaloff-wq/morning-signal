"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRO_PRICE } from "@/lib/integrations";
import { WaitlistButton } from "@/components/WaitlistButton";
import { useLanguage } from "@/lib/i18n/context";

interface PricingSectionProps {
  proPrice?: string;
}

export function PricingSection({ proPrice }: PricingSectionProps) {
  const { t, locale } = useLanguage();
  const price =
    proPrice ??
    (locale === "fr"
      ? `${PRO_PRICE.toFixed(2).replace(".", ",")}€`
      : `€${PRO_PRICE.toFixed(2)}`);

  return (
    <section id="tarifs" className="marketing-divider marketing-tint-rose">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="marketing-section-heading">
            {t.pricing.title}{" "}
            <span className="serif-italic">{t.pricing.titleItalic}</span>
          </h2>
          <p className="mt-4 text-zinc-500 max-w-xl mx-auto">{t.pricing.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="marketing-offer-card p-8 relative border-violet-200">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              {t.pricing.earlyAccess.badge}
            </div>
            <p className="text-sm font-medium text-violet-600 uppercase tracking-wide">
              {t.pricing.earlyAccess.name}
            </p>
            <p className="marketing-stat !text-4xl mt-2">{t.pricing.earlyAccess.price}</p>
            <p className="text-sm text-zinc-400 mb-6">{t.pricing.earlyAccess.period}</p>
            <ul className="space-y-3 mb-8">
              {t.pricing.earlyAccess.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="text-violet-500 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn-marketing w-full justify-center !rounded-xl">
              {t.pricing.earlyAccess.cta}
            </Link>
          </div>

          <div className="marketing-card p-8 relative opacity-95">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-200 text-zinc-600 text-xs font-medium px-3 py-1 rounded-full">
              {t.pricing.pro.badge}
            </div>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
              {t.pricing.pro.name}
            </p>
            <p className="marketing-stat !text-4xl mt-2 text-zinc-400">{price}</p>
            <p className="text-sm text-zinc-400 mb-6">{t.pricing.pro.period}</p>
            <ul className="space-y-3 mb-8">
              {t.pricing.pro.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-500">
                  <span className="text-zinc-300 mt-0.5">○</span>
                  {f}
                </li>
              ))}
            </ul>
            <WaitlistButton />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SubscribeButton({
  className = "btn-marketing w-full justify-center !rounded-xl",
  label,
}: {
  className?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const defaultLabel = label ?? `Pro — €${PRO_PRICE.toFixed(2)}/mo`;

  async function handleSubscribe() {
    setLoading(true);
    alert("Pro plan with integrations is not available yet. Join the waitlist.");
    setLoading(false);
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`${className} disabled:opacity-50`}
    >
      {loading ? "..." : defaultLabel}
    </button>
  );
}
