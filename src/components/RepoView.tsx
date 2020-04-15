import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { sortBy } from "lodash";
import { rootUrlFromBrowser, getRepoFile } from "../fetch/params";
import { LocalRepo } from "../fetch/types";
import { TimeDisplay } from "./TimeDisplay";
import { MdOpenInNew } from "react-icons/md";
import SettingsContext from "../settingsContext";
import "./repoViewer.scss";
import { prettyName } from "../utils/format";

const txViewer = "https://etherscan.io/tx";

export const RepoView: React.FC<RouteComponentProps<{
  registry: string;
  repo: string;
}>> = ({ match }) => {
  const [repoData, setRepoData] = useState<LocalRepo>();

  const settings = useContext(SettingsContext);

  const { registry, repo } = match.params;
  const filepath = getRepoFile(registry, repo);
  useEffect(() => {
    fetch(`${rootUrlFromBrowser}/${filepath}`)
      .then((res) => res.json())
      .then(setRepoData);
  }, [filepath]);

  if (!repoData) return <p>No repo data</p>;

  const latestVersion = sortBy(
    repoData.versions,
    (version) => version.versionId
  ).reverse()[0];

  return (
    <div>
      <div className="repo-name">{prettyName(match.params.repo)}</div>
      <div className="registry">{match.params.registry}</div>

      {latestVersion ? (
        <iframe
          className="content-preview"
          title="Content"
          src={`${settings.ipfsGateway}/${latestVersion.contentUri}`}
        ></iframe>
      ) : null}

      <table className="summary-table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Age</th>
            <th>Content</th>
            <th>From</th>
            <th>Txn</th>
          </tr>
        </thead>
        <tbody>
          {sortBy(repoData.versions, (v) => v.versionId)
            .reverse()
            .map(({ version, contentUri, txHash, timestamp, sender }) => (
              <tr key={version}>
                <td>{version}</td>
                <td>
                  <TimeDisplay timestamp={timestamp} />
                </td>
                <td>
                  <a href={contentUri}>content</a>
                </td>
                <td>{sender ? prettyAddress(sender) : ""}</td>
                <td className="txn">
                  <a href={`${txViewer}/${txHash}`}>
                    <MdOpenInNew />
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

function prettyAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
