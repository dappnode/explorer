/**
 * Common params between node and browser
 */

export const rootDirFromNode = `public`;
export const rootUrlFromBrowser = `./`;

// Partial common paths
export const dataDir = "data";
export const avatarDir = "avatar";
export const registriesFile = `${dataDir}/registries.json`;
export const repoSummaryFile = `${dataDir}/summary.json`;
export const activityFile = `${dataDir}/activity.json`;
export const getRegistryFile = (registry: string) =>
  `${dataDir}/${registry}.json`;
export const getRepoFile = (registry: string, repo: string) =>
  `${dataDir}/${registry}/${repo}.json`;
export const getAvatarFile = (registry: string, repo: string) =>
  `${avatarDir}/${registry}/${repo}.png`;
