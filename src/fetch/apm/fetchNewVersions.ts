import { ethers } from "ethers";
import { getTimestamp, getTxSender } from "./apmUtils";
import { fetchNewVersionEvents } from "./fetchNewVersionEvents";
import { fetchVersion } from "./fetchVersion";
import { NewVersion } from "./types";

export async function fetchNewVersions(
  provider: ethers.providers.Provider,
  repoName: string,
  fromBlock?: number
): Promise<NewVersion[]> {
  const newVersions = await fetchNewVersionEvents(
    provider,
    repoName,
    fromBlock
  );

  return await Promise.all(
    newVersions.map(
      async (newVersion): Promise<NewVersion> => {
        const versionData = await fetchVersion(
          provider,
          repoName,
          newVersion.versionId
        );
        // Do not store contractAddress if it's 0x0
        if (parseInt(versionData.contractAddress) === 0)
          delete versionData.contractAddress;

        const timestamp = await getTimestamp(provider, newVersion.blockNumber);
        const sender = await getTxSender(provider, newVersion.txHash);

        return {
          ...newVersion,
          ...versionData,
          timestamp,
          sender,
        };
      }
    )
  );
}
