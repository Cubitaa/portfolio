import { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { themeMode } from "@store/themeStore";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftSpeed: number;
  parallax: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  life: number;
  maxLife: number;
}

const LAYERS_DESKTOP = [
  { count: 150, radius: [0.3, 0.7], alpha: [0.22, 0.45], drift: [0.002, 0.006], parallax: 6 },
  { count: 85, radius: [0.6, 1.2], alpha: [0.32, 0.6], drift: [0.006, 0.014], parallax: 14 },
  { count: 36, radius: [1.1, 1.9], alpha: [0.48, 0.8], drift: [0.014, 0.026], parallax: 26 },
];
const LAYERS_MOBILE = [
  { count: 70, radius: [0.3, 0.7], alpha: [0.22, 0.45], drift: [0.002, 0.006], parallax: 4 },
  { count: 40, radius: [0.6, 1.2], alpha: [0.32, 0.6], drift: [0.006, 0.014], parallax: 8 },
  { count: 16, radius: [1.1, 1.9], alpha: [0.48, 0.8], drift: [0.014, 0.026], parallax: 14 },
];

const PALETTE = {
  dark: {
    star: "245, 243, 255",
    nebulaA: "107, 79, 224",
    nebulaB: "63, 217, 199",
    nebulaC: "242, 166, 90",
    band: "245, 243, 255",
    auroraA: "63, 217, 199",
    auroraB: "107, 79, 224",
    nebulaComposite: "source-over" as GlobalCompositeOperation,
    nebulaAlpha: [0.16, 0.13, 0.09],
    auroraComposite: "screen" as GlobalCompositeOperation,
    auroraAlpha: 0.16,
    bandAlpha: 0.045,
  },
  light: {
    // Colores más saturados y vívidos que en oscuro, y con más alpha: con "multiply"
    // sobre un fondo claro, un lavado pálido apenas se nota, hace falta color con cuerpo
    // (y más presencia) para que se lea igual de bien que en el tema oscuro.
    // Paleta azul (en vez de roja) para que se asemeje más al espacio incluso en zonas claras.
    star: "45, 55, 80",
    nebulaA: "37, 99, 235",
    nebulaB: "14, 165, 233",
    nebulaC: "30, 64, 175",
    band: "90, 100, 140",
    auroraA: "14, 165, 233",
    auroraB: "37, 99, 235",
    nebulaComposite: "multiply" as GlobalCompositeOperation,
    nebulaAlpha: [0.22, 0.19, 0.16],
    auroraComposite: "multiply" as GlobalCompositeOperation,
    auroraAlpha: 0.18,
    bandAlpha: 0.12,
  },
} as const;

function randomBetween([min, max]: number[]): number {
  return Math.random() * (max - min) + min;
}

