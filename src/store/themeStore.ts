import { atom } from "nanostores";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "portfolio:theme";

// Oscuro por defecto siempre (independiente de la preferencia del sistema),
// igual que el script inline de BaseLayout.astro que evita el flash inicial.
function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export const themeMode = atom<ThemeMode>(getInitialTheme());

export function toggleTheme(): void {
  const next = themeMode.get() === "dark" ? "light" : "dark";
  setTheme(next);
}

export function setTheme(mode: ThemeMode): void {
  themeMode.set(mode);
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(mode);
  window.localStorage.setItem(STORAGE_KEY, mode);
}
