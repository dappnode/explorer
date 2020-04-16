import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, useHistory, Link } from "react-router-dom";
import { sortBy } from "lodash";
import { rootUrlFromBrowser, getRepoFile } from "../../fetch/params";
import { LocalRepo } from "../../fetch/types";
import SettingsContext from "../../settingsContext";
import { prettyName } from "../../utils/format";
import { isVersionAvailable } from "./utils";
import {
  StatusBubble,
  TimeDisplay,
  ExternalLink,
  AddressDisplay,
} from "../Generic";
import "./repoViewer.scss";
import VersionDisplay from "./VersionDisplay";
import { urlJoin, joinIpfsLocation } from "../../utils/url";

interface VersionAvailable {
  [version: string]: boolean;
}

export const RepoView: React.FC<RouteComponentProps<{
  registry: string;
  repo: string;
  version: string;
}>> = ({ match }) => {
  const [repoData, setRepoData] = useState<LocalRepo>();
  const [isAvailable, setIsAvailable] = useState<VersionAvailable>({});
  const [analyze, setAnalyze] = useState(false);

  const history = useHistory();
  const { ipfsGateway, txViewer } = useContext(SettingsContext);

  const { registry, repo, version } = match.params;

  useEffect(() => {
    const filepath = getRepoFile(registry, repo);
    fetch(urlJoin(rootUrlFromBrowser, filepath))
      .then((res) => res.json())
      .then(setRepoData);
  }, [registry, repo]);

  useEffect(() => {
    async function checkVersionAvailability() {
      if (repoData) {
        const versions = sortBy(
          repoData.versions,
          (version) => version.versionId
        ).reverse();
        for (const _version of versions) {
          const available = await isVersionAvailable(_version, ipfsGateway);
          setIsAvailable((x) => ({ ...x, [_version.version]: available }));
        }
      }
    }
    if (analyze) checkVersionAvailability();
  }, [ipfsGateway, repoData, analyze]);

  function selectVersion(_version: string) {
    history.push(`/${registry}/${repo}/${_version}`);
  }

  if (!repoData) return <p className="soft">Loading...</p>;

  const sortedVersions = sortBy(
    repoData.versions,
    (version) => version.versionId
  ).reverse();

  // Add another "Creation" version if the creation tx is different
  const firstVersion = sortedVersions[sortedVersions.length - 1];
  if (firstVersion.txHash && repoData.creation.txHash !== firstVersion.txHash) {
    sortedVersions.push({
      version: "Creation",
      versionId: -1,
      contentUri: "",
      ...repoData.creation,
    });
  }

  const latestVersion = sortedVersions[0];
  const versionDisplay =
    sortedVersions.find((v) => v.version === version) || latestVersion;
  const isLatest = versionDisplay.versionId === latestVersion.versionId;

  return (
    <>
      <div>
        <div className="repo-name">{prettyName(match.params.repo)}</div>
        <Link to={`/${registry}`}>
          <div className="registry">{match.params.registry}</div>
        </Link>
      </div>

      <VersionDisplay version={versionDisplay} isLatest={isLatest} />

      <table className="summary-table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Age</th>
            <th onClick={() => setAnalyze(true)}>Content</th>
            <th>From</th>
            <th>Txn</th>
          </tr>
        </thead>
        <tbody>
          {sortedVersions.map(
            ({ version, contentUri, txHash, timestamp, sender }) => (
              <tr key={version} onClick={() => selectVersion(version)}>
                <td>{version}</td>
                <td>
                  <TimeDisplay timestamp={timestamp} />
                </td>
                <td className="content">
                  {analyze && <StatusBubble ok={isAvailable[version]} />}
                  {contentUri && (
                    <ExternalLink
                      url={joinIpfsLocation(ipfsGateway, contentUri)}
                    />
                  )}
                </td>
                <td>
                  <AddressDisplay address={sender} />
                </td>
                <td className="txn">
                  {txHash && <ExternalLink url={urlJoin(txViewer, txHash)} />}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
};
