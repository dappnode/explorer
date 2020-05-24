import React from "react";
import ActivityChart from "components/ActivityChart";
import SummaryStats from "components/SummaryStats";
import SummaryTable from "components/SummaryTable";
import { useActivityQuery } from "generated/graphql";
import { aggregateLast12Months } from "utils/math";

export function Home() {
  const activityQuery = useActivityQuery();

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
