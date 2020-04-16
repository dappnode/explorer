import { ethers } from "ethers";
import { omit } from "lodash";
import retry from "async-retry";
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
        const newRepos = await retry(
          () => fetchNewRepos(provider, registryName, fromBlock),
          {
            retries: 5,
            onRetry: (e) =>
              console.warn(`Retrying fetchNewRepos: ${e.message}`),
          }
        );
        const repos = uniqueSortedRepos(
          registryLocal ? registryLocal.repos : [],
          newRepos
        );
        db.registry.set(registryArg, {
          registryName,
          fromBlock: blockNumberNewRepos,
          repos,
        });
        // Log results
        const newReposList = newRepos.map((r) => r.name).join(", ");
        console.log(`Fetched new repos from ${registryName}: ${newReposList}`);

        // Fetch new versions
        await Promise.all(
          repos.map(async (repo) => {
            const repoId = `${registryName} / ${(repo || {}).name}`; // For consistent debugging
            try {
              const repoArg = {
                registry: registryName,
                repo: repo.name,
                filepath: getRepoFile(registryName, repo.name),
              };
              const repoLocal = await db.repo.get(repoArg);
              const fromBlock = repoLocal ? repoLocal.fromBlock : undefined;
              const blockNumberNewVersions = await provider.getBlockNumber();
              const newVersions = await retry(
                () =>
                  fetchNewVersions(
                    provider,
                    repo.repo, // Use the address since the ENS name may not be configured
                    fromBlock
                  ),
                {
                  retries: 5,
                  onRetry: (e) =>
                    console.warn(`Retrying fetchNewVersions: ${e.message}`),
                }
              );
              const versions = uniqueSortedVersions(
                repoLocal ? repoLocal.versions : [],
                newVersions
              );
              db.repo.set(repoArg, {
                name: repo.name,
                registry: registryName,
                fromBlock: blockNumberNewVersions,
                creation: omit(repo, "name"),
                versions,
              });
              // Log results
              const newVList = newVersions.map((v) => v.version).join(", ");
              console.log(`Fetched new versions from ${repoId}: ${newVList}`);
            } catch (e) {
              console.error(`Error fetching versions ${repoId}: ${e.stack}`);
            }
          })
        );
      } catch (e) {
        console.error(`Error fetching repos ${registryName}: ${e.stack}`);
      }
    })
  );
}
