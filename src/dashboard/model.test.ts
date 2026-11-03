import { freshness, parseSnapshot } from "./api";
import { DashboardPackage, DashboardSnapshot, Upstream } from "./types";
import { fixture, HOODI_ID, MAINNET_ID, NOW, REPO_ID, repository } from "./fixtures";
import {
  dataIssues, DEFAULT_FILTERS, filterPackages, hasPrIssues, localDate, matrixColumn, matrixColumns, matrixGroups,
  NON_GENERIC, packageRows, periodStart, pullRequestsFor, readFilters, releaseBump, rootTag, upstreamChanges, versionBump, tagHierarchy, UNCLASSIFIED, writeFilters,
} from "./model";

const all = { archived: "include" as const, unpublishable: "include" as const };
const geth = (snapshot: DashboardSnapshot) => snapshot.repositories.find((repo) => repo.id === REPO_ID)!;
const row = (snapshot: DashboardSnapshot, id: string) => packageRows(snapshot).find((item) => item.id === id)!;
const ids = (snapshot: DashboardSnapshot, patch: Partial<typeof DEFAULT_FILTERS> = {}, now = NOW) =>
  filterPackages(snapshot, { ...DEFAULT_FILTERS, ...patch }, now).map((pkg) => pkg.id);

test("filters by manifest type, category, and curated tag, including unclassified states", () => {
  const snapshot = fixture();
  expect(ids(snapshot, { type: "service" })).toEqual([MAINNET_ID, HOODI_ID]);
  expect(ids(snapshot, { ...all, type: UNCLASSIFIED })).toEqual(["legacy.dnp.dappnode.eth"]);
  expect(ids(snapshot, { category: "Blockchain" })).toEqual([MAINNET_ID, HOODI_ID]);
  expect(ids(snapshot, { ...all, category: UNCLASSIFIED })).toEqual(["application.public.dappnode.eth", "legacy.dnp.dappnode.eth"]);
  expect(ids(snapshot, { tag: "execution" })).toEqual([MAINNET_ID]);
  expect(ids(snapshot, { tag: "staking" })).toEqual([MAINNET_ID, HOODI_ID]);
  expect(ids(snapshot, { ...all, tag: UNCLASSIFIED })).toEqual(["application.public.dappnode.eth", "legacy.dnp.dappnode.eth"]);
  expect(ids(snapshot, { q: "ETH2.0" })).toEqual([]);
  expect(ids(snapshot, { q: "blockchain" })).toEqual([MAINNET_ID, HOODI_ID]);
  expect(ids(snapshot, { ...all, q: "dappnodepackage-app" })).toEqual(["application.public.dappnode.eth"]);
});

test("tag hierarchy nests tags whose packages always carry another tag", () => {
  const snapshot = fixture();
  geth(snapshot).packages.push({
    ...geth(snapshot).packages[1], id: "op-geth.dnp.dappnode.eth", variant: null,
    classification: { type: "service", categories: [], tags: ["l2"] },
  });
  const hierarchy = tagHierarchy(packageRows(snapshot));
  expect(hierarchy.top).toEqual(["staking", "l2"]);
  expect(hierarchy.children).toEqual({ staking: ["execution"] });
  expect(hierarchy.counts).toEqual({ execution: 1, staking: 2, l2: 1 });
  expect(rootTag("execution", hierarchy)).toBe("staking");
  expect(rootTag("l2", hierarchy)).toBe("l2");
  // Tags with identical members are peers, not parent and child.
  geth(snapshot).packages[1].classification.tags = ["execution", "staking"];
  expect(tagHierarchy(packageRows(snapshot)).top).toEqual(["execution", "staking", "l2"]);
});

test("generic switch separates variant packages from plain ones", () => {
  const snapshot = fixture();
  expect(ids(snapshot, { ...all, generic: "generic" })).toEqual([MAINNET_ID, HOODI_ID]);
  expect(ids(snapshot, { ...all, generic: "nongeneric" })).toEqual(["application.public.dappnode.eth", "legacy.dnp.dappnode.eth"]);
  expect(readFilters("?generic=nongeneric").generic).toBe("nongeneric");
  expect(readFilters("?generic=maybe").generic).toBe("all");
  expect(writeFilters({ ...DEFAULT_FILTERS, generic: "generic" })).toBe("?generic=generic");
});

test("deduplicates repository PRs while respecting package-specific scope", () => {
  const snapshot = fixture();
  expect(pullRequestsFor(packageRows(snapshot))).toHaveLength(2);
  expect(pullRequestsFor([row(snapshot, HOODI_ID)]).map((pr) => pr.number)).toEqual([104]);
  expect(ids(snapshot, { prs: "other" })).toEqual([MAINNET_ID]);
  expect(ids(snapshot, { prs: "none" })).toEqual([]);
});

