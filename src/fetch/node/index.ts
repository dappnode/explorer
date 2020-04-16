import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import fetch from "node-fetch";
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
  getAvatarFile,
} from "../params";
import { RepoSummary, LocalRepo, LocalRegistry, Activity } from "../types";
import { aggregateLast12Months } from "../../utils/math";
import { NewVersion } from "../apm";
import { joinIpfsLocation } from "../../utils/url";
import { isPng } from "./utils";

const ipfsGateway = "https://ipfs.infura.io";

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

  console.log(`Fetching registry list...`);
  await fetchRegistryList(provider, db, registryList);

  /**
   * Generate a repo summary for the front page
   * - Accumulate count of repos and versions
   * - Get data from their last version
   * - fetch their latest avatar
   */

  console.log(`Generating repo summary...`);
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

  /**
   * Download avatars locally.
   * Otherwise the client will encounter a ton of errors trying to fetch the avatars
   * @param repo
   */
  async function fetchAndSaveAvatar(repo: LocalRepo): Promise<string | null> {
    const { contentUri } = getLastVersion(repo) || {};
    if (!contentUri) return null;

    // Fetch avatar from directory or manifest, ignore all errors
    const avatarBuffer =
      (await fetchAvatarDirectory(contentUri).catch(() => null)) ||
      (await fetchAvatarManifest(contentUri).catch(() => null));

    if (!avatarBuffer) return null;

    const avatarFile = getAvatarFile(repo.registry, repo.name);
    localFile.writeBuffer(avatarFile, avatarBuffer);
    return avatarFile;
  }

  const repoSummary: RepoSummary[] = await Promise.all(
    allRepos.map(
      async (repo): Promise<RepoSummary> => {
        const latestVersion = getLastVersion(repo);
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
              logo: await fetchAndSaveAvatar(repo).catch((e) => {
                console.warn(`Error saving ${repo.name} avatar: ${e.stack}`);
                return null;
              }),
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

  console.log(`Computing activity...`);
  const activityLast12Months = {
    versions: aggregateLast12Months(
      flatten(allRepos.map((repo) => repo.versions))
    ),
    packages: aggregateLast12Months(allRepos.map((repo) => repo.creation)),
  };

  localFile.write<Activity>(activityFile, activityLast12Months);
}

async function fetchIpfs(contentUri: string) {
  return await fetch(joinIpfsLocation(ipfsGateway, contentUri), {
    timeout: 5000,
  });
}

/**
 * Fetch avatar from release hash of type directory
 * @param contentUri
 */
async function fetchAvatarDirectory(
  contentUri: string
): Promise<Buffer | null> {
  const res = await fetchIpfs(`${contentUri}/avatar.png`);
  const buffer = await res.buffer();
  return res.ok && buffer && isPng(buffer) ? buffer : null;
}

/**
 * Fetch avatar from release hash of type manifest
 * @param contentUri
 */
async function fetchAvatarManifest(contentUri: string): Promise<Buffer | null> {
  const manifest = await fetchIpfs(contentUri).then((res) => res.json());
  if (!manifest || !manifest.avatar) return null;
  const res = await fetchIpfs(manifest.avatar);
  const buffer = await res.buffer();
  return res.ok && buffer && isPng(buffer) ? buffer : null;
}

function getLastVersion(repo: LocalRepo): NewVersion {
  const latestVersion = sortBy(
    repo.versions,
    (version) => version.versionId
  ).reverse()[0];
  if (latestVersion) return latestVersion;

  // Return creation as latest version
  return {
    version: "Created",
    versionId: -1,
    contentUri: "",
    ...repo.creation,
  };
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

  async function writeBuffer(filepath: string, data: Buffer): Promise<void> {
    const fullpath = path.join(rootDir, filepath);
    ensureFilepath(fullpath);
    fs.writeFileSync(fullpath, data);
  }

  return { read, write, writeBuffer };
}
