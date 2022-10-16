/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
interface ImportMetaEnv {
  readonly VITE_SERVER_SUPPORTS_HISTORY: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
