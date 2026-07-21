import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://Cubitaa.github.io",
  base: "/portfolio",
  integrations: [react(), tailwind({ applyBaseStyles: false }), sitemap()],
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Todo el sitio es HTML estático — el formulario de contacto envía
  // directamente a Web3Forms desde el cliente, así que no hace falta ningún
  // adaptador ni ruta server-side.
  output: "static",
  // host: true expone el dev/preview server en 0.0.0.0 en vez de solo localhost,
  // para poder acceder desde otros dispositivos de la misma red (LAN).
  server: {
    host: true,
  },
});
