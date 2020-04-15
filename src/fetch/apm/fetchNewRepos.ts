import { ethers } from "ethers";
import { omit } from "lodash";
import { getTimestamp, getTxSender } from "./apmUtils";
import fetchNewRepoEvents from "./fetchNewRepoEvents";
import { NewRepo } from "./types";

export async function fetchNewRepos(
  provider: ethers.providers.Provider,
  registryName: string,
  fromBlock?: number
): Promise<NewRepo[]> {
  const newRepos = await fetchNewRepoEvents(provider, registryName, fromBlock);

  return await Promise.all(
    newRepos.map(
      async (newRepo): Promise<NewRepo> => {
        const timestamp = await getTimestamp(provider, newRepo.blockNumber);
        const sender = await getTxSender(provider, newRepo.txHash);
        return {
          // id is just the namehash of the full name so it's not relevant
          ...omit(newRepo, ["id"]),
          // Append registry name
          timestamp,
          sender,
        };
      }
    )
  );
}
