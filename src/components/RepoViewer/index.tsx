import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, useHistory, Link } from "react-router-dom";
import { sortBy } from "lodash";
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

export const RepoView: React.FC<
  { repoData?: LocalRepo } & RouteComponentProps<{
    registry: string;
    repo: string;
    version: string;
  }>
> = ({ repoData, match }) => {
  const [isAvailable, setIsAvailable] = useState<VersionAvailable>({});
  const [analyze, setAnalyze] = useState(false);

  const history = useHistory();
  const { ipfsGateway, ipfsApi, txViewer } = useContext(SettingsContext);

  const { registry, repo, version } = match.params;

  useEffect(() => {
    async function checkVersionAvailability() {
      if (repoData) {
        for (const _version of repoData.versions) {
          const available = await isVersionAvailable(_version, { ipfsApi });
          setIsAvailable((x) => ({ ...x, [_version.version]: available }));
        }
      }
    }
    if (analyze) checkVersionAvailability();
  }, [ipfsApi, repoData, analyze]);

  function selectVersion(_version: string) {
    history.push(`/${registry}/${repo}/${_version}`);
  }

  if (!repoData) return <p className="soft">Loading...</p>;

  // Alias
  const versions = sortBy(
    Array.isArray(repoData.versions) ? repoData.versions : [],
    (v) => v.versionId
  ).reverse();

  // Add another "Creation" version if the creation tx is different
  const firstVersion = versions[versions.length - 1];
  if (firstVersion.txHash && repoData.creation.txHash !== firstVersion.txHash) {
    versions.push({
      version: "Creation",
      versionId: -1,
      contentUri: "",
      ...repoData.creation,
    });
  }

  const latestVersion = versions[0];
  const versionDisplay =
    versions.find((v) => v.version === version) || latestVersion;
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
          {versions.map(
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
