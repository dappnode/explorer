import React, { useEffect, useMemo, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { FaArrowDown, FaArrowUp, FaExternalLinkAlt, FaSyncAlt, FaTh, FaList } from "react-icons/fa";
import { freshness, Freshness } from "dashboard/api";
import { useDashboard } from "dashboard/useDashboard";
import {
  dataIssues, dateFor, DEFAULT_FILTERS, filterPackages, Filters, githubFreshness, hasPrIssues,
  matrixColumn, matrixColumns, matrixGroups, isArchivedPackage, classificationValues, UNCLASSIFIED,
  onchainFreshness, packageRows, PackageRow, PERIOD_LABELS, pullRequestsFor, readFilters, releaseStatus,
  STATUS_LABELS, writeFilters,
} from "dashboard/model";
import { DashboardSnapshot } from "dashboard/types";
import "./dashboard.scss";

function dateLabel(value: string | null, includeTime = false): string {
  if (!value) return "No date";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } as const : {}),
  });
}

function label(value: string): string {
  return value.replace(/[_-]/g, " ").replace(/^./, (character) => character.toUpperCase());
}

interface DataContext {
  snapshot: DashboardSnapshot;
  now: number;
  failed: boolean;
}

function SourceNote({ status, message }: { status: Freshness; message?: string }) {
  return status === "ok" ? null : (
    <span className={`dashboard-source-note ${status}`} title={message || "The last successful data is being shown."}>
      {status === "stale" ? "Stale" : "Unavailable"}
    </span>
  );
}

/** Freshness of both sources behind a package row. */
function sources(pkg: PackageRow, context: DataContext) {
  return {
    chain: onchainFreshness(context.snapshot, context.now, context.failed),
    github: githubFreshness(pkg, context.snapshot, context.now, context.failed),
    chainMessage: context.snapshot.onchain.problem?.message,
    githubMessage: pkg.repository.problem?.message,
  };
}

function ReleaseStatus({ pkg, context }: { pkg: PackageRow; context: DataContext }) {
  const status = releaseStatus(pkg);
  const { chain, github } = sources(pkg, context);
  const stale = chain === "stale" || github === "stale";
  return <span className={`dashboard-status ${status}${stale ? " is-stale" : ""}`}>
    <span aria-hidden="true" className="dashboard-status-dot" />
    {STATUS_LABELS[status]}{stale ? " · stale" : ""}
  </span>;
}

function PackageVersions({ pkg, context, showDates = false, matrix = false }: {
  pkg: PackageRow; context: DataContext; showDates?: boolean; matrix?: boolean;
}) {
  const chain = pkg.onchain;
  const release = pkg.latestRelease;
  const state = sources(pkg, context);
  if (matrix) return <MatrixVersions pkg={pkg} context={context} />;
  return <div className="dashboard-versions compact">
    <div>
      <span className="dashboard-version-label">On-chain</span>
      {chain ? <Link className="dashboard-version" to={`/repo/${encodeURIComponent(chain.address)}`}>{chain.version}</Link> :
        <span className="soft">{state.chain !== "unavailable" ? "Not published" : "Unknown"}</span>}
      {showDates && chain && <small>{dateLabel(chain.publishedAt)}</small>}
      <SourceNote status={state.chain} message={state.chainMessage} />
    </div>
    <div>
      <span className="dashboard-version-label">GitHub</span>
      {release ? <a className="dashboard-version" href={release.url} target="_blank" rel="noopener noreferrer" title={release.tag}>
        {release.version} <FaExternalLinkAlt aria-label="Open release on GitHub" />
      </a> : <span className="soft">{state.github !== "unavailable" ? "No release" : "Unknown"}</span>}
      {release?.prerelease && <span className="dashboard-prerelease">Pre-release</span>}
      {showDates && release && <small>{dateLabel(release.publishedAt)}</small>}
      <SourceNote status={state.github} message={state.githubMessage} />
    </div>
  </div>;
}

