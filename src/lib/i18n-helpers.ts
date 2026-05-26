import { i18n, type Language, type TranslationKey } from "@/app/i18n";

export function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem("aqari_lang");
    if (stored === "en" || stored === "ar") return stored;
  } catch {
    /* ignore */
  }
  return "ar";
}

export function translate(key: TranslationKey, lang?: Language): string {
  const language = lang ?? getStoredLanguage();
  return i18n[language][key] ?? key;
}
