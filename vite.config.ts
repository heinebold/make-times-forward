import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

const base = "/make-times-forward/";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const copyPlugin =
    command === "build" && mode === "apache"
      ? [
          viteStaticCopy({
            targets: [
              {
                src: "src/.htaccess",
                dest: "",
                transform: {
                  encoding: "utf-8",
                  handler: (content: string) =>
                    content.replace("{{base}}", base),
                },
              },
            ],
          }),
        ]
      : [];
  return {
    base,
    plugins: [
      vue(),
      VitePWA({
        manifestFilename: "pwa/manifest.webmanifest",
        injectRegister: "inline",
        includeManifestIcons: false,
        includeAssets: ["pwa/icon-maskable-384.png"],
        workbox: {
          globPatterns: [
            "**/*.{js,css,html}",
            "assets/Single-ding-dong-tubular-bell.*.mp3",
          ],
          runtimeCaching: [
            {
              urlPattern: /.+\.[0-9a-f]{8}\.[^/]+$/i,
              handler: "CacheFirst",
              options: {
                rangeRequests: true,
              },
            },
            {
              urlPattern: /pwa\/icon(-maskable)?-\d+.*/i,
              handler: "StaleWhileRevalidate",
              options: {
                precacheFallback: {
                  fallbackURL: `${base}pwa/icon-maskable-384.png`,
                },
              },
            },
            {
              urlPattern: /\.[^/]+$/i,
              handler: "StaleWhileRevalidate",
            },
          ],
        },
        manifest: {
          id: base,
          name: "Make Times Forward",
          short_name: "Make Times Forward",
          display_override: [
            "fullscreen",
            "window-controls-overlay",
            "standalone",
          ],
          display: "fullscreen",
          background_color: "#808080",
          icons: [
            { src: "icon-32.png", sizes: "32x32", type: "image/png" },
            { src: "icon-64.png", sizes: "64x64", type: "image/png" },
            {
              src: "icon-128.png",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "icon-256.png",
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: "icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "icon-maskable-48.png",
              sizes: "48x48",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icon-maskable-72.png",
              sizes: "72x72",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icon-maskable-96.png",
              sizes: "96x96",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icon-maskable-128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icon-maskable-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icon-maskable-384.png",
              sizes: "384x384",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
      ...copyPlugin,
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
