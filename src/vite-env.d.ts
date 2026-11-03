/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_SUBGRAPH_URI?: string;
  readonly REACT_APP_GATEWAY_TOKEN?: string;
  readonly REACT_APP_DASHBOARD_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
