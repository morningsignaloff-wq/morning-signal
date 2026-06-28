"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isLocalMode } from "@/lib/mode";
import * as localAuth from "@/lib/local/auth";
import { createClient } from "@/lib/supabase/client";
import { LocalModeBadge } from "@/components/LocalModeBadge";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const local = isLocalMode();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (local) {
      const result =
        mode === "login"
          ? localAuth.signIn(email, password)
          : localAuth.signUp(email, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
      return;
    }

    const supabase = createClient();
    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error: authError } = await action;

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="marketing-card p-8 space-y-6 shadow-sm">
      {local && (
        <div className="flex justify-center">
          <LocalModeBadge />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-marketing"
            placeholder="founder@startup.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-marketing"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-marketing justify-center !rounded-xl disabled:opacity-50"
        >
          {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer un compte"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          {mode === "login" ? (
            <>
              Pas de compte ?{" "}
              <Link
                href="/signup"
                className="text-zinc-900 underline underline-offset-2 transition-colors"
              >
                S&apos;inscrire gratuitement
              </Link>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-zinc-900 underline underline-offset-2 transition-colors"
              >
                Se connecter
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
