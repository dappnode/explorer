import { ethers } from "ethers";
import semver from "semver";
import { sortBy, uniqBy, flatten } from "lodash";
import { ApmRepoVersionReturn, ApmRepoVersion, NewVersion } from "./types";
import { NewRepo } from ".";

/**
 * Parse a raw version response from an APM repo
 */
export function parseApmVersionReturn(
  res: ApmRepoVersionReturn
): ApmRepoVersion {
  if (!Array.isArray(res.semanticVersion))
    throw Error(`property 'semanticVersion' must be an array`);
  return {
    version: res.semanticVersion.join("."),
    contractAddress: res.contractAddress,
    // Second argument = true: ignore UTF8 parsing errors
    // Let downstream code identify the content hash as wrong
    contentUri: ethers.utils.toUtf8String(res.contentURI, true),
  };
}

/**
 * Return a semantic version string into the APM version array format
 * @param version "0.2.4"
 */
export function toApmVersionArray(version: string): [number, number, number] {
  const semverObj = semver.parse(version);
  if (!semverObj) throw Error(`Invalid semver ${version}`);
  return [semverObj.major, semverObj.minor, semverObj.patch];
}

/**
 * Return evenly spaced numbers over a specified interval.
 * @param from 1
 * @param to 5
 * @param step 2
 * @return [1, 3, 5]
 */
export function linspace(from: number, to: number, step = 1): number[] {
  // Guard against bugs that can cause // -Infinity
  if (!isFinite(from)) throw Error(`linspace 'from' is not finite: ${from}`);
  if (!isFinite(to)) throw Error(`linspace 'to' is not finite: ${to}`);
  const arr: number[] = [];
  for (let i = from; i <= to; i += step) arr.push(i);
  return arr;
}

export function uniqueSortedRepos(...reposArr: NewRepo[][]): NewRepo[] {
  const repos = flatten(reposArr);
  return sortBy(
    uniqBy(repos, (repo) => repo.repo),
    (repo) => repo.blockNumber || 0
  );
}

export function uniqueSortedVersions(
  ...reposArr: NewVersion[][]
): NewVersion[] {
  const repos = flatten(reposArr);
  return sortBy(
    uniqBy(repos, (repo) => repo.versionId),
    (repo) => repo.versionId
  );
}

/**
 * Fetch a block's timestamp
 */
export async function getTimestamp(
  provider: ethers.providers.Provider,
  blockNumber: number | undefined
): Promise<number | undefined> {
  if (!blockNumber) return;
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}

/**
 * Get tx sender
 */
export async function getTxSender(
  provider: ethers.providers.Provider,
  txHash: string | undefined
): Promise<string | undefined> {
  if (!txHash) return;
  const receipt = await provider.getTransactionReceipt(txHash);
  return receipt.from;
}
