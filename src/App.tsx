import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import Header from "./components/Header";
import ActivityChart from "./components/ActivityChart";
import SummaryStats from "./components/SummaryStats";
import SummaryTable from "./components/SummaryTable";
import { RepoView } from "./components/RepoViewer";
import { repoSummaryFile, rootUrlFromBrowser } from "./fetch/params";
import { RepoSummary } from "./fetch/types";
import { RegistryView } from "./components/RegistryViewer";
import { urlJoin } from "./utils/url";

// fetchFromBrowser(new ethers.providers.InfuraProvider());

export default function App() {
  const [repoSummary, setRepoSummary] = useState<RepoSummary[]>([]);
  const ipfsGateway = "https://ipfs.io";

  useEffect(() => {
    fetch(urlJoin(rootUrlFromBrowser, repoSummaryFile))
      .then((res) => res.json())
      .then(setRepoSummary);
  }, []);

  const packageCount = repoSummary.length;
  const versionCount = repoSummary.reduce(
    (total, repo) => total + repo.versionCount,
    0
  );

  const activityData = [
    { month: "Jan", versions: 13, packages: 2 },
    { month: "Feb", versions: 4, packages: 4 },
    { month: "Mar", versions: 20, packages: 0 },
    { month: "Apr", versions: 22, packages: 2 },
    { month: "May", versions: 9, packages: 0 },
    { month: "Jun", versions: 11, packages: 1 },
    { month: "Jul", versions: 14, packages: 0 },
  ];

  return (
    <div className="App">
      <Header />
      <div className="app-body">
        {/* Home */}
        <Route path="/" exact>
          <ActivityChart data={activityData} />
          <SummaryStats
            packageCount={packageCount}
            versionCount={versionCount}
          />
          <SummaryTable ipfsGateway={ipfsGateway} repoSummary={repoSummary} />
        </Route>
        <Route path="/:registry" exact component={RegistryView} />
        <Route path="/:registry/:repo/:version?" component={RepoView} />
      </div>
    </div>
  );
}
