/** Deterministic API fixture used by dashboard tests; never used as live data. */
import { DashboardPackage, DashboardPullRequest, DashboardRepository, DashboardSnapshot } from "./types";

export const OBSERVED_AT = "2026-11-03T10:00:00Z";
export const NOW = Date.parse("2026-11-03T10:05:00Z");
export const MAINNET_ID = "geth.dnp.dappnode.eth";
export const HOODI_ID = "hoodi-geth.dnp.dappnode.eth";
export const REPO_ID = "dappnode/dappnodepackage-geth-generic";

export function repository(id: string, packages: DashboardPackage[], pullRequests: DashboardPullRequest[] = []): DashboardRepository {
  return {
    id, url: `https://github.com/${id}`, archived: false, defaultBranch: "main",
    observedAt: OBSERVED_AT, problem: null, packages, pullRequests,
  };
}

export function fixture(): DashboardSnapshot {
  const prs: DashboardPullRequest[] = [{
    id: `${REPO_ID}#104`, number: 104, title: "chore: bump go-ethereum", url: "https://github.com/dappnode/DAppNodePackage-geth-generic/pull/104",
    author: "tropibot[bot]", headRef: "tropibot/bump-go-ethereum-v1.17.10", draft: false,
    createdAt: "2026-11-01T12:00:00Z", updatedAt: "2026-11-02T12:00:00Z",
    kind: "bump", classificationBasis: "branch", packageIds: null,
  }, {
    id: `${REPO_ID}#105`, number: 105, title: "Adjust mainnet configuration", url: "https://github.com/dappnode/DAppNodePackage-geth-generic/pull/105",
    author: "maintainer", headRef: "configuration", draft: true,
    createdAt: "2026-11-01T12:00:00Z", updatedAt: "2026-11-02T13:00:00Z",
    kind: "unknown", classificationBasis: "unclassified", packageIds: [MAINNET_ID],
  }];
  const mainnet: DashboardPackage = {
    id: MAINNET_ID, displayName: "Geth", variant: "mainnet",
    classification: { type: "service", categories: ["Blockchain"], tags: ["execution", "staking"] },
    onchain: { address: "0x123", version: "0.1.51", rawVersion: "0.1.51", contentUri: "/ipfs/example", publishedAt: "2026-09-14T09:00:00Z" },
    latestRelease: { version: "0.1.52", tag: "mainnet@v0.1.52_hoodi@v0.1.7", url: "https://github.com/dappnode/DAppNodePackage-geth-generic/releases/1234", publishedAt: "2026-10-24T18:41:49Z", prerelease: true },
    releaseStatus: "release_available", lastActivityAt: "2026-11-02T13:00:00Z",
  };
  const hoodi: DashboardPackage = {
    ...mainnet, id: HOODI_ID, displayName: "Hoodi Geth", variant: "hoodi",
    onchain: { ...mainnet.onchain!, address: "0x456", version: "0.1.7", rawVersion: "0.1.7", publishedAt: "2026-10-25T14:00:00Z" },
    latestRelease: { ...mainnet.latestRelease!, version: "0.1.7" },
    releaseStatus: "current", lastActivityAt: "2026-11-02T12:00:00Z",
  };
  const app: DashboardPackage = {
    id: "application.public.dappnode.eth", displayName: "Application", variant: null,
    classification: { type: "service", categories: [], tags: [] },
    onchain: null, latestRelease: null, releaseStatus: "no_release", lastActivityAt: null,
  };
  // A repository whose releases and PRs were never read successfully.
  const legacy: DashboardPackage = {
    id: "legacy.dnp.dappnode.eth", displayName: "Legacy package", variant: null,
    classification: { type: null, categories: [], tags: [] },
    onchain: null, latestRelease: null, releaseStatus: "unknown", lastActivityAt: null,
  };
  const problem = { code: "release_scan_failed", message: "Releases could not be listed." };
  return {
    schemaVersion: 2, generatedAt: OBSERVED_AT, refreshIntervalSeconds: 300, staleAfterSeconds: 1800,
    github: { observedAt: OBSERVED_AT, problem: null }, onchain: { observedAt: OBSERVED_AT, problem: null },
    repositories: [
      repository("dappnode/dappnodepackage-app", [app]),
      repository(REPO_ID, [mainnet, hoodi], prs),
      { ...repository("dappnode/dappnodepackage-legacy", [legacy]), observedAt: null, problem },
    ],
    issues: [
      { source: "github", repositoryId: "dappnode/dappnodepackage-legacy", packageId: null, ...problem },
      // A repository whose manifest never parsed has no package rows.
      { source: "github", repositoryId: "dappnode/dappnodepackage-broken", packageId: null, code: "manifest_scan_failed", message: "Package manifests on main could not be read." },
    ],
  };
}
