import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import vue from "@vitejs/plugin-vue";

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
    plugins: [vue(), ...copyPlugin],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: "/make-times-forward/",
  };
});
