import { useEffect, useState } from "react";
import Constellation from "./Constellation";
import SidePanel from "./SidePanel";
import FooterBar from "./FooterBar";
import type { HeroData, NavNodeData, NodeSectionId, PanelSectionsData, FooterBarData } from "@app-types/main";
import { useTranslations, type Lang } from "@i18n/utils";

interface Props {
  hero: HeroData;
  navItems: NavNodeData[];
  panelData: PanelSectionsData;
  footer: FooterBarData;
  lang: Lang;
}

export default function MainScreen({ hero, navItems, panelData, footer, lang }: Props) {
  const t = useTranslations(lang);
  const [activeId, setActiveId] = useState<NodeSectionId | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("open");
    const validIds = navItems.map((item) => item.id);
    if (requested && validIds.includes(requested as NodeSectionId)) {
      setActiveId(requested as NodeSectionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(id: string, origin: { x: number; y: number }) {
    setZoomOrigin(origin);
    setIsZooming(true);
    window.setTimeout(() => setActiveId(id as NodeSectionId), 260);
  }

  function handleClose() {
    setActiveId(null);
    setZoomOrigin(null);
    window.setTimeout(() => setIsZooming(false), 50);
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center pt-[4dvh] text-center sm:pt-[5dvh]">
        {hero.available && (
          <span className="pointer-events-auto mb-4 flex items-center gap-2 rounded-full border border-nebula-cyan/30 bg-surface/40 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nebula-cyan opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-nebula-cyan" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-secondary">{hero.availabilityLabel}</span>
          </span>
        )}
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-nebula-cyan">{hero.greeting}</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink-primary sm:text-5xl lg:text-6xl">
          {hero.name}
        </h1>
        <p className="mt-3 font-display text-base text-nebula-violet sm:text-lg">{hero.role}</p>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-secondary sm:text-base">{hero.tagline}</p>
      </div>

      <div className="flex h-full items-center justify-center">
        <Constellation
          items={navItems}
          activeId={activeId}
          isZooming={isZooming}
          zoomOrigin={zoomOrigin}
          onSelect={handleSelect}
          centerLabel={panelData.about.heading}
        />
      </div>

      <SidePanel activeId={activeId} data={panelData} lang={lang} onClose={handleClose} closeLabel={t("nav.close")} />
      <FooterBar data={footer} />
    </div>
  );
}
