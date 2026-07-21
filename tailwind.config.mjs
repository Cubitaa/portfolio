/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        void: "rgb(var(--color-void) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        nebula: {
          violet: "rgb(var(--color-nebula-violet) / <alpha-value>)",
          cyan: "rgb(var(--color-nebula-cyan) / <alpha-value>)",
          amber: "rgb(var(--color-nebula-amber) / <alpha-value>)",
        },
        ink: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      transitionTimingFunction: {
        "orbit": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
