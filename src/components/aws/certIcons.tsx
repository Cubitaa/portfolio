// Iconografía propia (líneas geométricas genéricas) para cada certificado —
// no son las insignias oficiales de AWS, que son material con marca registrada
// y no puedo descargar/reproducir aquí. Si el usuario coloca su insignia real
// en badgeImage, esta se usa en su lugar (ver AwsCertificationPage.tsx).

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Cloud() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.2 8.1 4 4 0 0 1 16.5 18H7Z" />
    </svg>
  );
}
function Sparkles() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}
function Layers() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="m4 12 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </svg>
  );
}
function Code() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
    </svg>
  );
}
function Wrench() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
    </svg>
  );
}
function Database() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </svg>
  );
}
function Chip() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9.5 7V4M14.5 7V4M9.5 20v-3M14.5 20v-3M7 9.5H4M7 14.5H4M20 9.5h-3M20 14.5h-3" />
    </svg>
  );
}
function Compass() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="m14.5 9.5-1.8 4.2-4.2 1.8 1.8-4.2 4.2-1.8Z" />
    </svg>
  );
}
function Infinity() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M8 9a4 4 0 1 0 0 6c1.2 0 2-.6 4-3s2.8-3 4-3a4 4 0 1 1 0 6c-1.2 0-2-.6-4-3s-2.8-3-4-3Z" />
    </svg>
  );
}
function Network() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="m7.8 7.2 3 8.8M16.2 7.2l-3 8.8M8.2 6h7.6" />
    </svg>
  );
}
function Shield() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M12 3.5 19 6v6c0 4.2-3 7-7 8.5-4-1.5-7-4.3-7-8.5V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4.2" />
    </svg>
  );
}
function Brain() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <circle cx="7" cy="8" r="2.3" />
      <circle cx="17" cy="8" r="2.3" />
      <circle cx="7" cy="16" r="2.3" />
      <circle cx="17" cy="16" r="2.3" />
      <circle cx="12" cy="12" r="2.3" />
      <path d="M8.9 9.3 10 11M15.1 9.3 14 11M8.9 14.7 10 13M15.1 14.7 14 13" />
    </svg>
  );
}

export const CERT_ICONS: Record<string, () => JSX.Element> = {
  "cloud-practitioner": Cloud,
  "ai-practitioner": Sparkles,
  "solutions-architect-associate": Layers,
  "developer-associate": Code,
  "sysops-administrator-associate": Wrench,
  "data-engineer-associate": Database,
  "machine-learning-engineer-associate": Chip,
  "solutions-architect-professional": Compass,
  "devops-engineer-professional": Infinity,
  "advanced-networking-specialty": Network,
  "security-specialty": Shield,
  "machine-learning-specialty": Brain,
};

export function getCertIcon(id: string) {
  return CERT_ICONS[id] ?? Shield;
}
