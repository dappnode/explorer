import { NewRepo, NewVersion } from "./apm";

export interface RepoSummary {
  name: string; // "admin"
  registry: string; // "dnp.dappnode.eth"
  versionCount: number;
  // Last version
  latest?: {
    version: string;
    timestamp?: number;
    contentUri: string;
    logo: string | null; // To get the logo: "avatar/dnp.dappnode.eth/bitcoin"
  };
}

interface ActivityByMonth {
  month: number;
  count: number;
}

export interface Activity {
  versions: ActivityByMonth[];
  packages: ActivityByMonth[];
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
  creation: Omit<NewRepo, "name">;
  versions: NewVersion[];
}
