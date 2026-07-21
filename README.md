# Portafolio Espacial

Portfolio personal construido con Astro y React: una única pantalla con un sistema de nodos tipo "sistema solar" para navegar entre secciones (Sobre mí, Experiencia, Formación, Proyectos, Competencias, Certificaciones, Timeline, Estadísticas, Contacto), en vez de scroll tradicional.

## Stack

- **Astro 5** — HTML estático + islas de React solo donde hay interactividad (fondo, navegación, cursor, tema).
- **React** — fondo espacial, sistema de nodos + panel lateral, toggle de tema.
- **nanostores** — estado del tema, compartido entre islas.
- **Tailwind CSS** — tokens de diseño mapeados a variables CSS para el cambio de tema.
- **Zod + Astro Content Layer** — todo el contenido vive en JSON, validado en build time contra esquemas tipados.
- **Web3Forms** — formulario de contacto, sin backend propio (el sitio es estático, desplegado en GitHub Pages).

## Cómo ejecutar

```bash
npm install
cp .env.example .env   # rellena PUBLIC_WEB3FORMS_ACCESS_KEY
npm run dev
```

Otros comandos:

```bash
npm run build     # type-check + build de producción
npm run preview   # sirve el build localmente
npm run lint
npm run format
```

## Contenido

Todo el copy del sitio vive en `src/content/json/**/*.json`, validado contra los esquemas Zod de `src/content.config.ts`. Cada campo tiene su versión en español e inglés (`{ es, en }`); las rutas son `/` (ES, por defecto) y `/en`.

## Estructura

```
src/
├── components/
│   ├── main/{MainScreen,NodeOrbit}.tsx   # navegación de nodos
│   ├── sections/                          # contenido de cada panel
│   ├── background/SpaceBackground.tsx
│   └── ui/{ThemeToggle.tsx,LangToggle.astro}
├── content/json/            # todo el contenido editable
├── content.config.ts        # esquemas Zod de cada colección
├── i18n/{ui.ts,utils.ts}
├── layouts/BaseLayout.astro
├── store/themeStore.ts
├── styles/global.css
└── pages/{index.astro, en/index.astro}
```

## Despliegue

Push a `main` dispara `astro build` y publica en GitHub Pages vía GitHub Actions (`.github/workflows/deploy.yml`).
