import { LocalRegistry, LocalRepo } from "./fetch/types";

export interface AppState {
  fromBlock: number;
  timestamp?: number;
  registries: {
    [registry: string]: LocalRegistry;
  };
  repos: {
    [registryRepo: string]: LocalRepo;
  };
}

export interface FetchStatus {
  loading?: true;
  success?: true;
  error?: string;
}
