

/// <reference types="vite/client" />
/// <reference path="./federation.d.ts" />

interface ImportMetaEnv {
  readonly VITE_HOST_OKTA_CLIENT_ID?: string;
  readonly VITE_HOST_OKTA_ISSUER_URI?: string;
  readonly VITE_HOST_OKTA_CLIENT_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}