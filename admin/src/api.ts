// Sin barra inicial a propósito: debe resolver relativo a la página actual,
// no a la raíz del dominio. Servido en la raíz de admin-server ("/") esto
// pide "/api/...", pero detrás del proxy de admin-hub ("/p/portfolio/") pide
// "/p/portfolio/api/...", que es lo que el proxy reenvía correctamente.
const API_BASE = "api";

export interface SectionMeta {
  id: string;
  label: string;
  group: string;
}

export async function fetchSectionList(): Promise<SectionMeta[]> {
  const res = await fetch(`${API_BASE}/sections`);
  if (!res.ok) throw new Error("No se pudo conectar con el admin-server. ¿Está arrancado?");
  return res.json();
}

export async function fetchSection(id: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/sections/${id}`);
  if (!res.ok) throw new Error(`No se pudo cargar "${id}"`);
  const body = await res.json();
  return body.data;
}

export interface SaveResult {
  deployed: boolean;
  deployError?: string;
}

export async function saveSection(id: string, data: unknown): Promise<SaveResult> {
  const res = await fetch(`${API_BASE}/sections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error(`No se pudo guardar "${id}"`);
  const body = await res.json();
  return { deployed: Boolean(body.deployed), deployError: body.deployError };
}
