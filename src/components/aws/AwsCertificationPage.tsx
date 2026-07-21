import { motion } from "framer-motion";
import type { Lang } from "@i18n/utils";
import { getCertIcon } from "./certIcons";

type CertLevel = "foundational" | "associate" | "professional" | "specialty";
const LEVEL_ORDER: CertLevel[] = ["foundational", "associate", "professional", "specialty"];
const HEX_PER_ROW = 3;
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

interface AwsCertItem {
  id: string;
  level: CertLevel;
  name: { es: string; en: string };
  obtained: boolean;
  badgeImage?: string;
}

interface AwsCertData {
  heading: { es: string; en: string };
  progressLabel: { es: string; en: string };
  backLabel: { es: string; en: string };
  // Nombres de nivel oficiales de AWS: no se traducen.
  levelLabels: Record<CertLevel, string>;
  items: AwsCertItem[];
}

interface Props {
  lang: Lang;
  data: AwsCertData;
  backHref: string;
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function Hex({ item, lang }: { item: AwsCertItem; lang: Lang }) {
  const label = item.name[lang];
  const dimClasses = item.obtained ? "opacity-100" : "opacity-40 grayscale";
  const Icon = getCertIcon(item.id);

  return (
    <div className="flex w-[130px] flex-col items-center gap-4 sm:w-[150px]">
      {item.badgeImage ? (
        <img src={item.badgeImage} alt={label} className={`w-full transition-all duration-500 ${dimClasses}`} />
      ) : (
        <div className={`relative flex aspect-[0.866/1] w-full items-center justify-center transition-all duration-500 ${dimClasses}`}>
          <div
            className={`absolute inset-0 ${
              item.obtained ? "bg-gradient-to-br from-nebula-violet to-nebula-cyan" : "border border-ink-muted/30 bg-surface/40"
            }`}
            style={{ clipPath: HEX_CLIP }}
          />
          <div className={`relative h-9 w-9 ${item.obtained ? "text-white" : "text-ink-secondary"}`}>
            <Icon />
          </div>
          {item.obtained && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-nebula-cyan p-1 text-void ring-2 ring-void"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </div>
      )}
      <span className={`max-w-[140px] text-center text-[11px] leading-snug ${item.obtained ? "text-ink-primary" : "text-ink-secondary/60"}`}>
        {label}
      </span>
    </div>
  );
}

function HexGrid({ items, lang }: { items: AwsCertItem[]; lang: Lang }) {
  const rows = chunk(items, HEX_PER_ROW);
  return (
    <div className="flex flex-col items-center gap-10 sm:gap-12">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex flex-wrap justify-center gap-x-6 gap-y-10 sm:gap-x-8"
          style={{ transform: i % 2 === 1 && row.length > 1 ? "translateX(3rem)" : undefined }}
        >
          {row.map((item) => (
            <Hex key={item.id} item={item} lang={lang} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AwsCertificationPage({ lang, data, backHref }: Props) {
  const total = data.items.length;
  const count = data.items.filter((item) => item.obtained).length;
  const pct = total > 0 ? (count / total) * 100 : 0;
  const progressText = data.progressLabel[lang]
    .replace("{count}", String(count))
    .replace("{total}", String(total));

  return (
    <div className="mx-auto flex min-h-full max-w-4xl flex-col items-center px-6 py-24 sm:py-28">
      <h1 className="text-center font-display text-3xl font-bold text-ink-primary sm:text-4xl">
        {data.heading[lang]}
      </h1>

      <div className="mt-8 w-full max-w-sm">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface/60">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-nebula-violet to-nebula-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-2 text-center font-mono text-xs uppercase tracking-widest text-ink-secondary">
          {progressText}
        </p>
      </div>

      <div className="mt-16 flex w-full flex-col gap-20">
        {LEVEL_ORDER.map((level) => {
          const items = data.items.filter((item) => item.level === level);
          if (items.length === 0) return null;
          return (
            <section key={level} className="flex flex-col items-center gap-10">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-nebula-violet/30" aria-hidden="true" />
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-nebula-cyan">
                  {data.levelLabels[level]}
                </h2>
                <span className="h-px w-10 bg-nebula-violet/30" aria-hidden="true" />
              </div>
              <HexGrid items={items} lang={lang} />
            </section>
          );
        })}
      </div>

      <a
        href={backHref}
        className="group mt-20 flex items-center gap-3 rounded-full border border-nebula-violet/40 bg-surface/40 px-6 py-3 font-mono text-sm uppercase tracking-widest text-ink-primary backdrop-blur-md transition-all duration-300 hover:border-nebula-cyan/60 hover:bg-surface/60 focus-visible:outline-nebula-cyan"
      >
        {data.backLabel[lang]}
        <span
          className="inline-block h-2 w-2 rounded-full bg-nebula-cyan transition-transform duration-500 group-hover:scale-150"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
