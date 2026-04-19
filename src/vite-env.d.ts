/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LDRAW_CDN_BASE: string;
  readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
