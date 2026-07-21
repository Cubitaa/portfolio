import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { NavNodeData } from "@app-types/main";

interface Props {
  items: NavNodeData[];
  activeId: string | null;
  isZooming: boolean;
  zoomOrigin: { x: number; y: number } | null;
  onSelect: (id: string, origin: { x: number; y: number }) => void;
  centerLabel: string;
}

interface StarPosition {
  xPct: number;
  yPct: number;
}

/** Pseudo-aleatorio estable por índice (mismo resultado en cada render, sin parpadeos). */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Nada de estrella ni de línea puede quedar por encima de esta franja (en % del
 * contenedor): es donde vive el bloque de texto del héroe (nombre, rol, tagline),
 * superpuesto por encima de la constelación. */
const TOP_KEEP_OUT_PCT = 27;

/** Ningún nodo entra en esta franja pegada a cualquier otro borde del contenedor. */
const EDGE_MARGIN_PCT = 4;

/** Trazo fijo de la constelación: quién se conecta con quién, por id de sección. No es
 * automático a partir del orden/posición — es la ramificación pedida a mano:
 * Sobre mí → Formación → (Experiencia, Certificaciones, y estas dos entre sí); Sobre mí →
 * Competencias → Proyectos → Timeline; Sobre mí → Contacto. */
const CONSTELLATION_EDGES: [string, string][] = [
  ["about", "education"],
  ["education", "experience"],
  ["education", "certifications"],
  ["certifications", "experience"],
  ["about", "skills"],
  ["skills", "projects"],
  ["projects", "timeline"],
  ["about", "contact"],
];

/** De quién cuelga cada nodo (para calcular su posición, no para las líneas — eso lo
 * decide CONSTELLATION_EDGES). Todo lo que no aparece aquí cuelga directamente de "about". */
const TREE_PARENT: Record<string, string> = {
  education: "about",
  skills: "about",
  experience: "education",
  certifications: "education",
  projects: "skills",
  timeline: "projects",
};

interface BranchSpec {
  /** 0° = derecha, 90° = abajo, en el sentido habitual de coordenadas de pantalla. */
  angleDeg: number;
  /** Distancia al nodo padre, en % del contenedor. */
  radius: number;
}

/** Ángulo y radio de cada nodo relativos a su nodo padre (no al centro del contenedor):
 * cada rama crece desde donde ya quedó su padre, en su propia dirección, en vez de que
 * todos los nodos se repartan en un anillo genérico ajeno a quién se conecta con quién.
 * Elegidos a mano, rama por rama, para que el conjunto se lea como una constelación real. */
const BRANCH_SPEC: Record<string, BranchSpec> = {
  education: { angleDeg: 170, radius: 28 },
  skills: { angleDeg: 80, radius: 26 },
  experience: { angleDeg: 250, radius: 20 },
  certifications: { angleDeg: 140, radius: 22 },
  // Proyectos sigue el barrido hacia la derecha desde Competencias; Timeline sale hacia
  // arriba de Proyectos (no hacia abajo), y con radio corto no vuelve a acercarse a
  // Competencias.
  projects: { angleDeg: 20, radius: 24 },
  timeline: { angleDeg: 295, radius: 20 },
  // Contacto queda justo encima de "Sobre mí", a poca distancia (radio corto).
  contact: { angleDeg: 285, radius: 15 },
};

/** Hash estable de un id a un número, para darle a cada nodo su propio jitter sin
 * depender de su índice/orden en la lista (que ya no determina dónde cae). */
function hashSeed(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 9973;
  return hash;
}

function clampToContainer(pos: StarPosition): StarPosition {
  return {
    xPct: Math.min(Math.max(pos.xPct, EDGE_MARGIN_PCT), 100 - EDGE_MARGIN_PCT),
    yPct: Math.min(Math.max(pos.yPct, TOP_KEEP_OUT_PCT), 100 - EDGE_MARGIN_PCT),
  };
}

