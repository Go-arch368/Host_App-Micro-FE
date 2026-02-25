// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



// host vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { dependencies } from "./package.json";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "prolink_host",
      remotes: {
        prolink_lookup_remote: {
          type: "module",
          name: "prolink_lookup_remote",
          entry:  "http://localhost:8082/remoteLookup/remoteEntry.js",
        },
        practitioner: {
          type: "module",
          name: "practitioner",
          entry: "/remotePrac/remoteEntry.js",
        },
        welcomepacket: {
          type: "module",
          name: "welcomepacket",
          entry: "/remoteWelcome/remoteEntry.js",
        },
        corporateentity: {
          type: "module",
          name: "corporateentity",
          entry: "/remoteCorporateEntity/remoteEntry.js",
        },
        facility: {
          type: "module",
          name: "facility",
          entry: "/remoteFacility/remoteEntry.js",
        },
        group: {
          type: "module",
          name: "group",
          entry: "/remoteGroup/remoteEntry.js",
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: dependencies["react-router-dom"],
        },
        "@okta/okta-react": {
          singleton: true,
          requiredVersion: dependencies["@okta/okta-react"],
        },
        "@okta/okta-auth-js": {
          singleton: true,
          requiredVersion: dependencies["@okta/okta-auth-js"],
        },
      },
    }),
  ],
  // host vite.config.ts
  server: {
    port: 3030,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""), // <- forward /api/v1/* as /v1/*
        configure: (proxy) => {
          proxy.on("proxyReq", (_, req) => {
            console.log("[proxy] →", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("[proxy] ←", req.method, req.url, proxyRes.statusCode);
          });
          proxy.on("error", (err, req) => {
            console.error("[proxy] ✖", req.method, req.url, err?.message);
          });
        },
      },
    },
  },

  preview: { port: 3030 }, // note: Vite preview does NOT apply proxy
  resolve: {
    alias: { "@config/env": path.resolve(__dirname, "env.vite.ts") },
  },
  build: { target: "esnext" },
});