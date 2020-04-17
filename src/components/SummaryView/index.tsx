import React from "react";
import ActivityChart from "../ActivityChart";
import SummaryStats from "../SummaryStats";
import SummaryTable from "../SummaryTable";
import { Summary } from "../../fetch/types";

export function SummaryView({ summary }: { summary: Summary }) {
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
