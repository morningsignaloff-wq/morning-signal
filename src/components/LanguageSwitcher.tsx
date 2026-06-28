"use client";

import { useLanguage } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

const options: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 shadow-sm"
      role="group"
      aria-label="Language"
    >
      {options.map(({ value, label }) => {
        const active = locale === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLocale(value)}
            aria-pressed={active}
            className={`min-w-[2.25rem] px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
