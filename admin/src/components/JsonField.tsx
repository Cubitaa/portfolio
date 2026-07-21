import { Fragment, useState } from "react";

/**
 * Este editor es deliberadamente genérico: en vez de programar un formulario
 * distinto para cada uno de los ~15 JSON del proyecto (y tener que tocar código
 * cada vez que se añade un campo), inspecciona la FORMA del valor y decide cómo
 * renderizarlo. Es el mismo principio que ya usa el sitio (todo configurable por
 * JSON) aplicado al propio editor.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonValue = any;

interface FieldProps {
  label: string;
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  depth: number;
}

function humanize(key: string): string {
  const withSpaces = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function isLocalizedPair(value: JsonValue): value is { es: unknown; en: unknown } {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === "en,es"
  );
}

function emptyLike(sample: JsonValue): JsonValue {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, emptyLike(v)]));
  }
  return null;
}

export default function JsonField({ label, value, onChange, depth }: FieldProps) {
  if (typeof value === "boolean") {
    return (
      <label className="field field-checkbox">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="field">
        <span className="field-label">{label}</span>
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </label>
    );
  }

  if (typeof value === "string") {
    const isLong = value.length > 70 || value.includes("\n");
    return (
      <label className="field">
        <span className="field-label">{label}</span>
        {isLong ? (
          <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </label>
    );
  }

  if (value === null) {
    return (
      <label className="field">
        <span className="field-label">
          {label} <em className="field-hint">(vacío / null)</em>
        </span>
        <input
          type="text"
          placeholder="—"
          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        />
      </label>
    );
  }

  if (Array.isArray(value)) {
    const itemsAreObjects = value.length > 0 && typeof value[0] === "object" && value[0] !== null;

    function updateItem(index: number, next: JsonValue) {
      const copy = [...value];
      copy[index] = next;
      onChange(copy);
    }
    function removeItem(index: number) {
      onChange(value.filter((_: JsonValue, i: number) => i !== index));
    }
    function moveItem(index: number, dir: -1 | 1) {
      const target = index + dir;
      if (target < 0 || target >= value.length) return;
      const copy = [...value];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      onChange(copy);
    }
    function addItem() {
      const template = value[0] ?? "";
      onChange([...value, emptyLike(template)]);
    }

    return (
      <fieldset className="field-array" style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <legend>{label}</legend>
        {value.map((item: JsonValue, index: number) => (
          <div className="array-item" key={index}>
            <div className="array-item-controls">
              <span className="array-item-index">#{index + 1}</span>
              <div className="array-item-buttons">
                <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} title="Subir">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === value.length - 1}
                  title="Bajar"
                >
                  ↓
                </button>
                <button type="button" className="danger" onClick={() => removeItem(index)} title="Eliminar">
                  ✕
                </button>
              </div>
            </div>
            {itemsAreObjects ? (
              <JsonField label="" value={item} onChange={(v) => updateItem(index, v)} depth={depth + 1} />
            ) : (
              <input type="text" value={item} onChange={(e) => updateItem(index, e.target.value)} />
            )}
          </div>
        ))}
        <button type="button" className="add-button" onClick={addItem}>
          + Añadir {label.toLowerCase()}
        </button>
      </fieldset>
    );
  }

  if (typeof value === "object") {
    if (isLocalizedPair(value)) {
      return <LocalizedFields label={label} value={value} onChange={onChange} depth={depth} />;
    }

    return (
      <fieldset className="field-object" style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        {label && <legend>{label}</legend>}
        {Object.entries(value).map(([key, val]) => (
          <JsonField
            key={key}
            label={humanize(key)}
            value={val}
            onChange={(next) => onChange({ ...value, [key]: next })}
            depth={depth + 1}
          />
        ))}
      </fieldset>
    );
  }

  return null;
}

function LocalizedFields({ label, value, onChange, depth }: FieldProps) {
  const [lang, setLang] = useState<"es" | "en">("es");

  return (
    <fieldset className="field-object localized" style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      {label && <legend>{label}</legend>}
      <div className="lang-tabs">
        <button type="button" className={lang === "es" ? "active" : ""} onClick={() => setLang("es")}>
          ES
        </button>
        <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
          EN
        </button>
      </div>
      <Fragment key={lang}>
        <JsonField
          label=""
          value={value[lang]}
          onChange={(next) => onChange({ ...value, [lang]: next })}
          depth={depth + 1}
        />
      </Fragment>
    </fieldset>
  );
}
