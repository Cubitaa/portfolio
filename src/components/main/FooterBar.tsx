import type { FooterBarData } from "@app-types/main";
import SocialIconReact from "./SocialIconReact";

interface Props {
  data: FooterBarData;
}

export default function FooterBar({ data }: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-center justify-between px-6 py-4 sm:px-12">
      <p className="pointer-events-auto hidden font-mono text-[11px] text-ink-muted sm:block">{data.copyrightText}</p>
      {data.socials.length > 0 && (
        <ul className="pointer-events-auto ml-auto flex items-center gap-3">
          {data.socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.url}
                target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-nebula-violet/20 text-ink-secondary transition-colors hover:border-nebula-cyan/60 hover:text-ink-primary focus-visible:outline-nebula-cyan"
              >
                <span className="sr-only">{social.label}</span>
                <SocialIconReact icon={social.icon} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