/** Terse two-line version block for matrix cells: equal versions collapse and sources warn once. */
function MatrixVersions({ pkg, context }: { pkg: PackageRow; context: DataContext }) {
  const chain = pkg.onchain;
  const release = pkg.latestRelease;
  const { chain: chainState, github: releaseState, chainMessage, githubMessage } = sources(pkg, context);
  if (!chain && !release && chainState !== "ok" && releaseState !== "ok") {
    const messages = [chainMessage, githubMessage].filter(Boolean).join("\n");
    return <p className="dashboard-matrix-empty" title={messages || undefined}>No version data</p>;
  }
  const same = !!chain && !!release && chain.version === release.version;
  const published = (observed: boolean) => observed ? "Not published" : "Unknown";
  const problems: string[] = [];
  if (chainState !== "ok") problems.push(`On-chain ${chainState === "stale" ? "stale" : "unavailable"}`);
  if (!same && releaseState !== "ok") problems.push(`GitHub ${releaseState === "stale" ? "stale" : "unavailable"}`);
  return <>
    <dl className="dashboard-matrix-versions">
      {same ? <>
        <dt>Version</dt>
        <dd><a className="dashboard-version" href={release!.url} target="_blank" rel="noopener noreferrer" title={release!.tag}>
          {chain!.version} <FaExternalLinkAlt aria-label="Open release on GitHub" />
        </a></dd>
      </> : <>
        <dt>On-chain</dt>
        <dd>{chain ? <Link className="dashboard-version" to={`/repo/${encodeURIComponent(chain.address)}`}>{chain.version}</Link> :
          <span className="soft">{published(chainState === "ok" || chainState === "stale")}</span>}</dd>
        <dt>GitHub</dt>
        <dd>{release ? <a className="dashboard-version" href={release.url} target="_blank" rel="noopener noreferrer" title={release.tag}>
          {release.version} <FaExternalLinkAlt aria-label="Open release on GitHub" />
        </a> : <span className="soft">{published(releaseState === "ok" || releaseState === "stale")}</span>}</dd>
      </>}
    </dl>
    {problems.length > 0 && <p className="dashboard-matrix-note">{problems.join(" · ")}</p>}
  </>;
}

function PullRequests({ packages, context }: { packages: PackageRow[]; context: DataContext }) {
  const prs = pullRequestsFor(packages);
  const bumps = prs.filter((pr) => pr.kind === "bump").length;
  const other = prs.length - bumps;
  const incomplete = packages.some((pkg) => hasPrIssues(pkg, context.snapshot, context.now, context.failed));
  const repos = Array.from(new Set(packages.map((pkg) => pkg.repository)));
  // One aggregated note instead of repeating a note per repository.
  const problems = repos.filter((repo) =>
    freshness(repo, context.snapshot.staleAfterSeconds, context.now, context.failed) !== "ok"
  ).map((repo) => `${repo.id}: ${repo.problem?.message || "Data is stale."}`);
  return <div className="dashboard-prs">
    {prs.length > 0 ? <details>
      <summary aria-label={`${bumps} bump PRs, ${other} other or unclassified PRs`}>
        {bumps > 0 && <span className="dashboard-pr-count bump">{bumps} bump</span>}
        {other > 0 && <span className="dashboard-pr-count">{other} other</span>}
      </summary>
      <ul className="dashboard-pr-list">
        {prs.map((pr) => <li key={pr.id}>
          <a href={pr.url} target="_blank" rel="noopener noreferrer">#{pr.number} {pr.title}</a>
          <small>{pr.author}{pr.draft ? " · Draft" : ""} · {pr.kind === "unknown" ? "Unclassified" : label(pr.kind)} · {pr.packageIds ? "Package-specific" : "Repository-wide"}</small>
        </li>)}
      </ul>
    </details> : <span className="soft">{incomplete ? "PR status unknown" : "No open PRs"}</span>}
    {incomplete && <span className="dashboard-source-note stale" title={problems.join("\n") || "Pull request data is incomplete."}>PR data incomplete</span>}
  </div>;
}

