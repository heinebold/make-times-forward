import pluginVue from "eslint-plugin-vue";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import prettierConfig from "@vue/eslint-config-prettier";
import pluginPlaywright from "eslint-plugin-playwright";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: [
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  prettierConfig,
  {
    name: "e2e/playwright-rules",
    plugins: { playwright: pluginPlaywright },
    files: ["e2e/**/*.spec.ts"],
    rules: {
      ...pluginPlaywright.configs.recommended.rules,
    },
  },
);
