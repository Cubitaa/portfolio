import { motion } from "framer-motion";
import type { Lang } from "@i18n/utils";

type CertLevel = "foundational" | "associate" | "professional" | "specialty";
const LEVEL_ORDER: CertLevel[] = ["foundational", "associate", "professional", "specialty"];
const HEX_PER_ROW = 3;

interface AwsCertItem {
  id: string;
  level: CertLevel;
  name: { es: string; en: string };
  obtained: boolean;
}

interface AwsCertData {
  heading: { es: string; en: string };
  progressLabel: { es: string; en: string };
  backLabel: { es: string; en: string };
  levelLabels: Record<CertLevel, { es: string; en: string }>;
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
  return (
    <div className="flex w-[110px] flex-col items-center gap-2 sm:w-[130px]">
      <div
        className={`relative flex aspect-[0.866/1] w-full items-center justify-center transition-all duration-500 ${
          item.obtained ? "opacity-100" : "opacity-40 grayscale"
        }`}
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        <div
          className={`absolute inset-0 ${
            item.obtained
              ? "bg-gradient-to-br from-nebula-violet to-nebula-cyan"
              : "border border-ink-muted/30 bg-surface/40"
          }`}
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        />
        {item.obtained && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative h-8 w-8" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>
      <span
        className={`text-center text-[11px] leading-tight ${item.obtained ? "text-ink-primary" : "text-ink-secondary/60"}`}
      >
        {item.name[lang]}
      </span>
    </div>
  );
}

function HexGrid({ items, lang }: { items: AwsCertItem[]; lang: Lang }) {
  const rows = chunk(items, HEX_PER_ROW);
  return (
    <div className="flex flex-col items-center">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex flex-wrap justify-center gap-x-4 gap-y-6 sm:gap-x-6"
          style={{
            marginTop: i === 0 ? 0 : "-1.25rem",
            transform: i % 2 === 1 && row.length > 1 ? "translateX(2.5rem)" : undefined,
          }}
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

      <div className="mt-16 flex w-full flex-col gap-16">
        {LEVEL_ORDER.map((level) => {
          const items = data.items.filter((item) => item.level === level);
          if (items.length === 0) return null;
          return (
            <section key={level} className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-nebula-violet/30" aria-hidden="true" />
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-nebula-cyan">
                  {data.levelLabels[level][lang]}
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
