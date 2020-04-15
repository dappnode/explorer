export const apmRepoAbi = [
  "event NewVersion(uint256 versionId, uint16[3] semanticVersion)",
  "function getByVersionId(uint _versionId) public view returns (uint16[3] semanticVersion, address contractAddress, bytes contentURI)",
  "function getVersionsCount() public view returns (uint256)",
];

export const apmRegistryAbi = [
  "event NewRepo(bytes32 id, string name, address repo)",
];
