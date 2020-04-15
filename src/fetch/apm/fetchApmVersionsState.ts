import { ethers } from "ethers";
import { ApmRepoVersion } from "./types";
import { parseApmVersionReturn, linspace } from "./apmUtils";
import { apmRepoAbi } from "./abis";

/**
 * Fetch all versions of an APM repo
 * If provided version request range, only returns satisfying versions
 * @param name "bitcoin.dnp.dappnode.eth"
 */
export async function fetchApmVersionsState(
  provider: ethers.providers.Provider,
  name: string,
  lastVersionId = 0
): Promise<ApmRepoVersion[]> {
  const repo = new ethers.Contract(name, apmRepoAbi, provider);

  const versionCount: number = await repo.getVersionsCount().then(parseFloat);

  // Guard against bugs that can cause // negative values
  if (isNaN(lastVersionId) || lastVersionId < 0) lastVersionId = 0;
  const versionIndexes = linspace(lastVersionId + 1, versionCount);
  return await Promise.all(
    versionIndexes.map(
      async (i): Promise<ApmRepoVersion> => {
        const versionData = await repo
          .getByVersionId(i)
          .then(parseApmVersionReturn);
        return {
          ...versionData,
          versionId: i,
        };
      }
    )
  );
}
