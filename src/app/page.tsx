import { LanguageProvider } from "@/lib/i18n/context";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  return (
    <LanguageProvider>
      <LandingPage />
    </LanguageProvider>
  );
}
