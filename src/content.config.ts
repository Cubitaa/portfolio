import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sectionBase = z.object({
  enabled: z.boolean(),
  order: z.number().int(),
});

// El panel admin deja "" al vaciar un campo de texto en vez de quitar la
// clave — z.string().url() por sí solo rechazaría eso, así que se admite
// también la cadena vacía como "sin URL".
const optionalUrl = z.union([z.literal(""), z.string().url()]).optional();

const localizedText = z.object({
  es: z.string(),
  en: z.string(),
});

/* ---------- Hero ---------- */
const heroSchema = sectionBase.extend({
  content: z.object({
    es: z.object({
      greeting: z.string(),
      name: z.string(),
      role: z.string(),
      tagline: z.string(),
      ctaLabel: z.string(),
      availabilityLabel: z.string(),
    }),
    en: z.object({
      greeting: z.string(),
      name: z.string(),
      role: z.string(),
      tagline: z.string(),
      ctaLabel: z.string(),
      availabilityLabel: z.string(),
    }),
  }),
  available: z.boolean(),
});

/* ---------- About ---------- */
const languageItem = z.object({ flag: z.string(), language: z.string(), level: z.string() });
// Bloques libres para añadir nuevos apartados a "Sobre mí" sin tocar código:
// cada uno tiene su propio título y una lista de tarjetas título/subtítulo.
const extraSection = z.object({
  heading: z.string(),
  items: z.array(z.object({ title: z.string(), subtitle: z.string() })),
});
const aboutSchema = sectionBase.extend({
  content: z.object({
    es: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
      highlights: z.array(z.object({ label: z.string(), value: z.string(), url: optionalUrl })),
      languagesHeading: z.string(),
      languages: z.array(languageItem),
      extraSections: z.array(extraSection),
    }),
    en: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
      highlights: z.array(z.object({ label: z.string(), value: z.string(), url: optionalUrl })),
      languagesHeading: z.string(),
      languages: z.array(languageItem),
      extraSections: z.array(extraSection),
    }),
  }),
});

/* ---------- Experience ---------- */
const experienceItem = z.object({
  id: z.string(),
  company: z.string(),
  companyUrl: optionalUrl,
  startDate: z.string(),
  endDate: z.string().nullable(),
  role: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
});
const experienceSchema = sectionBase.extend({
  content: z.object({
    es: z.object({ heading: z.string(), items: z.array(experienceItem) }),
    en: z.object({ heading: z.string(), items: z.array(experienceItem) }),
  }),
});

/* ---------- Education ---------- */
const educationItem = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  startYear: z.string(),
  endYear: z.string(),
  description: z.string(),
});
const educationSchema = sectionBase.extend({
  content: z.object({
    es: z.object({ heading: z.string(), items: z.array(educationItem) }),
    en: z.object({ heading: z.string(), items: z.array(educationItem) }),
  }),
});

/* ---------- Projects ---------- */
// "external": el nombre enlaza directo al sitio del proyecto (action.value).
// "modal": abre una ventana emergente con GitHub y demo/descarga.
// "none": solo el nombre, sin ningún enlace.
const projectAction = z.object({
  type: z.enum(["external", "modal", "none"]),
  value: z.string().optional(),
});
const projectItem = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  thumbnail: z.string().optional(),
  video: z.string().optional(),
  technologies: z.array(z.string()),
  status: z.enum(["live", "in-progress", "archived", "concept"]),
  githubUrl: optionalUrl,
  demoUrl: optionalUrl,
  demoLabel: z.string().optional(),
  action: projectAction,
});
const projectsSchema = sectionBase.extend({
  content: z.object({
    es: z.object({ heading: z.string(), items: z.array(projectItem) }),
    en: z.object({ heading: z.string(), items: z.array(projectItem) }),
  }),
});

/* ---------- Skills & Technologies (fusionado) ---------- */
const skillCategory = z.object({ id: z.string(), label: z.string(), items: z.array(z.string()) });
const skillsSchema = sectionBase.extend({
  content: z.object({
    es: z.object({ heading: z.string(), categories: z.array(skillCategory) }),
    en: z.object({ heading: z.string(), categories: z.array(skillCategory) }),
  }),
});

/* ---------- Certifications ---------- */
const certificationItem = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: optionalUrl,
});
const certificationsSchema = sectionBase.extend({
  content: z.object({
    es: z.object({ heading: z.string(), items: z.array(certificationItem) }),
    en: z.object({ heading: z.string(), items: z.array(certificationItem) }),
  }),
});

/* ---------- Timeline ---------- */
const timelineItem = z.object({ id: z.string(), year: z.string(), title: z.string(), description: z.string() });
const timelineSchema = sectionBase.extend({
  content: z.object({
    es: z.object({ heading: z.string(), items: z.array(timelineItem) }),
    en: z.object({ heading: z.string(), items: z.array(timelineItem) }),
  }),
});

