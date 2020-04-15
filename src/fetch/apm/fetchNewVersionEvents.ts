import { ethers } from "ethers";
import { apmRepoAbi } from "./abis";

interface ApmNewVersionEvent {
  version: string; // "0.1.4"
  versionId: number; // 17
  // Block data
  txHash?: string; // '0x43f390d7a2ac19e89e902c2bef3dc84c563e3fd17a354eed664bd6527aeac97d',
  blockNumber?: number; // 9573077,
}

/**
 * Fetches the new repos logs from a registry
 *
 * [NOTE]: Will throw with "ENS name not configured" if the ENS can't
 * resolve the domain
 */
export async function fetchNewVersionEvents(
  provider: ethers.providers.Provider,
  repoName: string,
  fromBlock?: number
): Promise<ApmNewVersionEvent[]> {
  // Change this method if the web3 library is not ethjs
  // await ensureAncientBlocks();

  const repo = new ethers.utils.Interface(apmRepoAbi);

  const result = await provider.getLogs({
    address: repoName, // or contractEnsName,
    fromBlock: fromBlock || 0,
    toBlock: "latest",
    topics: [repo.events.NewVersion.topic],
  });

  return result.map(
    (event): ApmNewVersionEvent => {
      // Parse values
      const parsedLog = repo.parseLog(event);
      if (!parsedLog || !parsedLog.values)
        throw Error(`Error parsing NewRepo event`);
      // const versionId = parsedLog.values.versionId.toNumber();
      return {
        version: parsedLog.values.semanticVersion.join("."),
        versionId: parsedLog.values.versionId.toNumber(),
        // Parse tx data
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
      };
    }
  );
}
