/**
 * Joins multiple url parts safely
 * - Does not break the protocol double slash //
 * - Cleans double slashes at any point
 * @param args ("http://ipfs.io", "ipfs", "Qm")
 * @return "http://ipfs.io/ipfs/Qm"
 */
export function urlJoin(...args: string[]): string {
  return args.join("/").replace(/([^:]\/)\/+/g, "$1");
}

/**
 * Clean an IPFS hash of prefixes and suffixes commonly found
 * in both gateway URLs and content URLs
 * @param ipfsDirtyHash
 */
export function stipIpfsPrefix(ipfsDirtyHash: string): string {
  return (
    ipfsDirtyHash
      // Trim ending /ipfs/ tag
      // "site.io:8080//ipfs//" => "site.io:8080"
      .replace(/\/*ipfs\/*$/, "")
      // Trim starting /ipfs/, ipfs: tag
      // "/ipfs/Qm" => "Qm"
      .replace(/^\/*ipfs[/:]*/, "")
  );
}

/**
 * Returns a joined IPFS location given an IPFS gateway and an IPFS path
 * This util makes sure the url is properly joined, and that it contains
 * the "ipfs" route only once, stripping it from the gateway and the location
 * @param ipfsGateway "https://ipfs.io"
 * @param location "Qmzz"
 * @return "https://ipfs.io/ipfs/Qmzz/artifact.json"
 */
export function joinIpfsLocation(
  ipfsGateway: string,
  location: string
): string {
  return urlJoin(stipIpfsPrefix(ipfsGateway), "ipfs", stipIpfsPrefix(location));
}
