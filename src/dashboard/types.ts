/** Wire contract for GET /v1/explorer/dashboard, schema 2. See dashboard-contract.md. */
export interface DashboardSnapshot {
  schemaVersion: 2;
  generatedAt: string;
  refreshIntervalSeconds: number;
  staleAfterSeconds: number;
  /** Public repository listing of the configured organizations. */
  github: SourceState;
  /** On-chain catalog scan of the configured subgraph. */
  onchain: SourceState;
  /** Package repositories only, sorted by id. */
  repositories: DashboardRepository[];
  issues: Issue[];
}

export interface SourceState {
  /** Last complete successful read; null if never. */
  observedAt: string | null;
  /** Latest failure; data from the last success is retained. */
  problem: Problem | null;
}

export interface Problem {
  code: string;
  message: string;
}

export interface Issue {
  source: "github" | "onchain";
  repositoryId: string | null;
  packageId: string | null;
  code: string;
  message: string;
}

export interface DashboardRepository {
  /** Lowercase owner/repository slug. */
  id: string;
  url: string;
  archived: boolean;
  defaultBranch: string;
  /** Last run in which every read for this repository succeeded; null if never. */
  observedAt: string | null;
  /** Latest failure; packages and PRs below are retained from earlier reads. */
  problem: Problem | null;
  /** Packages declared by this repository's manifests, sorted by id. */
  packages: DashboardPackage[];
  /** Every open PR, including drafts, sorted by number. */
  pullRequests: DashboardPullRequest[];
}

export interface DashboardPackage {
  /** Full lowercase ENS name from the manifest, e.g. besu.public.dappnode.eth. */
  id: string;
  displayName: string;
  /** Generic variant directory name, e.g. mainnet, hoodi; null for a plain package. */
  variant: string | null;
  classification: {
    /** Manifest `type`, e.g. service, dncore, library; null if absent. Overridable. */
    type: string | null;
    /** Manifest `categories` verbatim, e.g. ["Blockchain", "ETH2.0"]; [] if none. Overridable. */
    categories: string[];
    /** Curated lowercase tags from configuration, sorted and unique; [] if none. */
    tags: string[];
  };
  /** Greatest attributable GitHub release; null if none. */
  latestRelease: PackageRelease | null;
  /** Current on-chain version for this ENS name; null if unpublished or unresolved. */
  onchain: OnchainVersion | null;
  releaseStatus:
    | "current"
    | "release_available"
    | "unpublished"
    | "onchain_ahead"
    | "no_release"
    | "unknown";
  lastActivityAt: string | null;
}

export interface PackageRelease {
  /** Normalized semantic version, without a leading v. */
  version: string;
  tag: string;
  url: string;
  publishedAt: string;
  prerelease: boolean;
}

export interface OnchainVersion {
  /** On-chain repository contract address. */
  address: string;
  version: string;
  rawVersion: string;
  contentUri: string;
  publishedAt: string;
}

export interface DashboardPullRequest {
  /** Stable global ID: owner/repository#number. */
  id: string;
  number: number;
  title: string;
  url: string;
  author: string;
  headRef: string;
  draft: boolean;
  createdAt: string;
  updatedAt: string;
  kind: "bump" | "other" | "unknown";
  classificationBasis: "label" | "branch" | "metadata" | "unclassified";
  /** null = repository-level scope; never []. */
  packageIds: string[] | null;
}
