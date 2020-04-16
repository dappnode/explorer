import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import Header from "./components/Header";
import ActivityChart from "./components/ActivityChart";
import SummaryStats from "./components/SummaryStats";
import SummaryTable from "./components/SummaryTable";
import { RepoView } from "./components/RepoViewer";
import {
  repoSummaryFile,
  rootUrlFromBrowser,
  activityFile,
} from "./fetch/params";
import { RepoSummary, Activity } from "./fetch/types";
import { RegistryView } from "./components/RegistryViewer";
import { urlJoin } from "./utils/url";

// fetchFromBrowser(new ethers.providers.InfuraProvider());

export default function App() {
  const [repoSummary, setRepoSummary] = useState<RepoSummary[]>([]);
  const [activity, setActivity] = useState<Activity>();

  useEffect(() => {
    fetch(urlJoin(rootUrlFromBrowser, repoSummaryFile))
      .then((res) => res.json())
      .then(setRepoSummary);

    fetch(urlJoin(rootUrlFromBrowser, activityFile))
      .then((res) => res.json())
      .then(setActivity);
  }, []);

  const packageCount = repoSummary.length;
  const versionCount = repoSummary.reduce(
    (total, repo) => total + repo.versionCount,
    0
  );

  return (
    <div className="App">
      <Header />
      <div className="app-body">
        {/* Home */}
        <Route path="/" exact>
          <ActivityChart activity={activity} />
          <SummaryStats
            packageCount={packageCount}
            versionCount={versionCount}
          />
          <SummaryTable repoSummary={repoSummary} />
        </Route>
        <Route path="/:registry" exact component={RegistryView} />
        <Route path="/:registry/:repo/:version?" component={RepoView} />
      </div>
    </div>
  );
}
