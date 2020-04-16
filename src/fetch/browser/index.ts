import { ethers } from "ethers";
import { fetchRegistryList, RegistryList } from "../fetchRegistryList";
import { rootUrlFromBrowser, registriesFile } from "../params";
import { urlJoin } from "../../utils/url";

// fetch(new ethers.providers.InfuraProvider(), rootDir, [
//   "dnp.dappnode.eth",
//   "public.dappnode.eth",
// ]);

export async function fetchFromBrowser(provider: ethers.providers.Provider) {
  async function readRemoteFile<T>({
    filepath,
  }: {
    filepath: string;
  }): Promise<T | null> {
    const res = await fetch(urlJoin(rootUrlFromBrowser, filepath));
    if (res.ok) return await res.json();
    else return null;
  }

  async function onFileUpdate(arg: any, data: any) {
    console.log(arg, data);
  }

  const db = {
    registry: {
      get: readRemoteFile,
      set: onFileUpdate,
    },
    repo: {
      get: readRemoteFile,
      set: onFileUpdate,
    },
  };

  const registryList = await readRemoteFile<RegistryList>({
    filepath: registriesFile,
  });
  if (!registryList) return;

  await fetchRegistryList(provider, db, registryList);
}