/* ---------- Statistics ---------- */
const statisticItem = z.object({ id: z.string(), label: z.string(), value: z.number(), suffix: z.string().optional() });
const statisticsSchema = sectionBase.extend({
  content: z.object({
    es: z.object({ heading: z.string(), items: z.array(statisticItem) }),
    en: z.object({ heading: z.string(), items: z.array(statisticItem) }),
  }),
});

/* ---------- Contact ---------- */
const contactSchema = sectionBase.extend({
  content: z.object({
    es: z.object({
      heading: z.string(),
      subheading: z.string(),
      nameLabel: z.string(),
      emailLabel: z.string(),
      messageLabel: z.string(),
      submitLabel: z.string(),
      sendingLabel: z.string(),
      successMessage: z.string(),
      errorMessage: z.string(),
      validationError: z.string(),
    }),
    en: z.object({
      heading: z.string(),
      subheading: z.string(),
      nameLabel: z.string(),
      emailLabel: z.string(),
      messageLabel: z.string(),
      submitLabel: z.string(),
      sendingLabel: z.string(),
      successMessage: z.string(),
      errorMessage: z.string(),
      validationError: z.string(),
    }),
  }),
});

/* ---------- AWS Certification page (standalone, not part of the node menu) ---------- */
const awsCertLevel = z.enum(["foundational", "associate", "professional", "specialty"]);
const awsCertItem = z.object({
  id: z.string(),
  level: awsCertLevel,
  name: localizedText,
  obtained: z.boolean(),
});
const awsCertificationSchema = z.object({
  heading: localizedText,
  progressLabel: localizedText,
  backLabel: localizedText,
  levelLabels: z.object({
    foundational: localizedText,
    associate: localizedText,
    professional: localizedText,
    specialty: localizedText,
  }),
  items: z.array(awsCertItem),
});

/* ---------- Socials ---------- */
const socialItem = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string().url(),
  icon: z.string(),
});
const socialsSchema = z.object({
  items: z.array(socialItem),
});

/* ---------- SEO ---------- */
const seoSchema = z.object({
  siteName: z.string(),
  twitterHandle: z.string().optional(),
  defaultOgImage: z.string(),
  themeColorDark: z.string(),
  themeColorLight: z.string(),
});

/* ---------- Music ---------- */
const musicSchema = z.object({
  enabled: z.boolean(),
  trackUrl: z.string(),
  trackTitle: z.string(),
  defaultVolume: z.number().min(0).max(1),
});

/* ---------- Footer ---------- */
const footerSchema = sectionBase.extend({
  content: z.object({
    es: z.object({ copyrightText: z.string(), backHomeLabel: z.string() }),
    en: z.object({ copyrightText: z.string(), backHomeLabel: z.string() }),
  }),
});

/* ---------- Navigation / Theme ---------- */
const navigationSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
      enabled: z.boolean(),
      label: localizedText,
      icon: z.string(),
    }),
  ),
});

const themeSchema = z.object({
  defaultMode: z.enum(["light", "dark"]),
  allowUserToggle: z.boolean(),
});

function jsonCollection<T extends z.ZodTypeAny>(pattern: string, base: string, schema: T) {
  return defineCollection({ loader: glob({ pattern, base }), schema });
}

export const collections = {
  hero: jsonCollection("hero.json", "./src/content/json/hero", heroSchema),
  about: jsonCollection("about.json", "./src/content/json/about", aboutSchema),
  experience: jsonCollection("experience.json", "./src/content/json/experience", experienceSchema),
  education: jsonCollection("education.json", "./src/content/json/education", educationSchema),
  projects: jsonCollection("projects.json", "./src/content/json/projects", projectsSchema),
  skills: jsonCollection("skills.json", "./src/content/json/skills", skillsSchema),
  certifications: jsonCollection("certifications.json", "./src/content/json/certifications", certificationsSchema),
  timeline: jsonCollection("timeline.json", "./src/content/json/timeline", timelineSchema),
  statistics: jsonCollection("statistics.json", "./src/content/json/statistics", statisticsSchema),
  footer: jsonCollection("footer.json", "./src/content/json/footer", footerSchema),
  contact: jsonCollection("contact.json", "./src/content/json/contact", contactSchema),
  socials: jsonCollection("socials.json", "./src/content/json", socialsSchema),
  seo: jsonCollection("seo.json", "./src/content/json", seoSchema),
  music: jsonCollection("music.json", "./src/content/json", musicSchema),
  navigation: jsonCollection("navigation.json", "./src/content/json", navigationSchema),
  theme: jsonCollection("theme.json", "./src/content/json", themeSchema),
  awsCertification: jsonCollection("aws-certification.json", "./src/content/json", awsCertificationSchema),
};
