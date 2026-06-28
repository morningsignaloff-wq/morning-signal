import type { Locale } from "./types";
import { en, type Translations } from "./translations/en";
import { fr } from "./translations/fr";

export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type Locale } from "./types";
export type { Translations };

const translations: Record<Locale, Translations> = { en, fr };

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}