function treeDepth(id: string): number {
  let depth = 0;
  let current = id;
  while (TREE_PARENT[current] && depth < 10) {
    current = TREE_PARENT[current];
    depth += 1;
  }
  return depth;
}

/** Construye las posiciones creciendo el árbol desde "Sobre mí" hacia fuera: cada nodo
 * se coloca a un ángulo y radio propios (con jitter estable por id) respecto a la
 * posición YA resuelta de su padre, procesando primero los hijos directos y luego los
 * nietos. El resultado son ramas que crecen unas de otras, no puntos en un anillo
 * calculado que luego se conectan sin relación con su posición. */
function buildConstellationTree(ids: string[]): Map<string, StarPosition> {
  const resolved = new Map<string, StarPosition>([["about", { xPct: 50, yPct: 50 }]]);
  const order = [...ids].sort((a, b) => treeDepth(a) - treeDepth(b));

  for (const id of order) {
    const spec = BRANCH_SPEC[id];
    const parentPos = resolved.get(TREE_PARENT[id] ?? "about") ?? { xPct: 50, yPct: 50 };
    if (!spec) {
      resolved.set(id, clampToContainer(parentPos));
      continue;
    }
    const seed = hashSeed(id);
    const angleJitterDeg = (seededRandom(seed * 1.7 + 3) - 0.5) * 26;
    const radiusJitter = 0.85 + seededRandom(seed * 2.3 + 7) * 0.3;
    const angle = ((spec.angleDeg + angleJitterDeg) * Math.PI) / 180;
    const radius = spec.radius * radiusJitter;
    resolved.set(
      id,
      clampToContainer({
        xPct: parentPos.xPct + Math.cos(angle) * radius,
        yPct: parentPos.yPct + Math.sin(angle) * radius,
      }),
    );
  }

  return resolved;
}

/** Una estrella: bola de color plano y difuso (sin degradado interno), con un halo
 * (box-shadow) alrededor que le da el aire de estar iluminada.
 *
 * `color` es el triplete "R G B" de una custom property del tema (p. ej.
 * "var(--color-nebula-cyan)"), no un hex fijo: así la estrella sigue el color de acento
 * que le corresponda en cada tema en vez de quedarse pegada a los tonos del oscuro. */
function StarGlyph({ size, color }: { size: number; color: string }) {
  return (
    <span
      aria-hidden="true"
      className="block animate-pulse rounded-full transition-[width,height] duration-300"
      style={{
        width: size,
        height: size,
        animationDuration: "3.4s",
        background: `rgb(${color})`,
        boxShadow: `0 0 ${size * 1.1}px ${size * 0.3}px rgb(${color} / 0.35)`,
        filter: "blur(2px)",
      }}
    />
  );
}

/** Puntos iluminados alrededor de una estrella, uno por cada elemento que contiene la
 * sección (p. ej. nº de proyectos). Ángulo y radio llevan jitter estable por índice para
 * que el racimo se vea disperso y natural, no un anillo simétrico. */
