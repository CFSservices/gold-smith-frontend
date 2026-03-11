/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: 'local' | 'development' | 'qa' | 'uat' | 'production';
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_DEBUG_MODE: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_AUTH_REFRESH_KEY: string;
  readonly VITE_AUTH_TOKEN_EXPIRY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// SVG imports
declare module '*.svg' {
  const content: string;
  export default content;
}
