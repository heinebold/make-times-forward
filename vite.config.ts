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
        manifest: {
          icons: [{ src: "pwa-256.png", sizes: "256x256", type: "image/png" }],
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
