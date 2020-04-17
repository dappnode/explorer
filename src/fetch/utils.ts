import { flatten, sortBy } from "lodash";
import { LocalRepo, Activity, RepoSummary } from "./types";
import { NewVersion } from "./apm";
import { aggregateLast12Months } from "../utils/math";

export function getLastVersion(repo: LocalRepo): NewVersion {
  const latestVersion = sortBy(repo.versions, (v) => v.versionId).reverse()[0];
  if (latestVersion) return latestVersion;

  // Return creation as latest version
  return {
    version: "Created",
    versionId: -1,
    contentUri: "",
    ...repo.creation,
  };
}

export function computeRepoSummary(allRepos: LocalRepo[]): RepoSummary[] {
  return allRepos.map(
    (repo): RepoSummary => {
      const latestVersion = getLastVersion(repo);
      const baseData = {
        name: repo.name,
        registry: repo.registry,
        versionCount: repo.versions.length,
      };
      if (latestVersion) {
        return {
          ...baseData,
          version: latestVersion.version,
          timestamp: latestVersion.timestamp,
          contentUri: latestVersion.contentUri,
          logo: null,
        };
      } else {
        return baseData;
      }
    }
  );
}

export function computeActivity(allRepos: LocalRepo[]): Activity {
  return {
    versions: aggregateLast12Months(
      flatten(allRepos.map((repo) => repo.versions))
    ),
    packages: aggregateLast12Months(allRepos.map((repo) => repo.creation)),
  };
}