function PackageName({ pkg }: { pkg: PackageRow }) {
  const chain = pkg.onchain;
  const archived = isArchivedPackage(pkg);
  return <div className="dashboard-package-name">
    {chain ? <Link to={`/repo/${encodeURIComponent(chain.address)}`}>{pkg.displayName}</Link> : <strong>{pkg.displayName}</strong>}
    <small>{pkg.id}</small>
    <div className="dashboard-package-tags">
      {pkg.classification.type && <span>{label(pkg.classification.type)}</span>}
      {pkg.classification.type === null && pkg.classification.categories.length === 0 && <span>Unclassified</span>}
      {pkg.classification.tags.map((tag) => <span key={tag}>{label(tag)}</span>)}
      {archived && <span>Archived</span>}
      {!chain && <span>No on-chain version</span>}
    </div>
  </div>;
}

/** Compact package identity for matrix cells: the variant is already the column heading. */
function MatrixPackageName({ pkg }: { pkg: PackageRow }) {
  const chain = pkg.onchain;
  const tags = [
    pkg.classification.type ? label(pkg.classification.type) : null,
    ...pkg.classification.tags.map(label),
    !chain ? "No on-chain version" : null,
    isArchivedPackage(pkg) ? "Archived" : null,
  ].filter(Boolean) as string[];
  return <div className="dashboard-matrix-name">
    {chain ? <Link to={`/repo/${encodeURIComponent(chain.address)}`}>{pkg.displayName}</Link> : <strong>{pkg.displayName}</strong>}
    {tags.length > 0 && <small>{tags.join(" · ")}</small>}
  </div>;
}

