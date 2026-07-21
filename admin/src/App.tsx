import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import SectionEditor from "./components/SectionEditor";
import { fetchSectionList, type SectionMeta } from "./api";

export default function App() {
  const [sections, setSections] = useState<SectionMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    fetchSectionList()
      .then((list) => {
        setSections(list);
        setActiveId(list[0]?.id ?? null);
      })
      .catch((err) => setConnectionError(err instanceof Error ? err.message : "Error desconocido"));
  }, []);

  if (connectionError) {
    return (
      <div className="app-error">
        <h1>No se pudo conectar con el admin-server</h1>
        <p>{connectionError}</p>
        <pre>cd admin-server{"\n"}npm install{"\n"}npm run start</pre>
      </div>
    );
  }

  const activeSection = sections.find((s) => s.id === activeId);

  return (
    <div className="app-shell">
      <Sidebar sections={sections} activeId={activeId} onSelect={setActiveId} />
      <main className="app-main">
        {activeSection ? (
          <SectionEditor key={activeSection.id} sectionId={activeSection.id} sectionLabel={activeSection.label} />
        ) : (
          <div className="panel-message">Selecciona una sección para empezar a editar.</div>
        )}
      </main>
    </div>
  );
}
