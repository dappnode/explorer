import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { sortBy, flatten } from "lodash";
import {
  fetchRegistryList,
  RegistryList,
  DbProvider,
  RegistryArg,
  RepoArg,
} from "../fetchRegistryList";
import {
  registriesFile,
  repoSummaryFile,
  rootDirFromNode,
  getRegistryFile,
  getRepoFile,
  activityFile,
} from "../params";
import { RepoSummary, LocalRepo, LocalRegistry, Activity } from "../types";
import { aggregateLast12Months } from "../../utils/math";

preFetchFromNode(new ethers.providers.InfuraProvider(), [
  "dnp.dappnode.eth",
  "public.dappnode.eth",
]);

export async function preFetchFromNode(
  provider: ethers.providers.Provider,
  registryList: string[]
) {
  const localFile = LocalFile(rootDirFromNode);
  const db: DbProvider = {
    registry: {
      get: ({ filepath }: RegistryArg) => localFile.read(filepath),
      set: ({ filepath }: RegistryArg, data) => localFile.write(filepath, data),
    },
    repo: {
      get: ({ filepath }: RepoArg) => localFile.read(filepath),
      set: ({ filepath }: RepoArg, data) => localFile.write(filepath, data),
    },
  };

  // Store the registry list to start querying
  localFile.write<RegistryList>(registriesFile, registryList);

  await fetchRegistryList(provider, db, registryList);

  /**
   * Generate a repo summary for the front page
   * - Accumulate count of repos and versions
   * - Get data from their last version
   * - fetch their latest avatar
   */

  const allRepos: LocalRepo[] = [];
  for (const registryName of registryList) {
    const registryFile = getRegistryFile(registryName);
    const registryLocal = await localFile.read<LocalRegistry>(registryFile);
    const repos = registryLocal ? registryLocal.repos : [];
    for (const repo of repos) {
      const repoFile = getRepoFile(registryName, repo.name);
      const repoLocal = await localFile.read<LocalRepo>(repoFile);
      if (repoLocal) allRepos.push(repoLocal);
    }
  }

  const repoSummary: RepoSummary[] = await Promise.all(
    allRepos.map(
      async (repo): Promise<RepoSummary> => {
        const latestVersion = sortBy(
          repo.versions,
          (version) => version.versionId
        ).reverse()[0];
        const baseData = {
          name: repo.name,
          registry: repo.registry,
          versionCount: repo.versions.length,
        };
        if (latestVersion) {
          return {
            ...baseData,
            latest: {
              version: latestVersion.version,
              timestamp: latestVersion.timestamp,
              contentUri: latestVersion.contentUri,
            },
          };
        } else {
          return baseData;
        }
      }
    )
  );

  localFile.write<RepoSummary[]>(repoSummaryFile, repoSummary);

  // Activity

  const activityLast12Months = {
    versions: aggregateLast12Months(
      flatten(allRepos.map((repo) => repo.versions))
    ),
    packages: aggregateLast12Months(allRepos.map((repo) => repo.creation)),
  };

  localFile.write<Activity>(activityFile, activityLast12Months);
}

function LocalFile(rootDir: string) {
  function ensureFilepath(filepath: string): void {
    const dirPath = path.parse(filepath).dir;
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  }

  async function read<T>(filepath: string): Promise<T | null> {
    try {
      const data = fs.readFileSync(path.join(rootDir, filepath), "utf8");
      return JSON.parse(data);
    } catch (e) {
      if (e.code === "ENOENT") return null;
      else throw e;
    }
  }

  async function write<T>(filepath: string, data: T): Promise<void> {
    const fullpath = path.join(rootDir, filepath);
    ensureFilepath(fullpath);
    fs.writeFileSync(fullpath, JSON.stringify(data, null, 2));
  }

  return { read, write };
}