function PackageTable({ packages, context, filters }: {
  packages: PackageRow[]; context: DataContext; filters: Filters;
}) {
  return <div className="table-container dashboard-table-wrap" tabIndex={0} role="region" aria-label="Package dashboard table">
    <table className="dashboard-table">
      <thead><tr>
        <th>Package</th><th>Variant</th><th>On-chain / GitHub</th><th>Release status</th><th>Open PRs</th>
        <th>{filters.dateField === "onchain" ? "On-chain date" : filters.dateField === "release" ? "Release date" : "Last activity"}</th>
      </tr></thead>
      <tbody>{packages.map((pkg) => <tr key={pkg.key}>
        <td><PackageName pkg={pkg} /></td>
        <td><span className="dashboard-variant">{pkg.variant ? label(pkg.variant) : <span className="dashboard-not-applicable" aria-label="No variant">—</span>}</span></td>
        <td><PackageVersions pkg={pkg} context={context} showDates /></td>
        <td><ReleaseStatus pkg={pkg} context={context} /></td>
        <td><PullRequests packages={[pkg]} context={context} /></td>
        <td className="dashboard-date" title={dateFor(pkg, filters.dateField) || undefined}>{dateLabel(dateFor(pkg, filters.dateField))}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

function PackageMatrix({ packages, context }: { packages: PackageRow[]; context: DataContext }) {
  const columns = matrixColumns(packages);
  return <div className="table-container dashboard-matrix-wrap" tabIndex={0} role="region" aria-label="Package variant matrix">
    <table className="dashboard-matrix">
      <thead><tr><th>Package / Repository</th>{columns.map((column) => <th key={column}>{label(column)}</th>)}</tr></thead>
      <tbody>{matrixGroups(packages).map((group) => {
        const repo = group.repository;
        return <tr key={group.id}>
          <td className="dashboard-matrix-group">
            <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.id.replace(/^dappnode\//, "").replace(/^DAppNodePackage-/i, "")}</a>
            {repo.archived && <small>Archived</small>}
            <small>{group.packages.length} package{group.packages.length === 1 ? "" : "s"}</small>
            <PullRequests packages={group.packages} context={context} />
          </td>
          {columns.map((column) => {
            const items = group.packages.filter((pkg) => matrixColumn(pkg) === column);
            return <td key={column}>{items.length ? items.map((pkg) => <article className="dashboard-matrix-package" key={pkg.key}>
              <MatrixPackageName pkg={pkg} />
              <ReleaseStatus pkg={pkg} context={context} />
              <PackageVersions pkg={pkg} context={context} matrix />
            </article>) : <span className="dashboard-not-applicable" aria-label="No package for this variant">—</span>}</td>;
          })}
        </tr>;
      })}</tbody>
    </table>
  </div>;
}

export function Dashboard() {
  const { snapshot, error, loading, refresh } = useDashboard();
  const location = useLocation();
  const history = useHistory();
  const filters = useMemo(() => readFilters(location.search), [location.search]);
  const [now, setNow] = useState(Date.now());
  const [advancedOpen, setAdvancedOpen] = useState(false);
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, []);
  const failed = !!error;
  const packages = useMemo(() => snapshot ? filterPackages(snapshot, filters, now, failed) : [], [snapshot, filters, now, failed]);
  const issues = useMemo(() => snapshot ? dataIssues(packages, snapshot, now, failed) : [], [packages, snapshot, now, failed]);
  const prs = useMemo(() => pullRequestsFor(packages), [packages]);
  const allRows = useMemo(() => snapshot ? packageRows(snapshot) : [], [snapshot]);
  const update = (patch: Partial<Filters>) => history.replace({
    pathname: location.pathname, search: writeFilters({ ...filters, ...patch }),
  });
  const reset = () => update({ ...DEFAULT_FILTERS, view: filters.view });
  const filterCount = (Object.keys(filters) as Array<keyof Filters>).filter((key) =>
    !["view", "from", "to"].includes(key) && filters[key] !== DEFAULT_FILTERS[key]).length;
  const advancedCount = (["variant", "type", "category", "tag", "status", "prs", "archived", "unpublishable", "dateField", "sort", "direction"] as Array<keyof Filters>)
    .filter((key) => filters[key] !== DEFAULT_FILTERS[key]).length + (filters.period === "custom" ? 1 : 0);
  const context = snapshot ? { snapshot, now, failed } : undefined;
  const variants = matrixColumns(allRows);
  const types = classificationValues(allRows, "type");
  const categories = classificationValues(allRows, "categories");
  const tags = classificationValues(allRows, "tags");
  const unclassifiedTypes = allRows.filter((pkg) => pkg.classification.type === null).length;
  const unclassifiedCategories = allRows.filter((pkg) => pkg.classification.categories.length === 0).length;
  const unclassifiedTags = allRows.filter((pkg) => pkg.classification.tags.length === 0).length;
  const withFallback = (values: string[], current: string) =>
    Array.from(new Set([...values, ...(current !== "all" ? [current] : [])]));
  const dateError = !!(filters.from && filters.to && filters.from > filters.to);
  const globalStale = !!snapshot && now - Date.parse(snapshot.generatedAt) > snapshot.staleAfterSeconds * 1000;
  const partial = !!snapshot && (snapshot.issues.length > 0 || !!snapshot.github.problem || !!snapshot.onchain.problem);
  const incomplete = !!snapshot && (partial || globalStale || failed || issues.length > 0);

  function select(key: keyof Filters, title: string, options: Array<[string, string]>) {
    return <label className="dashboard-field">{title}
      <select value={filters[key]} onChange={(event) => update({ [key]: event.target.value })}>
        {options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}
      </select>
    </label>;
  }

  return <main className="dashboard" aria-busy={loading}>
    <div className="dashboard-heading">
      <div><p className="dashboard-eyebrow">Package operations</p><h1>Release dashboard</h1>
        <p className="soft">Track package releases, on-chain versions, and open pull requests.</p></div>
      <div className="dashboard-refresh">
        <button className="btn btn-ghost" onClick={() => refresh()} disabled={loading}>
          <FaSyncAlt className={loading ? "is-spinning" : ""} aria-hidden="true" />{loading ? "Refreshing…" : "Refresh"}
        </button>
        {snapshot && <small title={snapshot.generatedAt}>{globalStale || failed ? "Last snapshot" : "Updated"} {dateLabel(snapshot.generatedAt, true)}</small>}
      </div>
    </div>

    {error && <div className="dashboard-notice warning" role="alert">{error}{snapshot && " Showing the last available snapshot; data may be out of date."}</div>}
    {partial && <div className="dashboard-notice warning" role="status">Some packages or sources could not be checked. Counts may be incomplete.</div>}
    {globalStale && !error && <div className="dashboard-notice warning" role="status">This snapshot is out of date. Displayed versions and PRs may have changed.</div>}

    {!snapshot ? loading ? <div className="dashboard-skeleton" role="status" aria-label="Loading dashboard"><div /><div /><div /><p>Loading package dashboard…</p></div> :
      <section className="card dashboard-empty"><h2>Dashboard unavailable</h2><p className="soft">Package data is not available right now.</p><button className="btn btn-primary" onClick={() => refresh()}>Try again</button></section> : context && <>
      <div className="dashboard-stats" aria-label="Filtered dashboard summary">
        {[
          ["Packages", packages.length, `${allRows.length} in catalog`, "neutral"],
          ["Release available", packages.filter((pkg) => releaseStatus(pkg) === "release_available").length, "Newer than on-chain", "accent"],
          ["Unpublished", packages.filter((pkg) => releaseStatus(pkg) === "unpublished").length, "Ready for first publication", "warning"],
          ["Bump PRs", prs.filter((pr) => pr.kind === "bump").length, "Unique open pull requests", "purple"],
          ["Other PRs", prs.filter((pr) => pr.kind !== "bump").length, "Includes unclassified PRs", "neutral"],
          ["Data issues", issues.length, incomplete ? "Some data needs attention" : "All filtered sources checked", issues.length ? "warning" : "neutral"],
        ].map(([title, count, description, tone]) => <div className={`dashboard-stat ${tone}`} key={title}>
          <span>{title}</span><strong>{count}</strong><small>{description}</small>
        </div>)}
      </div>

      <section className="card dashboard-filters" aria-label="Dashboard filters">
        <div className="dashboard-search-row">
          <label className="dashboard-field dashboard-search">Search packages
            <input type="search" placeholder="Search by name or repository…" value={filters.q} onChange={(event) => update({ q: event.target.value })} />
          </label>
          <label className="dashboard-field dashboard-period">Period
            <select value={filters.period} onChange={(event) => update({ period: event.target.value as Filters["period"], from: "", to: "" })}>
              {Object.entries(PERIOD_LABELS).filter(([value]) => value !== "custom" || filters.period === "custom")
                .map(([value, text]) => <option value={value} key={value}>{text}</option>)}
            </select>
          </label>
        </div>
        <div className="dashboard-filter-toolbar">
          <div className="dashboard-type-switch" role="group" aria-label="Package type">
            {([["all", `All${types.length ? " types" : " packages"}`], ...(types.length > 1 ? types.map((value): [string, string] => [value, label(value)]) : []),
              ...(unclassifiedTypes > 0 ? [[UNCLASSIFIED, "Unclassified"]] : [])] as Array<[string, string]>)
              .map(([value, text]) => <button key={value} aria-pressed={filters.type === value} onClick={() => update({ type: value })}>{text}</button>)}
          </div>
          <div className="dashboard-filter-actions">
            {filterCount > 0 && <button className="dashboard-text-button" onClick={reset}>Clear filters</button>}
            <button className="dashboard-advanced-toggle" aria-expanded={advancedOpen} aria-controls="dashboard-advanced-filters" onClick={() => setAdvancedOpen(!advancedOpen)}>
              Advanced{advancedCount > 0 && <span className="dashboard-filter-count">{advancedCount} active</span>}
            </button>
          </div>
        </div>
        <div className="dashboard-advanced-filters" id="dashboard-advanced-filters" hidden={!advancedOpen}>
          <div className="dashboard-filter-grid">
            {select("variant", "Variant", [["all", "All variants"], ...withFallback(variants, filters.variant).sort().map((value): [string, string] => [value, label(value)])])}
            {select("category", "Category", [["all", "All categories"], ...withFallback(categories, filters.category).map((value): [string, string] => [value, value]),
              ...(unclassifiedCategories > 0 ? [[UNCLASSIFIED, "Unclassified"]] as Array<[string, string]> : [])])}
            {select("tag", "Tag", [["all", "All tags"], ...withFallback(tags, filters.tag).map((value): [string, string] => [value, label(value)]),
              ...(unclassifiedTags > 0 ? [[UNCLASSIFIED, "No tags"]] as Array<[string, string]> : [])])}
            {select("status", "Release status", [["all", "All release statuses"], ...Object.entries(STATUS_LABELS)])}
            {select("prs", "Pull requests", [["all", "All PR states"], ["bump", "Has bump PRs"], ["other", "Has other PRs"], ["none", "No open PRs"], ["unknown", "Incomplete PR data"]])}
          </div>
          <div className="dashboard-filter-grid">
            {select("archived", "Archived packages", [["exclude", "Hidden"], ["include", "Show alongside active"], ["only", "Archived only"]])}
            {select("unpublishable", "No on-chain version", [["exclude", "Hidden"], ["include", "Show"]])}
            {select("dateField", "Date field", [["activity", "Last activity"], ["onchain", "On-chain publication"], ["release", "GitHub release"]])}
          </div>
          <div className="dashboard-filter-grid">
            <label className="dashboard-field">From<input type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => update({ from: event.target.value, period: "custom" })} aria-invalid={dateError} /></label>
            <label className="dashboard-field">Through<input type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => update({ to: event.target.value, period: "custom" })} aria-invalid={dateError} /></label>
          </div>
          {dateError && <p className="dashboard-field-error" role="alert">The start date must be on or before the through date.</p>}
          <div className="dashboard-sort">{select("sort", "Sort by", [["activity", "Last activity"], ["name", "Package name"], ["onchain", "On-chain date"], ["release", "GitHub release date"], ["status", "Release status"]])}
            <button className="dashboard-icon-button" aria-label={filters.direction === "desc" ? "Sort ascending" : "Sort descending"} onClick={() => update({ direction: filters.direction === "desc" ? "asc" : "desc" })}>
              {filters.direction === "desc" ? <FaArrowDown /> : <FaArrowUp />}
            </button>
          </div>
          <p className="dashboard-filter-hint">Periods use last activity unless another date field is selected. Custom dates use your local timezone and include the whole through day.</p>
        </div>
      </section>

      <div className="dashboard-results-bar">
        <span aria-live="polite"><strong>{packages.length}</strong> package{packages.length === 1 ? "" : "s"}{filterCount ? " matching filters" : " across all variants"}{incomplete ? " · Counts may be incomplete" : ""}</span>
        <div className="dashboard-view-switch" aria-label="Dashboard view">
          <button aria-pressed={filters.view === "table"} onClick={() => update({ view: "table" })}><FaList aria-hidden="true" />Table</button>
          <button aria-pressed={filters.view === "matrix"} onClick={() => update({ view: "matrix" })}><FaTh aria-hidden="true" />Matrix</button>
        </div>
      </div>
      {packages.length === 0 ? <section className="card dashboard-empty"><h2>{filterCount ? "No packages match these filters" : "No packages available yet"}</h2><p className="soft">{filterCount ? "Try a broader search or clear the filters." : "The next collection may include more packages."}</p>{filterCount > 0 && <button className="btn btn-ghost" onClick={reset}>Clear filters</button>}</section> :
        filters.view === "matrix" ? <PackageMatrix packages={packages} context={context} /> : <PackageTable packages={packages} context={context} filters={filters} />}
      {issues.length > 0 && <details className="card dashboard-issues"><summary>Data issues ({issues.length})</summary><ul>{issues.map((issue, index) => <li key={index}>{issue}</li>)}</ul></details>}
    </>}
  </main>;
}