test("a package declared by an archived former repository is a separate, hidden row", () => {
  const snapshot = fixture();
  const old = geth(snapshot).packages[0];
  snapshot.repositories.push({
    ...repository("dappnode/dappnodepackage-geth", [{ ...old, releaseStatus: "onchain_ahead" }], [{
      ...geth(snapshot).pullRequests[0], id: "dappnode/dappnodepackage-geth#1", number: 1,
    }]),
    archived: true,
  });
  expect(ids(snapshot, { variant: "mainnet" })).toEqual([MAINNET_ID]);
  const rows = filterPackages(snapshot, { ...DEFAULT_FILTERS, archived: "include", variant: "mainnet" }, NOW);
  expect(rows.map((item) => [item.repository.id, item.releaseStatus])).toEqual([
    ["dappnode/dappnodepackage-geth", "onchain_ahead"], [REPO_ID, "release_available"],
  ]);
  expect(new Set(rows.map((item) => item.key)).size).toBe(2);
  // PRs stay with the repository that has them.
  expect(pullRequestsFor([rows[1]]).map((pr) => pr.number)).toEqual([104, 105].reverse());
});

test("date ranges use local calendar boundaries, include the through day, and exclude undated packages", () => {
  const snapshot = fixture();
  const start = localDate("2026-10-25")!;
  const end = localDate("2026-10-25", true)!;
  const [mainnet, hoodi] = geth(snapshot).packages;
  mainnet.lastActivityAt = new Date(start).toISOString();
  hoodi.lastActivityAt = new Date(end - 1).toISOString();
  expect(ids(snapshot, { from: "2026-10-25", to: "2026-10-25" })).toHaveLength(2);
  hoodi.lastActivityAt = new Date(end).toISOString();
  expect(ids(snapshot, { from: "2026-10-25", to: "2026-10-25" })).toHaveLength(1);
  expect(ids(snapshot)).toHaveLength(2);
  expect(localDate("2026-02-30")).toBeNull();
});

test("selects source dates independently and keeps undated packages last in either sort direction", () => {
  const snapshot = fixture();
  expect(ids(snapshot, { ...all, dateField: "release", from: "2026-11-01" })).toEqual([]);
  expect(ids(snapshot, { ...all, dateField: "activity", from: "2026-11-01" })).toHaveLength(2);
  ["asc", "desc"].forEach((direction) => {
    const packages = filterPackages(snapshot, { ...DEFAULT_FILTERS, ...all, direction: direction as "asc" | "desc" }, NOW);
    expect(packages.slice(-2).every((pkg) => pkg.lastActivityAt === null)).toBe(true);
  });
});

test("URL filters round-trip and reject unsupported enums and malformed dates", () => {
  const filters = { ...DEFAULT_FILTERS, q: "geth & hoodi", type: "service", category: "Blockchain", tag: "staking", period: "custom" as const, from: "2026-10-25", view: "matrix" as const };
  expect(readFilters(writeFilters(filters))).toEqual(filters);
  expect(readFilters("?from=2026-02-30&view=bogus&prs=maybe")).toEqual(DEFAULT_FILTERS);
  // Staking was removed from the contract; old links must not resurrect it.
  expect(readFilters("?staking=staking")).toEqual(DEFAULT_FILTERS);
});

test("recent periods advance with time, include the cutoff, and exclude future or undated activity", () => {
  const snapshot = fixture();
  const [mainnet, hoodi] = geth(snapshot).packages;
  mainnet.lastActivityAt = new Date(periodStart("7d", NOW)!).toISOString();
  hoodi.lastActivityAt = new Date(NOW + 1).toISOString();
  expect(ids(snapshot, { period: "7d" })).toEqual([MAINNET_ID]);
  expect(ids(snapshot, { period: "7d" }, NOW + 1)).toEqual([HOODI_ID]);
  expect(readFilters("?period=7d").period).toBe("7d");
  expect(readFilters("?period=invalid").period).toBe("all");
});

test("calendar periods clamp month ends and leap years", () => {
  const sixMonthsAgo = new Date(periodStart("6m", new Date(2026, 7, 31, 12).getTime())!);
  expect([sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), sixMonthsAgo.getDate()]).toEqual([2026, 1, 28]);
  const yearAgo = new Date(periodStart("1y", new Date(2024, 1, 29, 12).getTime())!);
  expect([yearAgo.getFullYear(), yearAgo.getMonth(), yearAgo.getDate()]).toEqual([2023, 1, 28]);
});

