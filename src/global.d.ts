export {};

declare global {
  interface Window {
    __HOST_APP_CONFIG__?: {
      HOST_OKTA_CLIENT_ID?: string;
      HOST_OKTA_ISSUER_URI?: string;
      HOST_OKTA_CLIENT_ORIGIN?: string;
    };
  }
}
