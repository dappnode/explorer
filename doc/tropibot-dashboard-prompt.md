Implement a read-only Explorer dashboard data service in Tropibot.

The Explorer will get a separate /#/dashboard page; its existing home remains
the default. Scope is ALL public DAppNode packages, with generic network variants,
staking/non-staking filters, date filters, release status, and open PR indicators.
Compare DAppNode package releases against on-chain package versions, NOT upstream
client releases. Do not implement the Explorer UI in this task.

Use these files from the sibling Explorer checkout as the authoritative contract:

- ../explorer/doc/dashboard-api-v1.ts (exact wire types)
- ../explorer/doc/dashboard-contract.md (required behavior and semantics)

Read both before coding. Copy the agreed contract into Tropibot's documentation
for future maintenance. If the checkouts are elsewhere, locate the Explorer
checkout; do not invent a different response shape.

Deliver GET /v1/explorer/dashboard as a cached, joined JSON snapshot of GitHub
and GraphQL data. Tropibot owns package discovery, mapping, variant parsing,
release comparison, PR classification, freshness, and partial failures. Explorer
only renders and filters this response. Use schemaVersion 1 and the documented
stable IDs, explicit nullable fields, timestamps, and observation states.

Implementation requirements:

1. Follow repository instructions and inspect existing scheduler, GitHub client,
   GraphQL client, generic variant discovery, onchain_sync parsing, and storage
   patterns. Reuse read-only helpers; do not call mutation-oriented release-sync
   or bump execution paths from the collector.
2. Add a separately configurable dashboard collector: enabled flag, public GitHub
   organizations/repository discovery patterns, explicit package/repository and
   classification overrides, refresh interval (default 300s), stale threshold
   (default 1800s), cache storage, and allowed Explorer CORS origins. Reuse existing
   server-side GitHub and GraphQL credentials without exposing them.
3. Build the catalog as a union of ALL GraphQL packages and public package
   manifests. Include archived/on-chain-only/GitHub-only/unmapped/unclassified
   packages. Paginate fully; no recently-updated repo cap or fixed staking list.
   Use full ENS names including registry. Resolve current/former repositories,
   generic variants, legacy manifests, and variant overrides. Flag ambiguity.
4. Backfill release history, then cache and reconcile incrementally. Include
   published prereleases; exclude drafts. Parse composite variant tags and
   ordinary tags. Use release-pinned manifests/assets when needed. Choose the
   greatest package semantic version per concrete package; break equal-version
   ties as documented. A default-branch version is not a release. Do not reuse
   release-sync's 20-release/120-day/recent-repo bounds for this catalog.
5. Query on-chain state in batches with full pagination and registry-aware
   identity. Compute the documented releaseStatus values. Missing sources,
   malformed relevant metadata, and incomplete scans must not produce a false
   current/no-release result. Preserve onchain_ahead as an explicit state.
6. Fetch all open PRs, including drafts/all authors, once per repository. Classify
   proven bump labels/branches/metadata; do not classify every bot PR as a bump
   or trust title-only guesses. Include other/unknown PRs. Preserve repository
   scope unless package scope is reliably known.
7. Compute lastActivityAt exactly as documented from source event timestamps,
   including applicable open PR activity. Return current snapshot data; do not
   add a historical activity database or implement server-side UI filters.
8. Publish snapshots atomically, persist last successful observations across
   restarts, retain values on upstream errors, and report partial catalog scans.
   Bound request concurrency, handle rate limits/backoff, and avoid overlapping
   collector runs. GET must never fan out into upstream requests.
9. Implement CORS, ETag/304, compression, cache headers, and pre-warmup 503 per
   contract. Publish public metadata only; sanitize errors and exclude secrets
   and private repository metadata. Add useful collection/freshness metrics.

Acceptance checks:

- Normal package + generic variants with different names, registries, versions.
- A newly discovered network variant without a code change.
- Same ENS package migrating from a standalone repo into a generic repo.
- On-chain-only, unpublished, archived, unmapped, unclassified, and no-release
  packages remain represented.
- Newer prerelease, equal variant version repeated in a newer composite tag,
  onchain_ahead, comma-separated GraphQL versions, and 0.1.10 vs 0.1.9.
- An old/quiet package whose relevant release is beyond page one or 120 days.
- Mixed bump/non-bump/unknown PRs, drafts, scoped PRs, repository-wide PRs, and
  identical PR references across package rows without duplicate global PRs.
- Source timestamps drive dates; polling never changes lastActivityAt by itself.
- GitHub/GraphQL errors, throttling, malformed releases, incomplete pagination,
  stale cached values, failed discovery, and restart recovery.
- Empty successful sources differ from errors; failures never become zero PRs
  or a fresh current status. HTTP request handling uses only cached data.
- Fixture-based contract serialization tests, HTTP/ETag/CORS behavior, and an
  opt-in read-only smoke check against real GitHub/GraphQL data.

Run relevant tests, formatting, and substantive Clippy checks. Document setup,
configuration, override examples, the endpoint, and a representative response.
Report what was implemented, validation, and any remaining limitations. Do not
commit, push, deploy, or mutate GitHub releases/PRs as part of this task.
