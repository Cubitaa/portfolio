interface Props {
  code: string;
}

// Emoji de bandera reales (regional indicators) no se renderizan como imagen
// en muchas versiones de Windows — aparecen como el texto "ES"/"US". Se usan
// SVGs propios para que se vean igual en cualquier dispositivo.
export default function FlagIcon({ code }: Props) {
  const common = { width: 20, height: 14, viewBox: "0 0 20 14", "aria-hidden": true } as const;

  if (code.toLowerCase() === "es") {
    return (
      <svg {...common}>
        <rect width="20" height="14" fill="#AA151B" />
        <rect y="3.5" width="20" height="7" fill="#F1BF00" />
      </svg>
    );
  }
  if (code.toLowerCase() === "us") {
    return (
      <svg {...common}>
        <rect width="20" height="14" fill="#B22234" />
        {[1, 3, 5, 7, 9, 11].map((y) => (
          <rect key={y} y={y} width="20" height="1" fill="#FFFFFF" />
        ))}
        <rect width="9" height="7.5" fill="#3C3B6E" />
      </svg>
    );
  }
  return <span className="font-mono text-[10px] uppercase text-ink-muted">{code}</span>;
}
