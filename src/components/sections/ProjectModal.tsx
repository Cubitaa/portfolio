import { AnimatePresence, motion } from "framer-motion";
import type { ProjectItem } from "@app-types/main";
import type { Lang } from "@i18n/utils";

interface Props {
  project: ProjectItem | null;
  lang: Lang;
  onClose: () => void;
}

const COPY = {
  es: { github: "GitHub", demo: "Demo", close: "Cerrar" },
  en: { github: "GitHub", demo: "Demo", close: "Close" },
};

export default function ProjectModal({ project, lang, onClose }: Props) {
  const t = COPY[lang];

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-void/70 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
            className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-nebula-violet/25 bg-surface/95 p-6 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-ink-primary">{project.name}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-nebula-violet/30 text-ink-secondary transition-colors hover:border-nebula-cyan/60 hover:text-ink-primary focus-visible:outline-nebula-cyan"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-nebula-violet/30 bg-void/30 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-primary transition-colors hover:border-nebula-cyan/60 hover:text-nebula-cyan focus-visible:outline-nebula-cyan"
                >
                  {t.github}
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-nebula-violet/30 bg-void/30 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-primary transition-colors hover:border-nebula-cyan/60 hover:text-nebula-cyan focus-visible:outline-nebula-cyan"
                >
                  {project.demoLabel || t.demo}
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
