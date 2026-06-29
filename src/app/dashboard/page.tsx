"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { KPIForm } from "@/components/KPIForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { LocalModeBadge } from "@/components/LocalModeBadge";
import { EarlyAccessBadge } from "@/components/EarlyAccessBadge";
import { Logo } from "@/components/Logo";
import { MarketingLayout } from "@/components/MarketingLayout";
import { IntegrationsGrid } from "@/components/IntegrationsGrid";
import { SubscribeButton, ManageSubscriptionButton } from "@/components/SubscribeButton";
import type { Report } from "@/lib/types";
import { useRouter } from "next/navigation";
import { isLocalMode } from "@/lib/mode";
import { getSession, signOut as localSignOut } from "@/lib/local/auth";
import { getLatestReport, getReports, getReportCountThisMonth } from "@/lib/local/store";
import { createClient } from "@/lib/supabase/client";
import { FREE_REPORT_LIMIT } from "@/lib/usage";
import { PRO_PRICE, GROWTH_PRICE } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";
import { StripeConnectCard } from "@/components/StripeConnectCard";

type Tab = "rapport" | "integrations";

function formatReportLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [usage, setUsage] = useState<{
    used: number;
    limit: number | null;
    isPaid: boolean;
    plan: PlanId;
    morningEmail: boolean;
    stripeConnected: boolean;
    connectedProviders: string[];
    connectorLimit: number | null;
  }>({
    used: 0,
    limit: FREE_REPORT_LIMIT,
    isPaid: false,
    plan: "free",
    morningEmail: false,
    stripeConnected: false,
    connectedProviders: [],
    connectorLimit: 0,
  });
  const [upgradeNotice, setUpgradeNotice] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("rapport");
  const router = useRouter();
  const searchParams = useSearchParams();
  const local = isLocalMode();

  const startCheckout = useCallback(async (plan: "pro" | "growth" = "pro") => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }
    alert(data.error ?? "Impossible de lancer le paiement Stripe.");
  }, []);

  function refreshUsageLocal(userId: string) {
    setUsage({
      used: getReportCountThisMonth(userId),
      limit: FREE_REPORT_LIMIT,
      isPaid: false,
      plan: "free",
      morningEmail: false,
      stripeConnected: false,
      connectedProviders: [],
      connectorLimit: 0,
    });
  }

  async function refreshUsageProd() {
    const res = await fetch("/api/subscription");
    if (res.ok) {
      const data = await res.json();
      setUsage({
        used: data.used,
        limit: data.limit,
        isPaid: data.isPaid,
        plan: data.plan,
        morningEmail: data.morningEmail,
        stripeConnected: data.stripeConnected,
        connectedProviders: data.connectedProviders ?? [],
        connectorLimit: data.connectorLimit ?? 0,
      });
    }
  }

  useEffect(() => {
    const upgraded = searchParams.get("upgraded");
    if (upgraded === "pro" || upgraded === "growth") {
      setUpgradeNotice(
        upgraded === "growth"
          ? "Plan Growth activé — tous les connecteurs + email matinal."
          : "Plan Pro activé — 1 connecteur au choix + email matinal + rapports illimités."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      if (local) {
        const session = getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        setEmail(session.email);
        const allReports = getReports(session.id);
        setReports(allReports);
        setReport(getLatestReport(session.id));
        refreshUsageLocal(session.id);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? null);

      const { data: allReports } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (allReports?.length) {
        setReports(allReports as Report[]);
        setReport(allReports[0] as Report);
      }

      await refreshUsageProd();
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSignOut() {
    if (local) {
      localSignOut();
    } else {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <MarketingLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
          <p className="text-sm text-zinc-500">Chargement du dashboard...</p>
        </div>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <header className="app-header sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Logo variant="light" size="sm" />
          <div className="flex items-center gap-3 sm:gap-4">
            {usage.isPaid ? (
              <span className="text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full">
                Plan {usage.plan === "growth" ? "Growth" : "Pro"}
                {usage.morningEmail && " · Email matinal"}
              </span>
            ) : (
              <EarlyAccessBadge variant="dashboard" label="Plan gratuit" />
            )}
            {email && (
              <span className="text-xs text-zinc-500 hidden sm:block">{email}</span>
            )}
            <button
              onClick={handleSignOut}
              className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors marketing-card px-3 py-1.5 rounded-lg"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <main className="marketing-tint-violet min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8 animate-fade-up">
            {local && <LocalModeBadge />}
            {upgradeNotice && (
              <div className="mb-4 text-sm text-violet-800 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                {upgradeNotice}
              </div>
            )}
            {!usage.isPaid && usage.limit != null && usage.used >= usage.limit && (
              <div className="mb-4 dashboard-panel-rose p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-zinc-900">Limite gratuite atteinte</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    Pro {PRO_PRICE}€/mois (1 connecteur au choix) ou Growth {GROWTH_PRICE}€/mois (tous connecteurs).
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <SubscribeButton plan="pro" className="btn-marketing justify-center !rounded-xl text-sm" label="Pro" />
                  <SubscribeButton plan="growth" className="btn-marketing-outline justify-center !rounded-xl text-sm" label="Growth" />
                </div>
              </div>
            )}
            {usage.isPaid && (
              <div className="mb-4 flex justify-end">
                <ManageSubscriptionButton className="btn-marketing-outline !rounded-xl text-xs px-4 py-2" />
              </div>
            )}
            <h1 className="text-2xl font-medium text-zinc-900 mt-4 tracking-tight">
              Votre{" "}
              <span className="serif-italic">dashboard</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Saisissez vos KPIs et générez votre recap — les intégrations API arrivent bientôt.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {(["rapport", "integrations"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm px-4 py-2 rounded-full transition-colors ${
                  tab === t ? "tab-active" : "tab-inactive"
                }`}
              >
                {t === "rapport" ? "Rapport" : "Intégrations à venir"}
              </button>
            ))}
          </div>

          {tab === "rapport" && (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <section className="dashboard-panel p-6 animate-fade-up animate-fade-up-delay-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-white border border-violet-200 flex items-center justify-center text-violet-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-medium text-zinc-900 text-sm">KPIs du jour</h2>
                    <p className="text-xs text-zinc-500">Saisie manuelle — environ 30 secondes</p>
                  </div>
                </div>
                <KPIForm
                  onReportGenerated={(r) => {
                    setReport(r);
                    setReports((prev) => [r, ...prev.filter((x) => x.id !== r.id)]);
                  }}
                  usage={{ ...usage, isPro: usage.isPaid }}
                  onUpgrade={() => startCheckout("pro")}
                  onUsageChange={() => {
                    if (local) {
                      const session = getSession();
                      if (session) refreshUsageLocal(session.id);
                    } else {
                      refreshUsageProd();
                    }
                  }}
                />
              </section>

              <section className="animate-fade-up animate-fade-up-delay-2">
                {reports.length > 1 && (
                  <div className="mb-4">
                    <label htmlFor="report-history" className="block text-xs text-zinc-500 mb-1.5">
                      Historique
                    </label>
                    <select
                      id="report-history"
                      value={report?.id ?? ""}
                      onChange={(e) => {
                        const selected = reports.find((r) => r.id === e.target.value);
                        if (selected) setReport(selected);
                      }}
                      className="input-marketing text-sm"
                    >
                      {reports.map((r) => (
                        <option key={r.id} value={r.id}>
                          {formatReportLabel(r.created_at)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {report ? (
                  <ReportDisplay report={report} />
                ) : (
                  <div className="marketing-card p-10 text-center h-full flex flex-col items-center justify-center min-h-[320px]">
                    <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-violet-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <p className="text-zinc-900 font-medium mb-1">Pas encore de rapport</p>
                    <p className="text-sm text-zinc-500 max-w-xs">
                      Remplissez vos KPIs à gauche pour générer votre premier recap.
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}

          {tab === "integrations" && (
            <div className="animate-fade-up space-y-8">
              <StripeConnectCard
                connected={usage.stripeConnected}
                canConnect={usage.plan === "pro" || usage.plan === "growth"}
                onStatusChange={refreshUsageProd}
              />
              {usage.plan === "free" && (
                <div className="dashboard-panel-rose p-6">
                  <p className="text-zinc-900 font-medium">Connecteurs réservés aux abonnés</p>
                  <p className="text-sm text-zinc-600 mt-2 max-w-2xl">
                    Le plan Pro inclut 1 connecteur au choix + email matinal ({PRO_PRICE}€/mois).
                    Le plan Growth débloque tous les connecteurs ({GROWTH_PRICE}€/mois).
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 max-w-md">
                    <SubscribeButton plan="pro" className="btn-marketing justify-center !rounded-xl flex-1" label={`Pro — ${PRO_PRICE}€/mois`} />
                    <SubscribeButton plan="growth" className="btn-marketing-outline justify-center !rounded-xl flex-1" label={`Growth — ${GROWTH_PRICE}€/mois`} />
                  </div>
                </div>
              )}
              <IntegrationsGrid
                variant="dashboard"
                plan={usage.plan}
                connectedProviders={usage.connectedProviders}
              />
            </div>
          )}
        </div>
      </main>
    </MarketingLayout>
  );
}
