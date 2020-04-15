import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import Header from "./components/Header";
import ActivityChart from "./components/ActivityChart";
import SummaryStats from "./components/SummaryStats";
import SummaryTable from "./components/SummaryTable";
import { RepoView } from "./components/RepoView";
import { repoSummaryFile, rootUrlFromBrowser } from "./fetch/params";
import "./App.scss";
import { RepoSummary } from "./fetch/types";

// fetchFromBrowser(new ethers.providers.InfuraProvider());

export default function App() {
  const [repoSummary, setRepoSummary] = useState<RepoSummary[]>([]);
  const ipfsGateway = "https://ipfs.io";

  useEffect(() => {
    fetch(`${rootUrlFromBrowser}/${repoSummaryFile}`)
      .then((res) => res.json())
      .then(setRepoSummary);
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
          <ActivityChart />
          <SummaryStats
            packageCount={packageCount}
            versionCount={versionCount}
          />
          <SummaryTable ipfsGateway={ipfsGateway} repoSummary={repoSummary} />
        </Route>
        <Route path="/:registry/:repo" component={RepoView} />
      </div>
    </div>
  );
}
