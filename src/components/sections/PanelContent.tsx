import { useEffect, useRef, useState } from "react";
import type {
  AboutData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillCategory,
  CertificationItem,
  TimelineItem,
  StatisticItem,
  PanelSectionsData,
} from "@app-types/main";
import type { Lang } from "@i18n/utils";
import ContactForm from "./ContactForm";
import FlagIcon from "./FlagIcon";
import ProjectModal from "./ProjectModal";

export function AboutPanel({ data }: { data: AboutData }) {
  return (
    <div>
      {data.paragraphs.map((p, i) => (
        <p key={i} className="mb-4 text-sm leading-relaxed text-ink-secondary sm:text-base">
          {p}
        </p>
      ))}
      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {data.highlights.map((item) => {
          const content = (
            <>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">{item.label}</dt>
              <dd className="mt-1 font-display text-xl font-semibold text-nebula-cyan">{item.value}</dd>
            </>
          );
          const className =
            "rounded-xl border border-nebula-violet/20 bg-surface/40 px-4 py-3 transition-colors duration-300" +
            (item.url ? " hover:border-nebula-cyan/50 focus-visible:outline-nebula-cyan" : "");

          return item.url ? (
            <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer" className={className}>
              {content}
            </a>
          ) : (
            <div key={item.label} className={className}>
              {content}
            </div>
          );
        })}
      </dl>

      {data.languages.length > 0 && (
        <>
          <div className="mt-8 flex items-center gap-3" role="separator">
            <span className="h-px flex-1 bg-nebula-violet/20" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">{data.languagesHeading}</span>
            <span className="h-px flex-1 bg-nebula-violet/20" aria-hidden="true" />
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.languages.map((item) => (
              <div key={item.language} className="rounded-xl border border-nebula-violet/20 bg-surface/40 px-4 py-3">
                <dt className="flex items-center gap-2 font-display text-base font-semibold text-ink-primary">
                  <FlagIcon code={item.flag} />
                  {item.language}
                </dt>
                <dd className="mt-1 text-sm text-nebula-cyan">{item.level}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      {data.extraSections.map((section) => (
        <div key={section.heading}>
          <div className="mt-8 flex items-center gap-3" role="separator">
            <span className="h-px flex-1 bg-nebula-violet/20" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">{section.heading}</span>
            <span className="h-px flex-1 bg-nebula-violet/20" aria-hidden="true" />
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {section.items.map((item) => (
              <div key={item.title} className="rounded-xl border border-nebula-violet/20 bg-surface/40 px-4 py-3">
                <dt className="font-display text-base font-semibold text-ink-primary">{item.title}</dt>
                <dd className="mt-1 text-sm text-nebula-cyan">{item.subtitle}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export function ExperiencePanel({ items, presentLabel }: { items: ExperienceItem[]; presentLabel: string }) {
  return (
    <ol className="space-y-7 border-l border-nebula-violet/20 pl-5">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-nebula-cyan" aria-hidden="true" />
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
            {item.startDate} — {item.endDate ?? presentLabel}
          </p>
          <h3 className="mt-1 font-display text-base font-semibold text-ink-primary">{item.role}</h3>
          <p className="text-sm text-nebula-violet">{item.company}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{item.description}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {item.technologies.map((tech) => (
              <li key={tech} className="rounded-full border border-nebula-violet/20 px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function EducationPanel({ items }: { items: EducationItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-nebula-violet/20 bg-surface/40 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
            {item.startYear} — {item.endYear}
          </p>
          <h3 className="mt-1 font-display text-base font-semibold text-ink-primary">{item.degree}</h3>
          <p className="text-sm text-nebula-violet">{item.institution}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

const STATUS_LABEL: Record<ProjectItem["status"], { es: string; en: string; color: string }> = {
  live: { es: "Listo", en: "Ready", color: "bg-nebula-cyan" },
  "in-progress": { es: "En producción", en: "Live", color: "bg-nebula-amber" },
  archived: { es: "Archivado", en: "Archived", color: "bg-ink-muted" },
  concept: { es: "Concepto", en: "Concept", color: "bg-nebula-violet" },
};

/**
 * Sin imagen — todo el espacio de la tarjeta es texto. Tres variantes según
 * project.action.type: "external" (enlace directo, nueva pestaña), "modal"
 * (abre ProjectModal con GitHub + demo) y "none" (sin ningún enlace).
 */
function ProjectCard({ project, lang, onOpenModal }: { project: ProjectItem; lang: Lang; onOpenModal: (p: ProjectItem) => void }) {
  const status = STATUS_LABEL[project.status];
  const isExternal = project.action.type === "external" && project.action.value;
  const isModal = project.action.type === "modal";
  const isLinked = Boolean(isExternal || isModal);

  const content = (
    <>
      <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-nebula-violet/20 bg-void/30 px-3 py-1">
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${status.color}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${status.color}`} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-secondary">{status[lang]}</span>
      </span>
      <h3 className="font-display text-base font-semibold text-ink-primary">{project.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">{project.description}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <li key={tech} className="rounded-full border border-nebula-violet/20 px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary">
            {tech}
          </li>
        ))}
      </ul>
    </>
  );

  const className =
    "flex h-full w-full flex-col text-left rounded-xl border border-nebula-violet/20 bg-surface/40 p-4 transition-colors duration-300" +
    (isLinked ? " hover:border-nebula-cyan/50 focus-visible:outline-nebula-cyan" : "");

  if (isModal) {
    return (
      <button type="button" onClick={() => onOpenModal(project)} className={className}>
        {content}
      </button>
    );
  }
  if (isExternal) {
    return (
      <a href={project.action.value} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}

export function ProjectsPanel({ items, lang }: { items: ProjectItem[]; lang: Lang }) {
  const [openProject, setOpenProject] = useState<ProjectItem | null>(null);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {items.map((project) => (
        <ProjectCard key={project.id} project={project} lang={lang} onOpenModal={setOpenProject} />
      ))}
      <ProjectModal project={openProject} lang={lang} onClose={() => setOpenProject(null)} />
    </div>
  );
}

export function SkillsPanel({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-nebula-amber" aria-hidden="true" />
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink-secondary">{category.label}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((item) => (
              <span key={item} className="rounded-full border border-nebula-violet/20 bg-surface/40 px-2.5 py-1 text-xs text-ink-primary">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function isSameOriginUrl(url: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URL(url, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

export function CertificationsPanel({ items, lang }: { items: CertificationItem[]; lang: Lang }) {
  return (
    <ul className="space-y-2.5">
      {items.map((cert) => {
        const internal = cert.url ? isSameOriginUrl(cert.url) : false;
        return (
          <li key={cert.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-nebula-violet/20 bg-surface/40 px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold text-ink-primary">{cert.name}</p>
              <p className="text-xs text-ink-secondary">
                {cert.issuer} · {cert.date}
              </p>
            </div>
            {cert.url && (
              <a
                href={cert.url}
                target={internal ? undefined : "_blank"}
                rel={internal ? undefined : "noopener noreferrer"}
                className="font-mono text-[11px] uppercase tracking-widest text-nebula-cyan hover:text-ink-primary"
              >
                {lang === "es" ? "Ver" : "View"}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function TimelinePanel({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-6 border-l border-nebula-violet/20 pl-5">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[23px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-nebula-amber bg-void">
            <span className="h-1 w-1 rounded-full bg-nebula-amber" aria-hidden="true" />
          </span>
          <p className="font-mono text-[11px] uppercase tracking-widest text-nebula-amber">{item.year}</p>
          <h3 className="mt-1 font-display text-base font-semibold text-ink-primary">{item.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

function useCountUp(target: number, active: boolean, durationMs = 1000) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);

  return value;
}

export function StatisticsPanel({ items }: { items: StatisticItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((stat) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const value = useCountUp(stat.value, true);
        return (
          <div key={stat.id} className="rounded-xl border border-nebula-violet/20 bg-surface/40 px-4 py-5 text-center">
            <p className="font-display text-2xl font-bold text-nebula-cyan">
              {value}
              {stat.suffix}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export function ContactPanel({ copy }: { copy: PanelSectionsData["contact"] }) {
  return (
    <div>
      <p className="mb-4 text-sm text-ink-secondary">{copy.subheading}</p>
      <ContactForm
        copy={{
          nameLabel: copy.nameLabel,
          emailLabel: copy.emailLabel,
          messageLabel: copy.messageLabel,
          submitLabel: copy.submitLabel,
          sendingLabel: copy.sendingLabel,
          successMessage: copy.successMessage,
          errorMessage: copy.errorMessage,
          validationError: copy.validationError,
        }}
      />
    </div>
  );
}
