import { useStore } from "@nanostores/react";
import { themeMode, toggleTheme } from "@store/themeStore";
import { useTranslations, type Lang } from "@i18n/utils";

interface Props {
  lang: Lang;
}

export default function ThemeToggle({ lang }: Props) {
  const mode = useStore(themeMode);
  const t = useTranslations(lang);
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("theme.toggleToLight") : t("theme.toggleToDark")}
      className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-nebula-violet/30 bg-surface/50 text-ink-secondary backdrop-blur-md transition-all duration-500 hover:border-nebula-cyan/60 hover:text-ink-primary focus-visible:outline-nebula-cyan"
    >
      <span className="relative block h-5 w-5">
        {/* Sol — visible en modo claro (vas a pasar a oscuro) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`absolute inset-0 h-5 w-5 text-nebula-amber transition-all duration-500 ${
            isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.2 12H2M22 12h-2.2M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5" />
        </svg>

        {/* Luna menguante — visible en modo oscuro (vas a pasar a claro) */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`absolute inset-0 h-5 w-5 text-nebula-violet transition-all duration-500 ${
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
          }`}
          aria-hidden="true"
        >
          <path d="M20.5 14.4A9 9 0 1 1 9.6 3.5a7.2 7.2 0 0 0 10.9 10.9Z" />
        </svg>
      </span>
    </button>
  );
}
