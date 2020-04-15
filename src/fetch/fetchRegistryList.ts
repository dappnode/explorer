import { ethers } from "ethers";
import {
  fetchNewVersions,
  fetchNewRepos,
  uniqueSortedRepos,
  uniqueSortedVersions,
} from "./apm";
import { getRegistryFile, getRepoFile } from "./params";
import { LocalRegistry, LocalRepo } from "./types";

export type RegistryList = string[];

export interface RegistryArg {
  registry: string;
  filepath: string;
}
export interface RepoArg {
  registry: string;
  repo: string;
  filepath: string;
}

export interface DbProvider {
  registry: {
    get: (arg: RegistryArg) => Promise<LocalRegistry | null>;
    set: (arg: RegistryArg, data: LocalRegistry) => Promise<void>;
  };
  repo: {
    get: (arg: RepoArg) => Promise<LocalRepo | null>;
    set: (arg: RepoArg, data: LocalRepo) => Promise<void>;
  };
}

export async function fetchRegistryList(
  provider: ethers.providers.Provider,
  db: DbProvider,
  registryList: string[]
) {
  await Promise.all(
    registryList.map(async (registryName) => {
      try {
        // Fetch new repos
        const registryArg = {
          registry: registryName,
          filepath: getRegistryFile(registryName),
        };
        const registryLocal = await db.registry.get(registryArg);
        const fromBlock = registryLocal ? registryLocal.fromBlock : undefined;
        const blockNumberNewRepos = await provider.getBlockNumber();
        const newRepos = await fetchNewRepos(provider, registryName, fromBlock);
        const repos = uniqueSortedRepos(
          registryLocal ? registryLocal.repos : [],
          newRepos
        );
        db.registry.set(registryArg, {
          registryName,
          fromBlock: blockNumberNewRepos,
          repos,
        });

        // Fetch new versions
        await Promise.all(
          repos.map(async (repo) => {
            try {
              const repoArg = {
                registry: registryName,
                repo: repo.name,
                filepath: getRepoFile(registryName, repo.name),
              };
              const repoLocal = await db.repo.get(repoArg);
              const fromBlock = repoLocal ? repoLocal.fromBlock : undefined;
              const blockNumberNewVersions = await provider.getBlockNumber();
              const newVersions = await fetchNewVersions(
                provider,
                repo.repo, // Use the address since the ENS name may not be configured
                fromBlock
              );
              const versions = uniqueSortedVersions(
                repoLocal ? repoLocal.versions : [],
                newVersions
              );
              db.repo.set(repoArg, {
                name: repo.name,
                registry: registryName,
                fromBlock: blockNumberNewVersions,
                versions,
              });
            } catch (e) {
              console.error(
                `Error fetching new versions ${(repo || {}).name}: ${e.stack}`
              );
            }
          })
        );
      } catch (e) {
        console.error(`Error fetching new repos ${registryName}: ${e.stack}`);
      }
    })
  );
}
