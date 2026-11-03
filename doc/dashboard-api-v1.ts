/** Wire contract for GET /v1/explorer/dashboard. See dashboard-contract.md. */
export interface DashboardSnapshot {
  schemaVersion: 1;
  generatedAt: string;
  refreshIntervalSeconds: number;
  staleAfterSeconds: number;
  catalog: {
    status: "complete" | "partial";
    githubObservedAt: string | null;
    onchainObservedAt: string | null;
    issues: CatalogIssue[];
  };
  repositories: DashboardRepository[];
  packages: DashboardPackage[];
}

export interface Observation<T> {
  status: "ok" | "stale" | "error" | "unavailable";
  observedAt: string | null;
  value: T | null;
  problem: { code: string; message: string } | null;
}

export interface CatalogIssue {
  source: "github" | "graphql" | "catalog";
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
  openPullRequests: Observation<DashboardPullRequest[]>;
}

export interface DashboardPackage {
  /** Full lowercase ENS name, including registry, e.g. besu.public.dappnode.eth. */
  id: string;
  displayName: string;
  /** Current and confirmed former repositories, deduplicated. */
  repositoryIds: string[];
  primaryRepositoryId: string | null;
  /** Network variant key; null for a non-generic or unresolved package. */
  variant: string | null;
  classification: {
    /** Manifest "type", e.g. service, dncore, library; null when no manifest is known. */
    type: string | null;
    /** Manifest categories as written, e.g. ["Blockchain", "ETH2.0"]; [] = none declared, null = no manifest known. */
    categories: string[] | null;
    /** Curated tags from config: lowercase, sorted and unique; [] = none. */
    tags: string[];
  };
  onchain: Observation<OnchainPackageVersion>;
  latestRelease: Observation<PackageRelease>;
  releaseStatus:
    | "current"
    | "release_available"
    | "unpublished"
    | "onchain_ahead"
    | "no_release"
    | "unknown";
  /** Latest relevant source event, never the collection time. */
  lastActivityAt: string | null;
}

export interface OnchainPackageVersion {
  /** Existing Explorer repo route identifier (on-chain repository address). */
  repoId: string;
  version: string;
  rawVersion: string;
  contentUri: string;
  publishedAt: string;
}

export interface PackageRelease {
  repositoryId: string;
  /** GitHub release ID serialized as a string. */
  releaseId: string;
  /** This package variant's version, not the entire composite tag. */
  version: string;
  rawVersion: string;
  tag: string;
  url: string;
  publishedAt: string;
  prerelease: boolean;
}

export interface DashboardPullRequest {
  /** owner/repository#number, using the lowercase repository slug. */
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
  /** null = repository-level scope; [] is invalid. */
  packageIds: string[] | null;
}
