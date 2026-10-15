import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

// Served from https://vaibhav-labs.github.io/TA/ (a GitHub Pages project site),
// so every root-relative path needs this prefix — see .github/workflows/deploy.yml.
const base = "/TA/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,json,ico,png,svg,woff2}"],
        // The First Transaction mini-game series (public/first-transaction/) is its own
        // standalone PWA with its own manifest + service worker (scope /TA/first-transaction/).
        // Excluded here so the two apps' service workers don't both try to control those pages.
        globIgnores: ["first-transaction/**"],
      },
      manifest: {
        name: "TA Arena",
        short_name: "TA Arena",
        description: "A Transactional Analysis mastery game across seven worlds.",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: base,
        scope: base,
        icons: [
          { src: `${base}icon-192.png`, sizes: "192x192", type: "image/png" },
          { src: `${base}icon-512.png`, sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  test: {
    environment: "node",
    globals: true,
  },
});