test("matrix groups by repository and retains every package when two variants share a column", () => {
  const snapshot = fixture();
  geth(snapshot).packages.push({ ...geth(snapshot).packages[0], id: "geth.public.dappnode.eth" });
  const groups = matrixGroups(packageRows(snapshot));
  expect(groups.find((group) => group.id === REPO_ID)!.packages).toHaveLength(3);
  expect(matrixColumn(row(snapshot, "application.public.dappnode.eth"))).toBe(NON_GENERIC);
  expect(matrixColumns(packageRows(snapshot))[0]).toBe(NON_GENERIC);
});

test("variant filter selects by matrix column and accepts legacy network links", () => {
  const snapshot = fixture();
  expect(ids(snapshot, { variant: "mainnet" })).toEqual([MAINNET_ID]);
  expect(filterPackages(snapshot, { ...DEFAULT_FILTERS, ...all, variant: NON_GENERIC }, NOW).map((pkg) => pkg.displayName)).toEqual(["Application", "Legacy package"]);
  expect(readFilters("?network=hoodi").variant).toBe("hoodi");
  expect(writeFilters({ ...DEFAULT_FILTERS, variant: "hoodi" })).toBe("?variant=hoodi");
});

test("matrix columns only include variants present in the filtered packages", () => {
  const snapshot = fixture();
  const columns = (patch: Partial<typeof DEFAULT_FILTERS>) => matrixColumns(filterPackages(snapshot, { ...DEFAULT_FILTERS, ...patch }, NOW));
  expect(columns({})).toEqual(["mainnet", "hoodi"]);
  expect(columns({ variant: "hoodi" })).toEqual(["hoodi"]);
  expect(columns({ type: UNCLASSIFIED, unpublishable: "include" })).toEqual([NON_GENERIC]);
  expect(columns({ status: "no_release", unpublishable: "include" })).toEqual([NON_GENERIC]);
});

test("archived and on-chain-less packages are hidden by default and opt-in", () => {
  const snapshot = fixture();
  const retired: DashboardPackage = { ...geth(snapshot).packages[0], id: "retired.dnp.dappnode.eth", displayName: "Retired" };
  snapshot.repositories.push({ ...repository("dappnode/dappnodepackage-retired", [retired]), archived: true });
  expect(ids(snapshot)).toEqual([MAINNET_ID, HOODI_ID]);
  expect(ids(snapshot, { unpublishable: "include" })).toEqual([MAINNET_ID, HOODI_ID, "application.public.dappnode.eth", "legacy.dnp.dappnode.eth"]);
  expect(ids(snapshot, { archived: "include" })).toEqual([MAINNET_ID, "retired.dnp.dappnode.eth", HOODI_ID]);
  expect(ids(snapshot, { archived: "only" })).toEqual(["retired.dnp.dappnode.eth"]);
  expect(ids(snapshot, { ...all, q: "retired" })).toEqual(["retired.dnp.dappnode.eth"]);
  // Legacy links used all/active/archived values and must not leak into state.
  expect(readFilters("?archived=archived").archived).toBe("exclude");
  expect(writeFilters({ ...DEFAULT_FILTERS, archived: "include" })).toBe("?archived=include");
});

test("failures and aged sources cannot imply no open PRs or fresh data", () => {
  const snapshot = fixture();
  const hoodi = row(snapshot, HOODI_ID);
  expect(hasPrIssues(hoodi, snapshot, NOW)).toBe(false);
  expect(hasPrIssues(hoodi, snapshot, NOW + 3600000)).toBe(true);
  expect(hasPrIssues(hoodi, snapshot, NOW, true)).toBe(true);
  expect(freshness(snapshot.onchain, snapshot.staleAfterSeconds, NOW + 3600000)).toBe("stale");
  // Never read successfully: PR data is unavailable, not empty.
  expect(hasPrIssues(row(snapshot, "legacy.dnp.dappnode.eth"), snapshot, NOW)).toBe(true);
  expect(ids(snapshot, { ...all, prs: "none" })).toEqual(["application.public.dappnode.eth"]);
  // A failed source keeps its last data but is reported as stale.
  snapshot.onchain.problem = { code: "onchain_scan_failed", message: "GraphQL unavailable" };
  expect(freshness(snapshot.onchain, snapshot.staleAfterSeconds, NOW)).toBe("stale");
});

test("data issues list service issues for the shown rows plus unreported staleness", () => {
  const snapshot = fixture();
  const shown = (patch: Partial<typeof DEFAULT_FILTERS>, now = NOW) =>
    dataIssues(filterPackages(snapshot, { ...DEFAULT_FILTERS, ...patch }, now), snapshot, now);
  const broken = "dappnode/dappnodepackage-broken: Package manifests on main could not be read.";
  expect(shown({})).toEqual([broken]);
  expect(shown(all)).toEqual(["dappnode/dappnodepackage-legacy: Releases could not be listed.", broken]);
  expect(shown({}, NOW + 3600000)).toEqual([
    "GitHub repositories: Data is stale.", "On-chain catalog: Data is stale.", `${REPO_ID}: Data is stale.`, broken,
  ]);
});

