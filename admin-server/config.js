const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const JSON_ROOT = path.join(PROJECT_ROOT, "src", "content", "json");

/**
 * Lista blanca de secciones editables. El id nunca se usa para construir una
 * ruta directamente desde la petición — solo se busca en este mapa. Así el
 * servidor no puede escribir fuera de src/content/json bajo ninguna circunstancia.
 */
const SECTIONS = [
  { id: "hero", label: "Hero", group: "Contenido", file: path.join(JSON_ROOT, "hero", "hero.json") },
  { id: "about", label: "Sobre mí", group: "Contenido", file: path.join(JSON_ROOT, "about", "about.json") },
  { id: "experience", label: "Experiencia", group: "Contenido", file: path.join(JSON_ROOT, "experience", "experience.json") },
  { id: "education", label: "Formación", group: "Contenido", file: path.join(JSON_ROOT, "education", "education.json") },
  { id: "projects", label: "Proyectos", group: "Contenido", file: path.join(JSON_ROOT, "projects", "projects.json") },
  { id: "skills", label: "Habilidades & Tecnologías", group: "Contenido", file: path.join(JSON_ROOT, "skills", "skills.json") },
  { id: "certifications", label: "Certificaciones", group: "Contenido", file: path.join(JSON_ROOT, "certifications", "certifications.json") },
  { id: "timeline", label: "Timeline", group: "Contenido", file: path.join(JSON_ROOT, "timeline", "timeline.json") },
  { id: "statistics", label: "Estadísticas", group: "Contenido", file: path.join(JSON_ROOT, "statistics", "statistics.json") },
  { id: "contact", label: "Contacto", group: "Contenido", file: path.join(JSON_ROOT, "contact", "contact.json") },
  { id: "footer", label: "Footer", group: "Contenido", file: path.join(JSON_ROOT, "footer", "footer.json") },
  { id: "navigation", label: "Navegación", group: "Configuración", file: path.join(JSON_ROOT, "navigation.json") },
  { id: "theme", label: "Tema", group: "Configuración", file: path.join(JSON_ROOT, "theme.json") },
  { id: "socials", label: "Redes sociales", group: "Configuración", file: path.join(JSON_ROOT, "socials.json") },
  { id: "seo", label: "SEO", group: "Configuración", file: path.join(JSON_ROOT, "seo.json") },
  { id: "music", label: "Música", group: "Configuración", file: path.join(JSON_ROOT, "music.json") },
];

function getSection(id) {
  return SECTIONS.find((s) => s.id === id) ?? null;
}

module.exports = { SECTIONS, getSection, PROJECT_ROOT, JSON_ROOT };
