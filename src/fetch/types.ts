import { NewRepo, NewVersion } from "./apm";

export interface RepoSummary {
  name: string; // "admin"
  registry: string; // "dnp.dappnode.eth"
  versionCount: number;
  // Last version
  latest?: {
    version: string;
    timestamp?: number;
    contentUri: string; // To get the logo
  };
}

export interface LocalRegistry {
  registryName: string;
  fromBlock: number;
  repos: NewRepo[];
}

export interface LocalRepo {
  name: string;
  registry: string;
  fromBlock: number;
  versions: NewVersion[];
}
