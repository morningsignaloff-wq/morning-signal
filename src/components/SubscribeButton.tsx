"use client";

import { useState } from "react";
import { PRO_PRICE, GROWTH_PRICE } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";
import { useLanguage } from "@/lib/i18n/context";

export function SubscribeButton({
  plan = "pro",
  className = "btn-marketing w-full justify-center !rounded-xl",
  label,
}: {
  plan?: Extract<PlanId, "pro" | "growth">;
  className?: string;
  label?: string;
}) {
  const { locale, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const price = plan === "growth" ? GROWTH_PRICE : PRO_PRICE;
  const defaultLabel =
    label ??
    (locale === "fr"
      ? `${plan === "growth" ? "Growth" : "Pro"} — ${price}€/mois`
      : `${plan === "growth" ? "Growth" : "Pro"} — €${price}/mo`);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/signup";
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? t.pricing.pro.checkoutError);
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t.pricing.pro.checkoutError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`${className} disabled:opacity-50`}
      >
        {loading ? t.pricing.pro.checkoutLoading : defaultLabel}
      </button>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
}

export function ManageSubscriptionButton({
  className = "btn-marketing-outline w-full justify-center !rounded-xl text-sm",
  label = "Gérer mon abonnement",
}: {
  className?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      window.location.href = data.url;
    } catch {
      alert("Impossible d'ouvrir le portail de facturation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className={`${className} disabled:opacity-50`}
    >
      {loading ? "..." : label}
    </button>
  );
}
