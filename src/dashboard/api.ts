import { DashboardSnapshot, SourceState } from "./types";

const configuredUrl = import.meta.env.REACT_APP_DASHBOARD_API_URL?.trim() || "";
// The development server forwards this path to the configured public endpoint.
export const DASHBOARD_API_URL = import.meta.env.DEV && /^https?:\/\//i.test(configuredUrl)
  ? "/v1/explorer/dashboard"
  : configuredUrl || "/v1/explorer/dashboard";

type Check = (value: any) => boolean;
const object: Check = (v) => !!v && typeof v === "object" && !Array.isArray(v);
const string: Check = (v) => typeof v === "string";
const boolean: Check = (v) => typeof v === "boolean";
const number: Check = (v) => typeof v === "number" && Number.isFinite(v);
const nullable = (check: Check): Check => (v) => v === null || check(v);
const array = (check: Check): Check => (v) => Array.isArray(v) && v.every(check);
const oneOf = (...values: any[]): Check => (v) => values.includes(v);
const date: Check = (v) => string(v) && Number.isFinite(Date.parse(v));
const url: Check = (v) => string(v) && /^https?:\/\//i.test(v);
const fields = (shape: { [key: string]: Check }): Check => (v) =>
  object(v) && Object.keys(shape).every((key) => shape[key](v[key]));
const problem = fields({ code: string, message: string });
const source = fields({ observedAt: nullable(date), problem: nullable(problem) });

const onchain = fields({
  address: string, version: string, rawVersion: string, contentUri: string, publishedAt: date,
});
const release = fields({ version: string, tag: string, url, publishedAt: date, prerelease: boolean });
const pr = fields({
  id: string, number: (v) => number(v) && Number.isInteger(v) && v > 0,
  title: string, url, author: string, headRef: string, draft: boolean,
  createdAt: date, updatedAt: date, kind: oneOf("bump", "other", "unknown"),
  classificationBasis: oneOf("label", "branch", "metadata", "unclassified"),
  packageIds: nullable((v) => array(string)(v) && v.length > 0),
});
const pkg = fields({
  id: string, displayName: string, variant: nullable(string),
  classification: fields({ type: nullable(string), categories: array(string), tags: array(string) }),
  latestRelease: nullable(release), onchain: nullable(onchain),
  releaseStatus: oneOf("current", "release_available", "unpublished", "onchain_ahead", "no_release", "unknown"),
  lastActivityAt: nullable(date),
});
const repository = fields({
  id: string, url, archived: boolean, defaultBranch: string, observedAt: nullable(date),
  problem: nullable(problem), packages: array(pkg), pullRequests: array(pr),
});

/** Validate the boundary once so malformed snapshots cannot look like empty data. */
export function parseSnapshot(value: unknown): DashboardSnapshot {
  if (!fields({
    schemaVersion: oneOf(2), generatedAt: date,
    refreshIntervalSeconds: (v) => number(v) && v > 0,
    staleAfterSeconds: (v) => number(v) && v > 0,
    github: source, onchain: source,
    repositories: array(repository),
    issues: array(fields({
      source: oneOf("github", "onchain"), repositoryId: nullable(string),
      packageId: nullable(string), code: string, message: string,
    })),
  })(value)) throw new Error("The dashboard service returned an unsupported response.");

  const snapshot = value as DashboardSnapshot;
  const repoIds = new Set(snapshot.repositories.map((repo) => repo.id));
  if (repoIds.size !== snapshot.repositories.length || snapshot.repositories.some((repo) => {
    const ids = new Set(repo.packages.map((item) => item.id));
    return ids.size !== repo.packages.length || repo.pullRequests.some((item) =>
      item.packageIds !== null && item.packageIds.some((id) => !ids.has(id)));
  })) {
    throw new Error("The dashboard service returned inconsistent package references.");
  }
  return snapshot;
}

export type Freshness = "ok" | "stale" | "unavailable";

/** A source is stale after a failure, past the freshness limit, or when this page's refresh failed. */
export function freshness(
  state: SourceState, staleAfterSeconds: number, now: number, refreshFailed = false,
): Freshness {
  if (!state.observedAt) return "unavailable";
  return state.problem || refreshFailed || now - Date.parse(state.observedAt) > staleAfterSeconds * 1000 ?
    "stale" : "ok";
}
