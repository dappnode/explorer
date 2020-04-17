import React, { useState, useEffect } from "react";
import ActivityChart from "../ActivityChart";
import SummaryStats from "../SummaryStats";
import SummaryTable from "../SummaryTable";
import { summaryFile, rootUrlFromBrowser } from "../../fetch/params";
import { computeActivity, computeRepoSummary } from "../../fetch/utils";
import { Summary } from "../../fetch/types";
import { urlJoin } from "../../utils/url";
import { AppState } from "../../types";

export function SummaryView({ state }: { state: AppState }) {
  const [cacheSummary, setCacheSummary] = useState<Summary>();

  useEffect(() => {
    fetch(urlJoin(rootUrlFromBrowser, summaryFile))
      .then((res) => res.json())
      .then(setCacheSummary);
  }, []);

  const cacheSummaryBlock = (cacheSummary || {}).fromBlock || 0;
  const stateSummaryBlock = state.fromBlock;
  const summary =
    cacheSummary && cacheSummaryBlock > stateSummaryBlock
      ? cacheSummary
      : computeSummary(state, cacheSummary);

  const { repos = [], activity } = summary || {};
  const packageCount = repos.length;
  const versionCount = repos.reduce(
    (total, repo) => total + repo.versionCount,
    0
  );

  return (
    <>
      <ActivityChart activity={activity} />
      <SummaryStats packageCount={packageCount} versionCount={versionCount} />
      <SummaryTable repoSummary={repos} />
    </>
  );
}

function computeSummary(state: AppState, cacheSummary?: Summary): Summary {
  const allRepos = Object.values(state.repos);

  // Copy avatars from cached summary to state summary
  const avatars = ((cacheSummary || {}).repos || []).reduce(
    (_avatars, repo) => {
      _avatars[repo.registry + repo.name] = repo.logo || null;
      return _avatars;
    },
    {} as { [registryRepo: string]: string | null }
  );
  const repos = computeRepoSummary(allRepos).map((repo) => ({
    ...repo,
    logo: repo.logo || avatars[repo.registry + repo.name],
  }));

  return {
    fromBlock: state.fromBlock,
    timestamp: state.timestamp,
    repos,
    activity: computeActivity(allRepos),
  };
}
