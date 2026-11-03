# Explorer dashboard contract, schema 2

The wire types are defined in [dashboard-api-v2.ts](dashboard-api-v2.ts). This document supplies their semantics. Schema 2 replaces schema 1 entirely; the route is unchanged.

## Responsibilities and scope

Tropibot owns discovery, GitHub and GraphQL requests, manifest parsing, release attribution, PR classification, version comparison and caching. It publishes one snapshot; Explorer does not repeat those operations.

The snapshot is repository-first. `repositories` lists every public package repository of the configured organizations (and explicitly configured repositories), including archived ones. Each repository lists the packages its manifests declare, with the on-chain version of each ENS name layered on top. On-chain packages without a manifest in a listed repository are not included. Comparison means **DAppNode package releases**, not upstream software releases.

## HTTP and snapshot lifecycle

- `GET /v1/explorer/dashboard` returns `DashboardSnapshot` as JSON. No authentication or parameters.
- A request reads the published snapshot; it never starts a collection.
- Default refresh is 300 seconds and the freshness limit 1,800 seconds; both are advertised in the payload.
- ETag / If-None-Match with 304, compression, and `Cache-Control: public, max-age=60, stale-while-revalidate=300`. Configured Explorer origins are allowed via CORS, including the Accept and If-None-Match request headers, with ETag exposed.
- 503 with `Retry-After: 30` before the first snapshot. During upstream failures the latest snapshot stays available with problems attached.
- Timestamps are UTC RFC 3339 strings; nullable fields are always present.
- Repositories are sorted by `id`, packages by `id` and pull requests by `number`.
- Additive fields are compatible within schema 2.

## Freshness and problems

`github` describes the repository listing and `onchain` the on-chain catalog scan; each repository also has its own `observedAt` and `problem`.

- `observedAt` is the last complete successful read, or null if there never was one.
- `problem` is the latest failure, or null. When it is set, the data shown is retained from the last success; it is never replaced with empty results.
- Explorer treats data as stale when `problem` is set or `observedAt` is older than `staleAfterSeconds`, and shows a stale badge rather than hiding retained values.
- `issues` lists every problem in one place (source failures, repository failures, unreadable variant manifests, duplicate claims, ambiguous on-chain identities) with a stable `code` and a human-readable `message`.

## Packages and classification

- `id` is the full lowercase ENS name from the manifest, including registry; `public` and `dnp` packages never collide.
- `variant` is the generic variant directory name (it doubles as the network), or null for a plain package.
- `classification.type` and `classification.categories` come from the manifest (variants inherit the root's), unless configuration replaces them. `categories` is `[]` when the manifest declares none.
- `classification.tags` are curated, open, lowercase identifiers from configuration only (e.g. `staking`, `execution`, `mev`); Tropibot never infers them.
- The same ENS name can appear under several repositories, typically an archived former repository and its active successor. Each row has its own release comparison. Explorer hides archived repositories by default and should prefer the non-archived row when it shows one row per package. Several non-archived claimants produce a `duplicate_package` issue.

## Release comparison

`latestRelease` is the greatest semantic version attributed to the package by this repository's published GitHub releases, including prereleases and excluding drafts. Ordinary tags (`v1.2.3`) belong to a repository's only package; composite tags (`hoodi@v0.1.5_mainnet@v1.2.17`) attribute each version to the variant's package. Equal versions prefer the newest publication, then the highest release ID. `version` is normalized without a leading `v`; `tag` is the source tag.

`onchain` is the subgraph's latest version for the ENS name, or null when the name has no published version or cannot be resolved.

| releaseStatus | Rule |
| --- | --- |
| `release_available` | The GitHub release version is greater than the on-chain version. |
| `current` | Both versions are equal. |
| `onchain_ahead` | The on-chain version is greater than the newest GitHub release. |
| `unpublished` | A GitHub release exists and the on-chain catalog has no published version. |
| `no_release` | The release listing has no attributable release. |
| `unknown` | Releases or the on-chain catalog were never read, the ENS name is ambiguous on-chain, or a version cannot be compared. |

A status computed from retained data stays as computed; staleness is signalled by `problem` / `observedAt`.

## Pull requests

Every open PR, including drafts and all authors, is listed once under its repository. Known bump labels, trusted bump branch conventions on same-repository heads, or structured same-repository metadata classify `bump`; labels or metadata may classify `other`. Author or title alone never classifies; everything else is `unknown` and appears in the UI's other-PR indicator.

`packageIds = null` means repository-level scope, not proof that every package is affected. A non-empty list names only packages of that repository. Explorer shows repository-level PRs once on the repository header. Global PR counts deduplicate by PR `id`.

## Dashboard behavior and date filters

Explorer owns filtering and sorting and persists filter state in the dashboard URL. Both views use the same filtered set:

- **Table** (default): one row per package, with variant, on-chain version/date, GitHub release version/date, status and linked PR indicators.
- **Matrix**: one row per repository, with variant columns. Plain packages have a Default column.
- Filters: search, type, category, tag, variant, release status, bump PRs, other PRs, archived state and date range. Category and tag filters offer an "unclassified" choice for empty lists.
- Summary cards: filtered package count, releases available, unpublished packages, unique bump PRs, unique other/unclassified PRs and issues. State when counts include stale data.

The date selector offers **Last activity** (default), **On-chain publication** and **GitHub release**. `lastActivityAt` is the maximum of the on-chain publication, the latest release publication, and the `updatedAt` of the repository's open PRs that apply to the package (repository-level PRs, or PRs whose `packageIds` include it). Collection times never count as activity.

The default range is All time. A range filters the selected timestamp, inclusive start and exclusive end in UTC; Explorer converts local calendar days to UTC instants, and a through-date includes that whole local day. Null dates are excluded only while a range is active.

This is a current-state dashboard, not a history: a past range selects packages whose current timestamp falls in it; it does not reconstruct earlier releases, PR states or deployments.
