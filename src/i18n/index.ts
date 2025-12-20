import { en } from "./en";
import { ru } from "./ru";
import { uk } from "./uk";

export const translations = {
  en,
  ru,
  uk,
} as const;

export type Locale = keyof typeof translations;
export type Translations = typeof en;

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (lang in translations) {
    return lang as Locale;
  }
  return "en";
}
