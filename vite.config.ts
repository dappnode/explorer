/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const src = fileURLToPath(new URL("./src", import.meta.url));
// Keep the existing REACT_APP_ names so .env files and CI variables still work.
const envPrefix = "REACT_APP_";
const dashboardPath = "/v1/explorer/dashboard";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), envPrefix);
  const endpoint = (env.REACT_APP_DASHBOARD_API_URL || "").trim();
  // The development server forwards the dashboard path to the configured public endpoint.
  const target = /^https?:\/\//i.test(endpoint) ? new URL(endpoint) : undefined;

  return {
    base: "./",
    envPrefix,
    plugins: [react()],
    resolve: {
      // Mirrors tsconfig "paths": bare imports such as "components/Header" resolve from src.
      alias: [
        {
          find: /^(components|dashboard|generated|hooks|pages|utils|settingsContext|types)(\/.*)?$/,
          replacement: `${src}/$1$2`,
        },
      ],
    },
    server: {
      port: 3000,
      proxy: target && {
        [dashboardPath]: {
          target: target.origin,
          changeOrigin: true,
          rewrite: () => target.pathname + target.search,
          proxyTimeout: 20000,
          timeout: 20000,
        },
      },
    },
    build: {
      outDir: "build",
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts",
    },
  };
});
