import { freshness, Freshness } from "./api";
import { DashboardPackage, DashboardPullRequest, DashboardRepository, DashboardSnapshot, SourceState } from "./types";

/** One package as declared by one repository; the same ENS name can appear in several. */
export interface PackageRow extends DashboardPackage {
  /** Unique across the snapshot: repository id and package id. */
  key: string;
  repository: DashboardRepository;
}

export const STATUS_LABELS: { [key in DashboardPackage["releaseStatus"]]: string } = {
  current: "Current", release_available: "Release available", unpublished: "Unpublished",
  onchain_ahead: "On-chain ahead", no_release: "No release", unknown: "Unknown",
};

export const PERIOD_LABELS = {
  all: "All time", "7d": "Last 7 days", "30d": "Last 30 days",
  "3m": "Last 3 months", "6m": "Last 6 months", "1y": "Last year", custom: "Custom dates",
};

export interface Filters {
  q: string;
  type: string;
  variant: string;
  category: string;
  tag: string;
  generic: "all" | "generic" | "nongeneric";
  status: string;
  prs: "all" | "bump" | "other" | "none" | "unknown";
  archived: "exclude" | "include" | "only";
  unpublishable: "exclude" | "include";
  dateField: "activity" | "onchain" | "release";
  period: keyof typeof PERIOD_LABELS;
  from: string;
  to: string;
  sort: "activity" | "name" | "onchain" | "release" | "status";
  direction: "asc" | "desc";
  view: "table" | "matrix";
}

/** Filter value selecting packages without a type, categories, or tags. */
export const UNCLASSIFIED = "unclassified";

export const DEFAULT_FILTERS: Filters = {
  q: "", type: "all", variant: "all", category: "all", tag: "all", generic: "all", status: "all", prs: "all",
  archived: "exclude", unpublishable: "exclude",
  dateField: "activity", period: "all", from: "", to: "", sort: "activity",
  direction: "desc", view: "table",
};

export function localDate(value: string, nextDay = false): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  if (nextDay) date.setDate(date.getDate() + 1);
  return date.getTime();
}

export function readFilters(search: string): Filters {
  const params = new URLSearchParams(search);
  const filters = { ...DEFAULT_FILTERS };
  ["q", "type", "variant", "category", "tag"].forEach((key) => {
    if (params.has(key)) (filters as any)[key] = params.get(key) || DEFAULT_FILTERS[key as keyof Filters];
  });
  // Shared links created before the rename used `network` for the variant filter.
  const legacyVariant = params.get("network");
  if (legacyVariant && !params.has("variant")) filters.variant = legacyVariant;
  const choices: { [key: string]: string[] } = {
    status: ["all", ...Object.keys(STATUS_LABELS)], prs: ["all", "bump", "other", "none", "unknown"],
    generic: ["all", "generic", "nongeneric"],
    dateField: ["activity", "onchain", "release"],
    archived: ["exclude", "include", "only"], unpublishable: ["exclude", "include"],
    period: Object.keys(PERIOD_LABELS),
    sort: ["activity", "name", "onchain", "release", "status"], direction: ["asc", "desc"], view: ["table", "matrix"],
  };
  Object.keys(choices).forEach((key) => {
    const value = params.get(key);
    if (value && choices[key].includes(value)) (filters as any)[key] = value;
  });
  ["from", "to"].forEach((key) => {
    const value = params.get(key);
    if (value && localDate(value) !== null) (filters as any)[key] = value;
  });
  // Preserve shared links created before relative periods were introduced.
  if (filters.from || filters.to) filters.period = "custom";
  return filters;
}

export function periodStart(period: Filters["period"], now: number): number | null {
  if (period === "all" || period === "custom") return null;
  if (period === "7d" || period === "30d") {
    return now - (period === "7d" ? 7 : 30) * 24 * 60 * 60 * 1000;
  }
  const date = new Date(now);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() - (period === "3m" ? 3 : period === "6m" ? 6 : 12));
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return date.getTime();
}

export function writeFilters(filters: Filters): string {
  const params = new URLSearchParams();
  (Object.keys(filters) as Array<keyof Filters>).forEach((key) => {
    if (filters[key] !== DEFAULT_FILTERS[key]) params.set(key, filters[key]);
  });
  const search = params.toString();
  return search ? `?${search}` : "";
}

export function packageRows(snapshot: DashboardSnapshot): PackageRow[] {
  return snapshot.repositories.reduce<PackageRow[]>((rows, repository) => rows.concat(
    repository.packages.map((pkg) => ({ ...pkg, key: `${repository.id}:${pkg.id}`, repository }))), []);
}

/** Freshness of the repository's GitHub data: releases, PRs and manifests. */
export function githubFreshness(row: PackageRow, snapshot: DashboardSnapshot, now: number, failed = false): Freshness {
  return freshness(row.repository, snapshot.staleAfterSeconds, now, failed);
}

