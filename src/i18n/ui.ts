export const languages = {
  es: "Español",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "es";

export const ui = {
  es: {
    "nav.open": "Abrir navegación",
    "nav.close": "Cerrar navegación",
    "theme.toggleToLight": "Cambiar a modo claro",
    "theme.toggleToDark": "Cambiar a modo oscuro",
    "lang.switch": "Switch to English",
    "experience.present": "Actualidad",
    "loading": "Cargando",
    "skipToContent": "Saltar al contenido",
  },
  en: {
    "nav.open": "Open navigation",
    "nav.close": "Close navigation",
    "theme.toggleToLight": "Switch to light mode",
    "theme.toggleToDark": "Switch to dark mode",
    "lang.switch": "Cambiar a Español",
    "experience.present": "Present",
    "loading": "Loading",
    "skipToContent": "Skip to content",
  },
} as const;

export type UIKey = keyof (typeof ui)["es"];