function CountDots({ count, radius, color }: { count: number; radius: number; color: string }) {
  // La etiqueta de texto cuelga justo debajo de la estrella (ángulo ~90°): se deja un
  // hueco de ±50° ahí para que los puntos nunca la atraviesen, repartiendo el resto
  // del racimo en el arco restante de ~260°.
  const labelCenter = Math.PI / 2;
  const labelHalfWidth = (50 * Math.PI) / 180;
  const usableArc = Math.PI * 2 - labelHalfWidth * 2;
  const arcStart = labelCenter + labelHalfWidth;

  return (
    <span className="pointer-events-none absolute left-0 top-0" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const angleStep = usableArc / count;
        const angle = arcStart + i * angleStep + (seededRandom(i * 7.31 + 1) - 0.5) * angleStep * 0.7;
        const dotRadius = radius * (0.55 + seededRandom(i * 3.71 + 5) * 0.9);
        const x = Math.cos(angle) * dotRadius;
        const y = Math.sin(angle) * dotRadius;
        const delay = seededRandom(i * 2.13 + 3) * 2;
        return (
          <span
            key={i}
            className="absolute block h-[4px] w-[4px] rounded-full animate-pulse"
            style={{
              left: x,
              top: y,
              marginLeft: -2,
              marginTop: -2,
              background: `rgb(${color})`,
              boxShadow: `0 0 5px 2px rgb(${color} / 0.8)`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <span className="sr-only">{count}</span>
    </span>
  );
}

function NavStar({
  item,
  position,
  isActive,
  onSelect,
}: {
  item: NavNodeData;
  position: StarPosition;
  isActive: boolean;
  onSelect: (id: string, origin: { x: number; y: number }) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = isActive || hovered;
  const color = isActive ? "var(--color-nebula-violet)" : "var(--color-nebula-cyan)";
  const glyphSize = lit ? 22 : 16;

  function handleClick() {
    onSelect(item.id, { x: position.xPct, y: position.yPct });
  }

  return (
    <div className="absolute" style={{ left: `${position.xPct}%`, top: `${position.yPct}%` }}>
      {typeof item.itemCount === "number" && item.itemCount > 0 && (
        <CountDots count={item.itemCount} radius={lit ? 20 : 16} color="var(--color-nebula-amber)" />
      )}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="absolute left-0 top-0 flex w-max -translate-x-1/2 flex-col items-center gap-2 focus-visible:outline-nebula-cyan"
        style={{ marginTop: -(glyphSize / 2) }}
        aria-label={item.label}
      >
        <StarGlyph size={glyphSize} color={color} />
        <span
          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-center font-mono text-[11px] tracking-wide backdrop-blur-sm transition-colors ${
            isActive ? "bg-nebula-violet/20 text-nebula-violet" : "bg-void/30 text-ink-secondary hover:text-ink-primary"
          }`}
        >
          {item.label}
        </span>
      </button>
    </div>
  );
}

function CenterStar({ label, onSelect }: { label: string; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const size = hovered ? 40 : 34;

  return (
    <div className="absolute left-1/2 top-1/2">
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="absolute left-0 top-0 flex w-max -translate-x-1/2 flex-col items-center gap-2 focus-visible:outline-nebula-cyan"
        style={{ marginTop: -(size / 2) }}
        aria-label={label}
      >
        <StarGlyph size={size} color="var(--color-nebula-amber)" />
        <span className="whitespace-nowrap rounded-full bg-nebula-amber/15 px-2.5 py-1 text-center font-mono text-[11px] tracking-wide text-nebula-amber backdrop-blur-sm">
          {label}
        </span>
      </button>
    </div>
  );
}

export default function Constellation({ items, activeId, isZooming, zoomOrigin, onSelect, centerLabel }: Props) {
  const positionById = useMemo(() => buildConstellationTree(items.map((item) => item.id)), [items]);

  function handleSelectCenter() {
    onSelect("about", { x: 50, y: 50 });
  }

  return (
    <motion.div
      animate={isZooming ? { scale: 2.6, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformOrigin: zoomOrigin ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : "50% 50%",
        pointerEvents: isZooming ? "none" : "auto",
      }}
      className="relative aspect-square h-[min(94vh,92vw,1000px)] w-[min(94vh,92vw,1000px)]"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {CONSTELLATION_EDGES.map(([fromId, toId]) => {
          const from = positionById.get(fromId);
          const to = positionById.get(toId);
          if (!from || !to) return null;
          return (
            <line
              key={`link-${fromId}-${toId}`}
              x1={from.xPct}
              y1={from.yPct}
              x2={to.xPct}
              y2={to.yPct}
              strokeWidth={0.1}
              className="stroke-nebula-violet/15"
            />
          );
        })}
      </svg>

      <CenterStar label={centerLabel} onSelect={handleSelectCenter} />

      {items.map((item) => (
        <NavStar
          key={item.id}
          item={item}
          position={positionById.get(item.id) ?? { xPct: 50, yPct: 50 }}
          isActive={activeId === item.id}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
}
