import { AnimatePresence, motion } from "framer-motion";
import type { NodeSectionId, PanelSectionsData } from "@app-types/main";
import type { Lang } from "@i18n/utils";
import {
  AboutPanel,
  ExperiencePanel,
  EducationPanel,
  ProjectsPanel,
  SkillsPanel,
  CertificationsPanel,
  TimelinePanel,
  StatisticsPanel,
  ContactPanel,
} from "@components/sections/PanelContent";

interface Props {
  activeId: NodeSectionId | null;
  data: PanelSectionsData;
  lang: Lang;
  onClose: () => void;
  closeLabel: string;
}

export default function SidePanel({ activeId, data, lang, onClose, closeLabel }: Props) {
  const heading = activeId
    ? {
        about: data.about.heading,
        experience: data.experience.heading,
        education: data.education.heading,
        projects: data.projects.heading,
        skills: data.skills.heading,
        certifications: data.certifications.heading,
        timeline: data.timeline.heading,
        statistics: data.statistics.heading,
        contact: data.contact.heading,
      }[activeId]
    : "";

  return (
    <AnimatePresence>
      {activeId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-void/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={heading}
            className="fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-full flex-col border-l border-nebula-violet/25 bg-surface/70 backdrop-blur-xl sm:w-[440px] lg:w-[500px]"
          >
            <div className="flex items-center justify-between border-b border-nebula-violet/15 px-6 py-5">
              <h2 className="font-display text-xl font-semibold text-ink-primary">{heading}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-nebula-violet/30 text-ink-secondary transition-colors hover:border-nebula-cyan/60 hover:text-ink-primary focus-visible:outline-nebula-cyan"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {activeId === "about" && <AboutPanel data={data.about} />}
              {activeId === "experience" && <ExperiencePanel items={data.experience.items} presentLabel={data.experience.presentLabel} />}
              {activeId === "education" && <EducationPanel items={data.education.items} />}
              {activeId === "projects" && <ProjectsPanel items={data.projects.items} lang={lang} />}
              {activeId === "skills" && <SkillsPanel categories={data.skills.categories} />}
              {activeId === "certifications" && <CertificationsPanel items={data.certifications.items} lang={lang} />}
              {activeId === "timeline" && <TimelinePanel items={data.timeline.items} />}
              {activeId === "statistics" && <StatisticsPanel items={data.statistics.items} />}
              {activeId === "contact" && <ContactPanel copy={data.contact} />}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
