export type NodeSectionId =
  | "statistics"
  | "about"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "timeline"
  | "contact";

export interface NavNodeData {
  id: NodeSectionId;
  order: number;
  label: string;
  /** Nº de elementos dentro (solo proyectos, experiencia, certificados, formación) */
  itemCount?: number;
}

export interface HeroData {
  greeting: string;
  name: string;
  role: string;
  tagline: string;
  ctaLabel: string;
  availabilityLabel: string;
  available: boolean;
}

export interface AboutData {
  heading: string;
  paragraphs: string[];
  highlights: { label: string; value: string; url?: string }[];
  languagesHeading: string;
  languages: { flag: string; language: string; level: string }[];
  extraSections: { heading: string; items: { title: string; subtitle: string }[] }[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  companyUrl?: string;
  startDate: string;
  endDate: string | null;
  role: string;
  description: string;
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface ProjectAction {
  type: "external" | "modal" | "none";
  value?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  status: "live" | "in-progress" | "archived" | "concept";
  githubUrl?: string;
  demoUrl?: string;
  demoLabel?: string;
  action: ProjectAction;
}

export interface SkillCategory {
  id: string;
  label: string;
  items: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface StatisticItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface SocialItem {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface FooterBarData {
  copyrightText: string;
  socials: SocialItem[];
}

export interface PanelSectionsData {
  about: AboutData;
  experience: { heading: string; items: ExperienceItem[]; presentLabel: string };
  education: { heading: string; items: EducationItem[] };
  projects: { heading: string; items: ProjectItem[] };
  skills: { heading: string; categories: SkillCategory[] };
  certifications: { heading: string; items: CertificationItem[] };
  timeline: { heading: string; items: TimelineItem[] };
  statistics: { heading: string; items: StatisticItem[] };
  contact: {
    heading: string;
    subheading: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    submitLabel: string;
    sendingLabel: string;
    successMessage: string;
    errorMessage: string;
    validationError: string;
  };
}