test("API validation accepts additive fields and rejects bad shapes, references, and unsafe links", () => {
  expect(parseSnapshot({ ...fixture(), futureField: true }).repositories).toHaveLength(3);
  expect(() => parseSnapshot({ ...fixture(), schemaVersion: 1 })).toThrow(/unsupported/);
  const badScope = fixture();
  geth(badScope).pullRequests[1].packageIds = ["missing.dnp.dappnode.eth"];
  expect(() => parseSnapshot(badScope)).toThrow(/references/);
  const duplicate = fixture();
  geth(duplicate).packages.push(geth(duplicate).packages[0]);
  expect(() => parseSnapshot(duplicate)).toThrow(/references/);
  const unsafe = fixture();
  unsafe.repositories[0].url = "javascript:alert(1)";
  expect(() => parseSnapshot(unsafe)).toThrow(/unsupported/);
  const badPrs: any = fixture();
  badPrs.repositories[0].pullRequests = null;
  expect(() => parseSnapshot(badPrs)).toThrow(/unsupported/);
});

test("sizes a version change by its first differing component", () => {
  expect(versionBump("v1.14.12", "v1.14.13")).toBe("patch");
  expect(versionBump("25.10.0", "26.7.1")).toBe("major");
  expect(versionBump("v2.60.8", "v2.61.0")).toBe("minor");
  expect(versionBump("v1.0.0-rc.1", "v1.0.0")).toBe("patch");
  expect(versionBump("2.7", "3.0.2")).toBe("major");
  expect(versionBump("v1.2.3", "v1.2.3")).toBeNull();
  expect(versionBump("release27932", "release28000")).toBeNull();
});

test("classifies a pending release by its largest third-party upstream change", () => {
  const snapshot = fixture();
  const mainnet = row(snapshot, MAINNET_ID);
  const pin = (repo: string | null, version: string) => ({ repo, version });
  const scripts = (version: string) => pin("dappnode/staker-package-scripts", version);
  const pending = (before: Upstream[] | null, after: Upstream[] | null) => ({
    ...mainnet, onchain: { ...mainnet.onchain!, upstreams: before }, latestRelease: { ...mainnet.latestRelease!, upstreams: after },
  });
  // The package's own version jump no longer decides; unknown upstreams leave it unsized.
  expect(releaseBump(mainnet)).toBeNull();
  expect(upstreamChanges(mainnet)).toBeNull();
  const geth = pending(
    [pin("ethereum/go-ethereum", "v1.14.12"), pin("ObolNetwork/charon", "v1.1.0"), scripts("v0.1.2")],
    [pin("ethereum/go-ethereum", "v1.14.13"), pin("obolnetwork/charon", "v2.0.0"), scripts("v0.2.0")],
  );
  expect(upstreamChanges(geth)!.map((c) => [c.repo, c.bump])).toEqual([["obolnetwork/charon", "major"], ["ethereum/go-ethereum", "patch"]]);
  expect(releaseBump(geth)).toBe("major");
  // DAppNode helper repositories count only when nothing else is pinned.
  expect(releaseBump(pending([pin("ethereum/go-ethereum", "v1.14.12"), scripts("v0.1.2")], [pin("ethereum/go-ethereum", "v1.14.12"), scripts("v0.2.0")]))).toBeNull();
  expect(releaseBump(pending([scripts("v0.1.2")], [scripts("v0.2.0")]))).toBe("minor");
  // Version-only legacy manifests pair when each side pins one upstream.
  expect(releaseBump(pending([pin(null, "2.1.5")], [pin("isc/bind", "2.2.0")]))).toBe("minor");
  expect(upstreamChanges(pending([], []))).toEqual([]);
  expect(releaseBump(row(snapshot, HOODI_ID))).toBeNull();
});

test("accepts optional release artifacts and rejects malformed ones", () => {
  const withRelease = (patch: object) => {
    const snapshot = fixture();
    Object.assign(geth(snapshot).packages.find((pkg) => pkg.id === MAINNET_ID)!.latestRelease!, patch);
    return snapshot;
  };
  expect(() => parseSnapshot(withRelease({ contentUri: "/ipfs/QmHash", upstreams: [{ repo: null, version: "1.0.0" }] }))).not.toThrow();
  expect(() => parseSnapshot(withRelease({ contentUri: null, upstreams: null }))).not.toThrow();
  expect(() => parseSnapshot(withRelease({ contentUri: "javascript:alert(1)" }))).toThrow(/unsupported/);
  expect(() => parseSnapshot(withRelease({ upstreams: [{ repo: 1, version: "1.0.0" }] }))).toThrow(/unsupported/);
});
