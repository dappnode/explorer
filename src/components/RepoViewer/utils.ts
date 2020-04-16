import { NewVersion } from "../../fetch/apm";
import { joinIpfsLocation } from "../../utils/url";

/**
 * Returns a shortened address
 * @param address "0x12345678901234567890123456789"
 * @returns "0x1234...6789"
 */
export function prettyAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Check if a version hash is available by calling an IFPS gateway
 * @param version
 * @param ipfsGateway
 */
export async function isVersionAvailable(
  version: NewVersion,
  ipfsGateway: string
): Promise<boolean> {
  const res = await fetch(joinIpfsLocation(ipfsGateway, version.contentUri));
  const resBody = await res.text();
  return Boolean(res.ok && resBody);
}
