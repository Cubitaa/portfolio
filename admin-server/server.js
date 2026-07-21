const path = require("path");
const express = require("express");
const fs = require("fs/promises");
const { SECTIONS, getSection } = require("./config");
const { commitAndPush } = require("./deploy");

const app = express();
const PORT = process.env.ADMIN_PORT || 4321 + 1000; // 5321, para no chocar con astro dev (4321)

// Solo loopback: la autenticación vive ahora en admin-hub, que hace de único
// punto de entrada público y reenvía aquí sobre localhost. Este servidor no
// debe ser alcanzable desde la LAN ni desde internet directamente.
const HOST = "127.0.0.1";

app.use(express.json({ limit: "2mb" }));

app.get("/api/sections", (_req, res) => {
  res.json(SECTIONS.map(({ id, label, group }) => ({ id, label, group })));
});

app.get("/api/sections/:id", async (req, res) => {
  const section = getSection(req.params.id);
  if (!section) return res.status(404).json({ error: "unknown_section" });

  try {
    const raw = await fs.readFile(section.file, "utf-8");
    res.json({ id: section.id, data: JSON.parse(raw) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "read_failed" });
  }
});

app.put("/api/sections/:id", async (req, res) => {
  const section = getSection(req.params.id);
  if (!section) return res.status(404).json({ error: "unknown_section" });

  const { data } = req.body;
  if (data === undefined || typeof data !== "object" || data === null) {
    return res.status(400).json({ error: "invalid_payload" });
  }

  try {
    // Backup rápido antes de sobrescribir, por si algo sale mal al editar
    const raw = await fs.readFile(section.file, "utf-8");
    await fs.writeFile(`${section.file}.bak`, raw, "utf-8");

    await fs.writeFile(section.file, JSON.stringify(data, null, 2) + "\n", "utf-8");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "write_failed" });
  }

  // El guardado local ya está hecho pase lo que pase a partir de aquí — si
  // el commit/push falla (sin red, conflicto…) se avisa pero no se trata
  // como fallo del guardado en sí.
  try {
    const { pushed } = await commitAndPush(section.file, section.id);
    res.json({ success: true, deployed: pushed });
  } catch (err) {
    console.error("commit/push falló:", err);
    res.json({ success: true, deployed: false, deployError: err.message });
  }
});

// Sirve el build de admin/ para que admin-hub tenga un puerto estable al
// que reenviar (sin necesidad de mantener vivo el dev server de Vite).
const ADMIN_DIST = path.join(__dirname, "..", "admin", "dist");
app.use(express.static(ADMIN_DIST));
app.get("*", (_req, res) => res.sendFile(path.join(ADMIN_DIST, "index.html")));

app.listen(PORT, HOST, () => {
  console.log(`\n  Admin server escuchando en http://${HOST}:${PORT} (solo localhost)`);
  console.log(`  Accesible únicamente a través de admin-hub.\n`);
});
