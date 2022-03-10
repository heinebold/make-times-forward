import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

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
              },
            ],
          }),
        ]
      : [];
  return {
    plugins: [
      vue(),
      vueI18n({
        include: fileURLToPath(new URL("./src/i18n/locales", import.meta.url)),
      }),
      ...copyPlugin,
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: "/make-times-forward/",
  };
});
