import { AuthForm } from "@/components/AuthForm";
import { EarlyAccessBadge } from "@/components/EarlyAccessBadge";
import { FullLogo } from "@/components/FullLogo";
import { Logo } from "@/components/Logo";
import { MarketingLayout } from "@/components/MarketingLayout";
import Link from "next/link";

export default function SignupPage() {
  return (
    <MarketingLayout>
      <header className="app-header">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Logo variant="light" showText={false} />
        </div>
      </header>
      <div className="marketing-tint-rose min-h-[calc(100vh-5rem)]">
        <div className="max-w-md mx-auto px-6 py-12 animate-fade-up">
          <div className="text-center mb-8">
            <FullLogo className="mb-6" />
            <div className="mb-4 flex justify-center">
              <EarlyAccessBadge label="Accès anticipé — gratuit pendant la beta" />
            </div>
            <h1 className="marketing-section-heading !text-3xl">
              Créer un <span className="serif-italic">compte</span>
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Votre premier signal du jour en 30 secondes
            </p>
          </div>
          <AuthForm mode="signup" />
          <p className="text-center mt-6">
            <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
