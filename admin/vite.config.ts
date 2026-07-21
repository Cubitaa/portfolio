import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Rutas relativas en el build: admin-server sirve este build tanto en su
  // propia raíz (acceso directo) como bajo /p/portfolio/ (proxeado desde
  // admin-hub) — con base "/" los assets se romperían en el segundo caso.
  base: "./",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      "/api": "http://127.0.0.1:5321",
    },
  },
});
