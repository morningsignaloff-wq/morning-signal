"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/context";

export function FeedbackSection() {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email: email || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? t.feedback.error);
      }

      setSent(true);
      setMessage("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.feedback.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="retours" className="marketing-divider marketing-tint-mint">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Reveal>
          <div className="marketing-problem-card text-center">
            <p className="text-xs font-medium text-violet-600 uppercase tracking-widest mb-3">
              {t.feedback.eyebrow}
            </p>
            <h2 className="marketing-section-heading">
              <span className="serif-italic">{t.feedback.title}</span>
            </h2>

            <p className="mt-8 text-lg text-zinc-700 leading-relaxed">{t.feedback.p1}</p>
            <p className="mt-6 text-base text-zinc-600 leading-relaxed">{t.feedback.p2}</p>

            {sent ? (
              <p className="mt-10 text-sm font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-xl px-5 py-4">
                {t.feedback.success}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 text-left space-y-4">
                <div>
                  <label htmlFor="feedback-email" className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                    {t.feedback.emailLabel}
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.feedback.emailPlaceholder}
                    className="input-marketing w-full"
                  />
                </div>
                <div>
                  <label htmlFor="feedback-message" className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                    {t.feedback.messageLabel}
                  </label>
                  <textarea
                    id="feedback-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.feedback.messagePlaceholder}
                    className="input-marketing w-full resize-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="btn-marketing w-full sm:w-auto justify-center disabled:opacity-50"
                >
                  {loading ? t.feedback.sending : t.feedback.submit}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
