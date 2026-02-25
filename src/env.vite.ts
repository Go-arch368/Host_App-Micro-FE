// env.vite.ts

type RuntimeConfig = {
  HOST_OKTA_CLIENT_ID?: string;
  HOST_OKTA_ISSUER_URI?: string;
  HOST_OKTA_CLIENT_ORIGIN?: string;
};

const DEFAULT_OKTA_CLIENT_ID = "0oartbtwuyeIr1GPT1d7";
const DEFAULT_OKTA_ISSUER_URI =
  "https://multiplan-dev.oktapreview.com/oauth2/default";
const DEFAULT_OKTA_CLIENT_ORIGIN = "http://localhost:3030";

const loadRuntimeConfigFromFile = (): RuntimeConfig | undefined => {
  if (typeof window === "undefined" || typeof XMLHttpRequest === "undefined") {
    return undefined;
  }

  const existingConfig = window.__HOST_APP_CONFIG__;
  if (existingConfig) {
    return existingConfig;
  }

  try {
    const runtimeUrl = new URL("../runtime-config.json", import.meta.url);
    runtimeUrl.searchParams.set("ts", Date.now().toString());
    const request = new XMLHttpRequest();
    request.open("GET", runtimeUrl.toString(), false);
    request.send(null);

    if (request.status >= 200 && request.status < 300 && request.responseText) {
      const parsedConfig = JSON.parse(request.responseText) as RuntimeConfig;
      window.__HOST_APP_CONFIG__ = parsedConfig;
      return parsedConfig;
    }
  } catch (error) {
    console.warn("Failed to load runtime environment config", error);
  }

  return undefined;
};

const getRuntimeConfigValue = (
  key: keyof RuntimeConfig,
): string | undefined => {
  const runtimeConfig = loadRuntimeConfigFromFile();
  return runtimeConfig?.[key];
};

const runtimeHostOktaClientID = () =>
  getRuntimeConfigValue("HOST_OKTA_CLIENT_ID") ??
  import.meta.env.VITE_HOST_OKTA_CLIENT_ID ??
  DEFAULT_OKTA_CLIENT_ID;

const runtimeHostIssuerURI = () =>
  getRuntimeConfigValue("HOST_OKTA_ISSUER_URI") ??
  import.meta.env.VITE_HOST_OKTA_ISSUER_URI ??
  DEFAULT_OKTA_ISSUER_URI;

const runtimeHostOktaClientOrigin = () =>
  getRuntimeConfigValue("HOST_OKTA_CLIENT_ORIGIN") ??
  import.meta.env.VITE_HOST_OKTA_CLIENT_ORIGIN ??
  DEFAULT_OKTA_CLIENT_ORIGIN;

export const HOST_OKTA_CLIENT_ID = runtimeHostOktaClientID();
export const HOST_OKTA_ISSUER_URI = runtimeHostIssuerURI();
export const HOST_OKTA_CLIENT_ORIGIN = runtimeHostOktaClientOrigin();

//Added loggers for now to see variables are loading correctly with values from .env
console.log("Loaded HOST_OKTA_CLIENT_ID:", HOST_OKTA_CLIENT_ID);
console.log("Loaded HOST_OKTA_ISSUER_URI:", HOST_OKTA_ISSUER_URI);
console.log("Loaded HOST_OKTA_CLIENT_ORIGIN:", HOST_OKTA_CLIENT_ORIGIN);