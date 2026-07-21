import { ui, defaultLang, type Lang, type UIKey } from "./ui";

export type { Lang };

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split("/");
  if (maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function translate(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path}`;
}
