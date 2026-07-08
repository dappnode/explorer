import React from "react";
import ActivityChart from "components/ActivityChart";
import SummaryStats from "components/SummaryStats";
import SummaryTable from "components/SummaryTable";
import { useActivityQuery } from "generated/graphql";
import { aggregateLast12Months } from "utils/math";

/** Unix timestamp (seconds) for 12 months ago */
function getTimestamp12MonthsAgo(): number {
  const d = new Date();
  d.setMonth(d.getMonth() - 12);
  return Math.floor(d.getTime() / 1000);
}

export function Home() {
  const activityQuery = useActivityQuery({
    variables: { timestampGte: getTimestamp12MonthsAgo() },
  });

  const versions = activityQuery.data?.versions || [];
  const packages = activityQuery.data?.repos || [];
  const activity = {
    versions: aggregateLast12Months(versions),
    packages: aggregateLast12Months(packages),
  };

  return (
    <>
      <ActivityChart activity={activity} />
      <SummaryStats />
      <SummaryTable />
    </>
  );
}
