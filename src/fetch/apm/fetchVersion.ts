import { ethers } from "ethers";
import semver from "semver";
import { ApmRepoVersionReturn, ApmRepoVersion } from "./types";
import { parseApmVersionReturn, toApmVersionArray } from "./apmUtils";
import { apmRepoAbi } from "./abis";

/**
 * Fetch a specific version of an APM repo
 * @param repoName "bitcoin.dnp.dappnode.eth"
 * @param version "0.2.4", 17, "latest", undefined
 */
export async function fetchVersion(
  provider: ethers.providers.Provider,
  repoName: string,
  version?: string | number
): Promise<ApmRepoVersion> {
  const repo = new ethers.Contract(repoName, apmRepoAbi, provider);

  const res: ApmRepoVersionReturn =
    typeof version === "number"
      ? await repo.getByVersionId(version)
      : version && semver.valid(version)
      ? await repo.getBySemanticVersion(toApmVersionArray(version))
      : await repo.getLatest();
  return parseApmVersionReturn(res);
}
