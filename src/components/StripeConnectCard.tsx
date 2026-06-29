"use client";

import { useState } from "react";
import { IntegrationLogo } from "@/components/IntegrationLogo";

interface StripeConnectCardProps {
  connected: boolean;
  canConnect: boolean;
  onStatusChange?: () => void;
}

export function StripeConnectCard({
  connected,
  canConnect,
  onStatusChange,
}: StripeConnectCardProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/integrations/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de connexion");

      setSuccess(
        data.preview
          ? `Connecté — ${data.preview.revenue}€ de revenu sur 30 jours détectés.`
          : "Stripe connecté avec succès."
      );
      setKey("");
      onStatusChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    await fetch("/api/integrations/stripe", { method: "DELETE" });
    setSuccess(null);
    onStatusChange?.();
    setLoading(false);
  }

  return (
    <div className="dashboard-panel p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-zinc-100 p-2.5 shrink-0">
          <IntegrationLogo id="stripe" className="w-full h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-zinc-900">Stripe</h3>
            {connected ? (
              <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connecté
              </span>
            ) : canConnect ? (
              <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                1 connecteur au choix — Pro
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                Plan Pro requis
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
            Synchronise automatiquement le revenu et les nouveaux clients depuis votre compte Stripe.
          </p>

          {connected ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <p className="text-sm text-emerald-700 w-full">
                Les KPIs revenu et nouveaux clients sont enrichis à chaque rapport.
              </p>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={loading}
                className="text-sm text-zinc-600 hover:text-red-600 underline underline-offset-2"
              >
                Déconnecter
              </button>
            </div>
          ) : canConnect ? (
            <form onSubmit={handleConnect} className="mt-4 space-y-3">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="rk_live_... ou sk_live_... (lecture seule recommandé)"
                className="input-marketing w-full text-sm"
                required
              />
              <p className="text-xs text-zinc-500">
                Créez une clé restreinte en lecture seule dans votre{" "}
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 underline"
                >
                  dashboard Stripe
                </a>
                .
              </p>
              <button
                type="submit"
                disabled={loading || !key.trim()}
                className="btn-marketing text-sm !rounded-xl disabled:opacity-50"
              >
                {loading ? "Connexion…" : "Connecter Stripe"}
              </button>
            </form>
          ) : null}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 text-sm text-emerald-700">{success}</p>}
        </div>
      </div>
    </div>
  );
}
