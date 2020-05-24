import ky from "ky";
import { ApmVersion } from "types";

interface ObjectStat {
  Hash: string; // "QmUPJwSa867iJW2MQxrUY8Y72jaFkj7wk2RVMiPtWEotsy"
  NumLinks: number; // 8
  BlockSize: number; // 511
  LinksSize: number; // 509
  DataSize: number; // 2
  CumulativeSize: number; // 22972396
}

/**
 * Check if a version hash is available by calling an IFPS gateway
 * @param version
 * @param ipfsApi
 */
export async function isVersionAvailable(
  version: ApmVersion,
  { ipfsApi }: { ipfsApi: string }
): Promise<boolean> {
  try {
    const url = `${ipfsApi}/api/v0/object/stat?arg=${version.contentUri}`;
    const stat: ObjectStat = await ky(url, { timeout: 5000 }).json();
    return Boolean(stat.CumulativeSize);
  } catch (e) {
    console.log(
      `Version ${version.semanticVersion} ${version.contentUri} not available: ${e.message}`
    );
    return false;
  }
}
