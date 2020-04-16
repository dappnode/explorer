/**
 * Common params between node and browser
 */

export const rootDirFromNode = `public`;
export const rootUrlFromBrowser = `./`;

// Partial common paths
export const dataDir = "data";
export const registriesFile = `${dataDir}/registries.json`;
export const repoSummaryFile = `${dataDir}/summary.json`;
export const getRegistryFile = (registry: string) =>
  `${dataDir}/${registry}.json`;
export const getRepoFile = (registry: string, repo: string) =>
  `${dataDir}/${registry}/${repo}.json`;