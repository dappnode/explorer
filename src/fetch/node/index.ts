import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import fetch from "node-fetch";
import {
  fetchRegistryList,
  RegistryList,
  DbProvider,
  RegistryArg,
  RepoArg,
} from "../fetchRegistryList";
import {
  registriesFile,
  summaryFile,
  rootDirFromNode,
  getRegistryFile,
  getRepoFile,
  getAvatarFile,
} from "../params";
import { RepoSummary, LocalRepo, LocalRegistry, Summary } from "../types";
import { joinIpfsLocation } from "../../utils/url";
import { isPng } from "./utils";
import { getLastVersion, computeActivity } from "../utils";
import { getTimestamp } from "../apm/apmUtils";

export async function preFetchFromNode(
  provider: ethers.providers.Provider,
  ipfsGateway: string,
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

  console.log(`Testing provider...`);
  const currentBlock = await provider.getBlockNumber();
  console.log(`Current block number: ${currentBlock}`);

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
          // Download avatars locally.
          // Otherwise the client will encounter a ton of errors trying to fetch the avatars
          const avatarBuffer = await fetchAvatar(repo, ipfsGateway).catch((e) =>
            console.warn(`Error saving avatar: ${e.stack}`)
          );
          const avatarFile = getAvatarFile(repo.registry, repo.name);
          if (avatarBuffer) localFile.writeBuffer(avatarFile, avatarBuffer);
          return {
            ...baseData,
            version: latestVersion.version,
            timestamp: latestVersion.timestamp,
            contentUri: latestVersion.contentUri,
            logo: avatarBuffer ? avatarFile : null,
          };
        } else {
          return baseData;
        }
      }
    )
  );

  // Activity

  console.log(`Computing activity...`);

  localFile.write<Summary>(summaryFile, {
    fromBlock: currentBlock,
    timestamp: await getTimestamp(provider, currentBlock),
    repos: repoSummary,
    activity: computeActivity(allRepos),
  });
}

/**
 * Download avatars locally.
 * Otherwise the client will encounter a ton of errors trying to fetch the avatars
 * @param repo
 */
async function fetchAvatar(
  repo: LocalRepo,
  ipfsGateway: string
): Promise<Buffer | null> {
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
  async function fetchAvatarManifest(
    contentUri: string
  ): Promise<Buffer | null> {
    const manifest = await fetchIpfs(contentUri).then((res) => res.json());
    if (!manifest || !manifest.avatar) return null;
    const res = await fetchIpfs(manifest.avatar);
    const buffer = await res.buffer();
    return res.ok && buffer && isPng(buffer) ? buffer : null;
  }

  const { contentUri } = getLastVersion(repo) || {};
  if (!contentUri) return null;

  // Fetch avatar from directory or manifest, ignore all errors
  return (
    (await fetchAvatarDirectory(contentUri).catch(() => null)) ||
    (await fetchAvatarManifest(contentUri).catch(() => null))
  );
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