export function onchainFreshness(snapshot: DashboardSnapshot, now: number, failed = false): Freshness {
  return freshness(snapshot.onchain, snapshot.staleAfterSeconds, now, failed);
}

/** Archived repositories are hidden by default. */
export function isArchivedPackage(row: PackageRow): boolean {
  return row.repository.archived;
}

/** True when the package has no on-chain version to compare against. */
export function isUnpublishable(row: PackageRow): boolean {
  return !row.onchain;
}

/** Sorted unique values of one classification field, excluding the unclassified state. */
export function classificationValues(
  rows: PackageRow[], field: "type" | "categories" | "tags",
): string[] {
  const values = new Set<string>();
  rows.forEach((row) => {
    const value = row.classification[field];
    if (typeof value === "string") values.add(value);
    else (value || []).forEach((item) => values.add(item));
  });
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export interface TagHierarchy {
  /** Tags not implied by another tag, most packages first. */
  top: string[];
  /** Sub-tags by parent: every package with a sub-tag also has its parent. */
  children: { [parent: string]: string[] };
  parent: { [tag: string]: string };
  counts: { [tag: string]: number };
}

/** Derive tag nesting from the data, e.g. execution and mev sit under staking. */
export function tagHierarchy(rows: PackageRow[]): TagHierarchy {
  const members: { [tag: string]: Set<string> } = {};
  rows.forEach((row) => row.classification.tags.forEach((tag) => {
    (members[tag] = members[tag] || new Set()).add(row.key);
  }));
  const tags = Object.keys(members);
  const counts: TagHierarchy["counts"] = {};
  tags.forEach((tag) => { counts[tag] = members[tag].size; });
  const contains = (outer: string, inner: string) =>
    counts[outer] > counts[inner] && Array.from(members[inner]).every((key) => members[outer].has(key));
  const parent: TagHierarchy["parent"] = {};
  tags.forEach((tag) => {
    // The closest strict superset is the parent.
    const candidates = tags.filter((other) => other !== tag && contains(other, tag))
      .sort((a, b) => counts[a] - counts[b] || a.localeCompare(b));
    if (candidates.length) parent[tag] = candidates[0];
  });
  const byCount = (a: string, b: string) => counts[b] - counts[a] || a.localeCompare(b);
  const children: TagHierarchy["children"] = {};
  Object.keys(parent).sort(byCount).forEach((tag) => {
    (children[parent[tag]] = children[parent[tag]] || []).push(tag);
  });
  return { top: tags.filter((tag) => !parent[tag]).sort(byCount), children, parent, counts };
}

/** The top-level tag a selection belongs to, e.g. staking for execution. */
export function rootTag(tag: string, hierarchy: TagHierarchy): string {
  let current = tag;
  while (hierarchy.parent[current]) current = hierarchy.parent[current];
  return current;
}

export function pullRequestsFor(rows: PackageRow[]): DashboardPullRequest[] {
  const prs = new Map<string, DashboardPullRequest>();
  rows.forEach((row) => row.repository.pullRequests.forEach((pr) => {
    if (pr.packageIds === null || pr.packageIds.includes(row.id)) prs.set(pr.id, pr);
  }));
  return Array.from(prs.values()).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

/** PR lists are complete only when the repository was read successfully and recently. */
export function hasPrIssues(row: PackageRow, snapshot: DashboardSnapshot, now: number, failed = false): boolean {
  return githubFreshness(row, snapshot, now, failed) !== "ok";
}

export function releaseStatus(row: PackageRow): DashboardPackage["releaseStatus"] {
  return row.releaseStatus;
}

export function dateFor(row: PackageRow, field: Filters["dateField"]): string | null {
  if (field === "onchain") return row.onchain?.publishedAt || null;
  if (field === "release") return row.latestRelease?.publishedAt || null;
  return row.lastActivityAt;
}

export function filterPackages(snapshot: DashboardSnapshot, filters: Filters, now: number, failed = false): PackageRow[] {
  const custom = filters.period === "custom" || !!filters.from || !!filters.to;
  const from = custom ? localDate(filters.from) : periodStart(filters.period, now);
  const to = custom ? localDate(filters.to, true) : filters.period === "all" ? null : now + 1;
  const query = filters.q.trim().toLowerCase();
  const result = packageRows(snapshot).filter((row) => {
    const prs = pullRequestsFor([row]);
    const timestamp = dateFor(row, filters.dateField);
    const time = timestamp ? Date.parse(timestamp) : null;
    const archived = isArchivedPackage(row);
    const { classification } = row;
    return (filters.archived === "include" || (filters.archived === "only" ? archived : !archived)) &&
      (filters.unpublishable === "include" || !isUnpublishable(row)) &&
      (!query || [row.id, row.displayName, row.variant, row.repository.id,
        classification.type || "", ...classification.categories, ...classification.tags]
        .join(" ").toLowerCase().includes(query)) &&
      (filters.type === "all" || (filters.type === UNCLASSIFIED ?
        classification.type === null : classification.type === filters.type)) &&
      (filters.variant === "all" || matrixColumn(row) === filters.variant) &&
      (filters.generic === "all" || (filters.generic === "generic") === (row.variant !== null)) &&
      (filters.category === "all" || (filters.category === UNCLASSIFIED ? classification.categories.length === 0 :
        classification.categories.includes(filters.category))) &&
      (filters.tag === "all" || (filters.tag === UNCLASSIFIED ? classification.tags.length === 0 :
        classification.tags.includes(filters.tag))) &&
      (filters.status === "all" || releaseStatus(row) === filters.status) &&
      (filters.prs === "all" || (filters.prs === "unknown" ? hasPrIssues(row, snapshot, now, failed) :
        filters.prs === "none" ? prs.length === 0 && !hasPrIssues(row, snapshot, now, failed) :
        prs.some((pr) => filters.prs === "bump" ? pr.kind === "bump" : pr.kind !== "bump"))) &&
      (from === null || (time !== null && time >= from)) &&
      (to === null || (time !== null && time < to));
  });
  const tieBreak = (a: PackageRow, b: PackageRow) => a.id.localeCompare(b.id) || a.repository.id.localeCompare(b.repository.id);
  return result.sort((a, b) => {
    let compared: number;
    if (filters.sort === "name") compared = a.displayName.localeCompare(b.displayName);
    else if (filters.sort === "status") compared = STATUS_LABELS[releaseStatus(a)].localeCompare(STATUS_LABELS[releaseStatus(b)]);
    else {
      const field = filters.sort === "activity" ? "activity" : filters.sort;
      const left = dateFor(a, field), right = dateFor(b, field);
      if (!left || !right) return left ? -1 : right ? 1 : tieBreak(a, b);
      compared = Date.parse(left) - Date.parse(right);
    }
    return (filters.direction === "asc" ? compared : -compared) || tieBreak(a, b);
  });
}

/** Problems affecting the shown rows: the service's issues plus staleness it cannot report itself. */
export function dataIssues(rows: PackageRow[], snapshot: DashboardSnapshot, now: number, failed = false): string[] {
  const issues: string[] = [];
  const repoIds = new Set(rows.map((row) => row.repository.id));
  const packageIds = new Set(rows.map((row) => row.id));
  const unreported = (name: string, state: SourceState) => {
    const status = freshness(state, snapshot.staleAfterSeconds, now, failed);
    // Recorded problems are already part of snapshot.issues.
    if (status !== "ok" && !state.problem) issues.push(`${name}: ${status === "unavailable" ? "Not read yet." : "Data is stale."}`);
  };
  unreported("GitHub repositories", snapshot.github);
  unreported("On-chain catalog", snapshot.onchain);
  snapshot.repositories.filter((repo) => repoIds.has(repo.id)).forEach((repo) => unreported(repo.id, repo));
  // Repositories whose manifests were never read have no rows; their issues always apply.
  const listed = new Set(snapshot.repositories.map((repo) => repo.id));
  snapshot.issues.forEach((issue) => {
    if ((!issue.packageId || packageIds.has(issue.packageId)) &&
      (!issue.repositoryId || repoIds.has(issue.repositoryId) || !listed.has(issue.repositoryId))) {
      issues.push(issue.repositoryId ? `${issue.repositoryId}: ${issue.message}` : issue.message);
    }
  });
  return Array.from(new Set(issues));
}

export function matrixGroups(rows: PackageRow[]) {
  const groups = new Map<string, PackageRow[]>();
  rows.forEach((row) => groups.set(row.repository.id, [...(groups.get(row.repository.id) || []), row]));
  return Array.from(groups.entries()).map(([id, items]) => ({ id, repository: items[0].repository, packages: items }));
}

/** Column key shared by non-generic packages and packages without a resolved variant. */
export const NON_GENERIC = "nongeneric";

const VARIANT_ORDER = ["mainnet", "gnosis", "lukso", "hoodi", "sepolia"];

export function matrixColumn(pkg: DashboardPackage): string {
  return pkg.variant === null ? NON_GENERIC : pkg.variant;
}

/** Matrix columns in display order; the non-generic column always comes first. */
export function matrixColumns(packages: DashboardPackage[]): string[] {
  const rank = (column: string) => column === NON_GENERIC ? -1 :
    VARIANT_ORDER.includes(column) ? VARIANT_ORDER.indexOf(column) : VARIANT_ORDER.length;
  return Array.from(new Set(packages.map(matrixColumn))).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}