export default function SpaceBackground() {
  const mode = useStore(themeMode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<Star[][]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const rafRef = useRef<number>(0);
  const nextMeteorAtRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const layers = width < 768 ? LAYERS_MOBILE : LAYERS_DESKTOP;
      layersRef.current = layers.map((layer) =>
        Array.from({ length: layer.count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: randomBetween(layer.radius),
          baseAlpha: randomBetween(layer.alpha),
          twinkleSpeed: Math.random() * 0.015 + 0.004,
          twinklePhase: Math.random() * Math.PI * 2,
          driftSpeed: randomBetween(layer.drift),
          parallax: layer.parallax,
        })),
      );
    }

    function handlePointerMove(event: PointerEvent) {
      mouseRef.current = {
        x: (event.clientX / width) * 2 - 1,
        y: (event.clientY / height) * 2 - 1,
      };
    }

    function spawnMeteor() {
      meteorsRef.current.push({
        x: Math.random() * width * 0.6 + width * 0.2,
        y: -20,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 6 + 8,
        angle: (Math.PI / 4) * (Math.random() > 0.5 ? 1 : 1.3),
        life: 0,
        maxLife: 60,
      });
      nextMeteorAtRef.current = Date.now() + Math.random() * 9000 + 7000;
    }

    resize();
    window.addEventListener("resize", resize);
    if (hasFinePointer && !reducedMotion) window.addEventListener("pointermove", handlePointerMove);
    nextMeteorAtRef.current = Date.now() + Math.random() * 6000 + 4000;

    function draw(time: number) {
      const palette = PALETTE[mode];

      // Suaviza el movimiento del ratón (inercia) para que el parallax no sea brusco
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.04;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.04;
      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;

      ctx!.clearRect(0, 0, width, height);

      // Nebulosas de fondo (se mueven muy poco con el ratón — están "lejos").
      // En claro usan "multiply" (oscurecen/tiñen) en vez de sumar luz sobre un fondo ya claro.
      ctx!.save();
      ctx!.globalCompositeOperation = palette.nebulaComposite;

      const nebulaA = ctx!.createRadialGradient(
        width * 0.18 - mx * 10,
        height * 0.22 - my * 10,
        0,
        width * 0.18 - mx * 10,
        height * 0.22 - my * 10,
        width * 0.6,
      );
      nebulaA.addColorStop(0, `rgba(${palette.nebulaA}, ${palette.nebulaAlpha[0]})`);
      nebulaA.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = nebulaA;
      ctx!.fillRect(0, 0, width, height);

      const nebulaB = ctx!.createRadialGradient(
        width * 0.82 - mx * 14,
        height * 0.78 - my * 14,
        0,
        width * 0.82 - mx * 14,
        height * 0.78 - my * 14,
        width * 0.55,
      );
      nebulaB.addColorStop(0, `rgba(${palette.nebulaB}, ${palette.nebulaAlpha[1]})`);
      nebulaB.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = nebulaB;
      ctx!.fillRect(0, 0, width, height);

      const nebulaC = ctx!.createRadialGradient(width * 0.72, height * 0.12, 0, width * 0.72, height * 0.12, width * 0.38);
      nebulaC.addColorStop(0, `rgba(${palette.nebulaC}, ${palette.nebulaAlpha[2]})`);
      nebulaC.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = nebulaC;
      ctx!.fillRect(0, 0, width, height);
      ctx!.restore();

      // Aurora — dos bandas onduladas translúcidas cerca de la parte superior
      ctx!.save();
      ctx!.globalCompositeOperation = palette.auroraComposite;
      [
        { color: palette.auroraA, baseY: height * 0.08, amp: 46, speed: 0.00042, offset: 0 },
        { color: palette.auroraB, baseY: height * 0.16, amp: 34, speed: 0.00031, offset: Math.PI },
      ].forEach((wave) => {
        ctx!.beginPath();
        ctx!.moveTo(0, wave.baseY);
        for (let x = 0; x <= width; x += 24) {
          const y = wave.baseY + Math.sin(x * 0.006 + time * wave.speed + wave.offset) * wave.amp + my * -18;
          ctx!.lineTo(x, y);
        }
        ctx!.lineTo(width, 0);
        ctx!.lineTo(0, 0);
        ctx!.closePath();
        const auroraGrad = ctx!.createLinearGradient(0, 0, 0, wave.baseY + wave.amp * 2);
        auroraGrad.addColorStop(0, "rgba(0,0,0,0)");
        auroraGrad.addColorStop(1, `rgba(${wave.color}, ${palette.auroraAlpha})`);
        ctx!.fillStyle = auroraGrad;
        ctx!.fill();
      });
      ctx!.restore();

      // Banda tipo "vía láctea"
      ctx!.save();
      ctx!.translate(width * 0.5, height * 0.5);
      ctx!.rotate(-0.4);
      const band = ctx!.createLinearGradient(-width * 0.7, 0, width * 0.7, 0);
      band.addColorStop(0, "rgba(0,0,0,0)");
      band.addColorStop(0.5, `rgba(${palette.band}, ${palette.bandAlpha})`);
      band.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = band;
      ctx!.fillRect(-width, -height * 0.18, width * 2, height * 0.36);
      ctx!.restore();

      for (const layer of layersRef.current) {
        for (const star of layer) {
          if (!reducedMotion) {
            star.y += star.driftSpeed;
            if (star.y > height + 4) {
              star.y = -4;
              star.x = Math.random() * width;
            }
          }
          const px = star.x + mx * star.parallax;
          const py = star.y + my * star.parallax;
          const twinkle = reducedMotion ? star.baseAlpha : star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.25;
          ctx!.beginPath();
          ctx!.arc(px, py, star.radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${palette.star}, ${Math.max(0, Math.min(1, twinkle))})`;
          ctx!.fill();
        }
      }

      if (!reducedMotion) {
        if (Date.now() > nextMeteorAtRef.current) spawnMeteor();

        meteorsRef.current = meteorsRef.current.filter((m) => m.life < m.maxLife);
        for (const meteor of meteorsRef.current) {
          meteor.life += 1;
          meteor.x += Math.cos(meteor.angle) * meteor.speed;
          meteor.y += Math.sin(meteor.angle) * meteor.speed;
          const fade = 1 - meteor.life / meteor.maxLife;
          const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
          const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;
          const grad = ctx!.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          grad.addColorStop(0, `rgba(${palette.star}, ${0.9 * fade})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.4;
          ctx!.beginPath();
          ctx!.moveTo(meteor.x, meteor.y);
          ctx!.lineTo(tailX, tailY);
          ctx!.stroke();
        }
      }

      if (!reducedMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    draw(0);
    if (reducedMotion) draw(0);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700"
    />
  );
}
