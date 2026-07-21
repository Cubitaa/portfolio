import type { SectionMeta } from "../api";

interface Props {
  sections: SectionMeta[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function Sidebar({ sections, activeId, onSelect }: Props) {
  const groups = sections.reduce<Record<string, SectionMeta[]>>((acc, section) => {
    (acc[section.group] ??= []).push(section);
    return acc;
  }, {});

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-dot" aria-hidden="true" />
        Admin — Portafolio
      </div>
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="sidebar-group">
          <p className="sidebar-group-label">{group}</p>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${activeId === item.id ? "active" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}
