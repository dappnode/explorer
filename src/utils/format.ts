/**
 * Capitalizes a string
 * @param string = "hello world"
 * @returns "Hello world"
 */
function capitalize(s: string): string {
  if (!s || typeof s !== "string") return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Pretifies a package name
 * "bitcoin" => "Bitcoin"
 * "raiden-testnet" => "Raiden Testnet"
 *
 * @param name ENS name
 * @returns pretty name
 */
export function prettyName(name: string): string {
  return (
    name
      // Convert all "-" and "_" to spaces
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\./g, " ")
      .split(" ")
      .map(capitalize)
      .join(" ")
  );
}

/**
 * Pretifies a ENS name
 * "bitcoin.dnp.dappnode.eth" => "Bitcoin"
 * "raiden-testnet.dnp.dappnode.eth" => "Raiden Testnet"
 *
 * @param name ENS name
 * @returns pretty name
 */
export function parseRepoName(
  name: string
): { registry: string; prettyName: string } {
  const [shortName, registry] = name.split(/\.(.+)/);

  return {
    prettyName: prettyName(shortName),
    registry,
  };
}

/**
 * Returns a shortened address
 * @param address "0x12345678901234567890123456789"
 * @returns "0x1234...6789"
 */
export function prettyAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * TheGraph sends the version concatenated by comma ","
 * @param semanticVersion "0,1,18"
 * @returns "0.1.18"
 */
export function semanticVersionDots(semanticVersion: string): string {
  return semanticVersion.replace(/,/g, ".");
}
