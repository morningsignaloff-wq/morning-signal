"use client";

import { useState } from "react";
import type { PlanId } from "@/lib/plans";
import { PRO_PRICE, GROWTH_PRICE } from "@/lib/plans";
import { SubscribeButton } from "@/components/SubscribeButton";
import { useLanguage } from "@/lib/i18n/context";
import Link from "next/link";

function formatPrice(amount: number, locale: string) {
  return locale === "fr" ? `${amount}€` : `€${amount}`;
}

export function PricingSection() {
  const { t, locale } = useLanguage();

  return (
    <section id="tarifs" className="marketing-divider marketing-tint-rose">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="marketing-section-heading">
            {t.pricing.title}{" "}
            <span className="serif-italic">{t.pricing.titleItalic}</span>
          </h2>
          <p className="mt-4 text-zinc-500 max-w-xl mx-auto">{t.pricing.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="marketing-card p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-200 text-zinc-600 text-xs font-medium px-3 py-1 rounded-full">
              {t.pricing.free.badge}
            </div>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
              {t.pricing.free.name}
            </p>
            <p className="marketing-stat !text-4xl mt-2">{t.pricing.free.price}</p>
            <p className="text-sm text-zinc-400 mb-6">{t.pricing.free.period}</p>
            <ul className="space-y-3 mb-8">
              {t.pricing.free.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="text-violet-500 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn-marketing-outline w-full justify-center !rounded-xl">
              {t.pricing.free.cta}
            </Link>
          </div>

          {/* Pro */}
          <div className="marketing-offer-card p-8 relative border-violet-200">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              {t.pricing.pro.badge}
            </div>
            <p className="text-sm font-medium text-violet-600 uppercase tracking-wide">
              {t.pricing.pro.name}
            </p>
            <p className="marketing-stat !text-4xl mt-2">
              {formatPrice(PRO_PRICE, locale)}
            </p>
            <p className="text-sm text-zinc-400 mb-6">{t.pricing.pro.period}</p>
            <ul className="space-y-3 mb-8">
              {t.pricing.pro.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="text-violet-500 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <SubscribeButton plan="pro" label={t.pricing.pro.cta} />
          </div>

          {/* Growth */}
          <div className="marketing-card p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-medium px-3 py-1 rounded-full">
              {t.pricing.growth.badge}
            </div>
            <p className="text-sm font-medium text-zinc-700 uppercase tracking-wide">
              {t.pricing.growth.name}
            </p>
            <p className="marketing-stat !text-4xl mt-2">
              {formatPrice(GROWTH_PRICE, locale)}
            </p>
            <p className="text-sm text-zinc-400 mb-6">{t.pricing.growth.period}</p>
            <ul className="space-y-3 mb-8">
              {t.pricing.growth.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="text-violet-500 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <SubscribeButton
              plan="growth"
              className="btn-marketing-outline w-full justify-center !rounded-xl border-violet-300"
              label={t.pricing.growth.cta}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
