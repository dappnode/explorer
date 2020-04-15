export interface ApmRepoVersion {
  version: string; // string, "0.2.2"
  contractAddress: string; // address
  contentUri: string; // string
}

export interface ApmRepoVersionReturn {
  semanticVersion: number[]; // uint16[3], [0,2,2]
  contractAddress: string; // address
  contentURI: string; // bytes
}

export interface NewVersion {
  version: string; // "0.1.4"
  versionId: number; // 17
  contentUri: string; // "/ipfs/Qm"
  contractAddress?: string; // address or undefined if not set
  txHash?: string; // '0x43f390d7a2ac19e89e902c2bef3dc84c563e3fd17a354eed664bd6527aeac97d',
  blockNumber?: number; // 9573077,
  timestamp?: number; // 1582905556,
  sender?: string; // '0xcd6B0014e04DEF6A190593c54fAf51D785C93626'
}

export interface NewRepo {
  name: string; // "admin"
  repo: string;
  // Block data
  txHash?: string; // '0x43f390d7a2ac19e89e902c2bef3dc84c563e3fd17a354eed664bd6527aeac97d',
  blockNumber?: number; // 9573077,
  timestamp?: number; // 1582905556,
  sender?: string; // '0xcd6B0014e04DEF6A190593c54fAf51D785C93626'
}
