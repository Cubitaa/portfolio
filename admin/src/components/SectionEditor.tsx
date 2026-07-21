import { useEffect, useState } from "react";
import JsonField from "./JsonField";
import { fetchSection, saveSection } from "../api";

interface Props {
  sectionId: string;
  sectionLabel: string;
}

type SaveState = "idle" | "saving" | "saved" | "saved-not-deployed" | "error";

export default function SectionEditor({ sectionId, sectionLabel }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [dirty, setDirty] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setLoadError(null);
    setDirty(false);
    setSaveState("idle");

    fetchSection(sectionId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Error desconocido");
      });

    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  async function handleSave() {
    setSaveState("saving");
    setDeployError(null);
    try {
      const result = await saveSection(sectionId, data);
      setDirty(false);
      if (result.deployed) {
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2500);
      } else {
        setSaveState("saved-not-deployed");
        if (result.deployError) setDeployError(result.deployError);
      }
    } catch {
      setSaveState("error");
    }
  }

  if (loadError) {
    return (
      <div className="panel-message error">
        <p>{loadError}</p>
        <p className="field-hint">
          Comprueba que el servidor admin está arrancado: <code>cd admin-server && npm run start</code>
        </p>
      </div>
    );
  }

  if (data === null) {
    return <div className="panel-message">Cargando {sectionLabel}…</div>;
  }

  return (
    <div className="section-editor">
      <div className="section-editor-header">
        <h1>{sectionLabel}</h1>
        <div className="save-row">
          {saveState === "saved" && <span className="save-status success">Guardado y publicado ✓</span>}
          {saveState === "saved-not-deployed" && (
            <span className="save-status pending" title={deployError ?? undefined}>
              Guardado, pero no se pudo publicar{deployError ? ` (${deployError})` : ""}
            </span>
          )}
          {saveState === "error" && <span className="save-status error">Error al guardar</span>}
          {dirty && saveState === "idle" && <span className="save-status pending">Cambios sin guardar</span>}
          <button type="button" className="save-button" onClick={handleSave} disabled={saveState === "saving"}>
            {saveState === "saving" ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      <JsonField
        label=""
        value={data}
        onChange={(next) => {
          setData(next);
          setDirty(true);
        }}
        depth={0}
      />
    </div>
  );
}
