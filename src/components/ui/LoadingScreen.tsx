import { useEffect, useState } from "react";
import { useTranslations, type Lang } from "@i18n/utils";

interface Props {
  lang: Lang;
}

const SESSION_KEY = "portfolio:loaded-once";

export default function LoadingScreen({ lang }: Props) {
  const t = useTranslations(lang);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.sessionStorage.getItem(SESSION_KEY) !== "true";
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDelay = reducedMotion ? 200 : 900;
    const start = Date.now();

    function finish() {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDelay - elapsed);
      window.setTimeout(() => {
        setFading(true);
        window.setTimeout(() => setVisible(false), 500);
      }, remaining);
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      return () => window.removeEventListener("load", finish);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t("loading")}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-void transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 rounded-full border border-nebula-violet/30" />
        <span className="absolute inset-0 animate-spin rounded-full border-t-2 border-nebula-cyan" style={{ animationDuration: "1.1s" }} />
        <span className="absolute inset-[6px] rounded-full bg-nebula-amber/90" />
      </div>
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-muted">{t("loading")}</span>
    </div>
  );
}
