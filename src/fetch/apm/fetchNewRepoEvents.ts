import { ethers } from "ethers";
import { apmRegistryAbi } from "./abis";

interface NewRepo {
  id: string;
  name: string;
  repo: string;
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
export default async function fetchNewRepoEvents(
  provider: ethers.providers.Provider,
  registryName: string,
  fromBlock?: number
): Promise<NewRepo[]> {
  const newRepoEvent = new ethers.utils.Interface(apmRegistryAbi);

  const result = await provider.getLogs({
    address: registryName, // or contractEnsName,
    fromBlock: fromBlock || 0,
    toBlock: "latest",
    topics: [newRepoEvent.events.NewRepo.topic],
  });

  return result.map(
    (event): NewRepo => {
      const parsedLog = newRepoEvent.parseLog(event);
      if (!parsedLog || !parsedLog.values)
        throw Error(`Error parsing NewRepo event`);
      const {
        id,
        name,
        repo,
      }: { id: string; name: string; repo: string } = parsedLog.values;
      return {
        blockNumber: event.blockNumber || 0,
        txHash: event.transactionHash,
        id,
        name,
        repo,
      };
    }
  );
}
