import { AuthForm } from "@/components/AuthForm";
import { FullLogo } from "@/components/FullLogo";
import { Logo } from "@/components/Logo";
import { MarketingLayout } from "@/components/MarketingLayout";
import Link from "next/link";

export default function LoginPage() {
  return (
    <MarketingLayout>
      <header className="app-header">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Logo variant="light" showText={false} />
        </div>
      </header>
      <div className="marketing-tint-violet min-h-[calc(100vh-5rem)]">
        <div className="max-w-md mx-auto px-6 py-12 animate-fade-up">
          <div className="text-center mb-8">
            <FullLogo className="mb-6" />
            <h1 className="marketing-section-heading !text-3xl">
              Bon <span className="serif-italic">retour</span>
            </h1>
            <p className="mt-3 text-sm text-zinc-500">Connectez-vous à votre dashboard</p>
          </div>
          <AuthForm mode="login" />
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
