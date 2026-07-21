import { useEffect, useRef, useState } from "react";
import type { Lang } from "@i18n/utils";

interface Props {
  trackUrl: string;
  trackTitle: string;
  defaultVolume: number;
  lang?: Lang;
}

export default function MusicPlayer({ trackUrl, trackTitle, defaultVolume, lang = "es" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.volume = volume;
    audio.addEventListener("error", () => setHasError(true));
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  async function toggle() {
    if (!audioRef.current || hasError) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setHasError(true);
      }
    }
  }

  if (hasError) return null;

  return (
    <div className="fixed bottom-6 left-6 z-30 flex items-center gap-2 rounded-full border border-nebula-violet/30 bg-surface/50 px-3 py-2 backdrop-blur-md">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isPlaying}
        aria-label={
          isPlaying
            ? `${lang === "es" ? "Pausar" : "Pause"} ${trackTitle}`
            : `${lang === "es" ? "Reproducir" : "Play"} ${trackTitle}`
        }
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-nebula-violet/30 text-ink-secondary transition-colors hover:border-nebula-cyan/60 hover:text-ink-primary focus-visible:outline-nebula-cyan"
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
            <rect x="5" y="4" width="5" height="16" />
            <rect x="14" y="4" width="5" height="16" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
            <path d="M6 4l15 8-15 8V4z" />
          </svg>
        )}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label={lang === "es" ? "Volumen" : "Volume"}
        className="h-1 w-16 cursor-pointer accent-nebula-cyan"
      />
    </div>
  );
}
