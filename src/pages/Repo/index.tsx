import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { sortBy } from "lodash";
import SettingsContext from "settingsContext";
import { prettyName, semanticVersionDots } from "utils/format";
import { urlJoin, joinIpfsLocation } from "utils/url";
import { isVersionAvailable } from "utils/isVersionAvailable";
import { StatusBubble } from "components/StatusBubble";
import { TimeDisplay } from "components/TimeDisplay";
import { ExternalLink } from "components/ExternalLink";
import { AddressDisplay } from "components/AddressDisplay";
import { VersionDisplay } from "components/VersionDisplay";
import { useRepoQuery } from "generated/graphql";
import "./repoViewer.scss";

interface VersionAvailable {
  [version: string]: boolean;
}

export const Repo: React.FC<RouteComponentProps<{
  repoId: string;
  versionId: string;
}>> = ({ match }) => {
  const [isAvailable, setIsAvailable] = useState<VersionAvailable>({});
  const [analyze, setAnalyze] = useState(false);

  const history = useHistory();
  const { ipfsGateway, ipfsApi, txViewer } = useContext(SettingsContext);

  const { repoId, versionId } = match.params;
  const repoQuery = useRepoQuery({ variables: { id: repoId } });
  const repoData = repoQuery.data?.repo;

  useEffect(() => {
    async function checkVersionAvailability() {
      if (repoData && repoData.versions) {
        for (const _version of repoData.versions) {
          const available = await isVersionAvailable(_version, { ipfsApi });
          setIsAvailable((x) => ({
            ...x,
            [_version.semanticVersion]: available,
          }));
        }
      }
    }
    if (analyze) checkVersionAvailability();
  }, [ipfsApi, repoData, analyze]);

  function selectVersion(_version: string) {
    history.push(`/repo/${repoId}/${_version}`);
  }

  if (repoQuery.data && repoData) {
    // Alias
    const versions = sortBy(repoData.versions || [], (version) => version.index)
      .map((version) => ({
        ...version,
        // TheGraph sends the version concatenated by comma ","
        semanticVersion: semanticVersionDots(version.semanticVersion),
      }))
      .reverse();

    // Add another "Creation" version if the creation tx is different
    const firstVersion = versions[versions.length - 1];
    if (firstVersion.txHash && repoData.txHash !== firstVersion.txHash) {
      versions.push({
        semanticVersion: "Creation",
        index: -1,
        contentUri: "",
        timestamp: repoData.timestamp,
        txHash: repoData.txHash,
        sender: repoData.sender,
      });
    }

    const latestVersionIndex = repoData.lastVersion?.index;
    const versionDisplay =
      versions.find((v) => v.semanticVersion === versionId) ||
      versions[0] ||
      undefined;
    const isLatest =
      versionDisplay && versionDisplay.index === latestVersionIndex;

    return (
      <>
        <div>
          <div className="repo-name">{prettyName(repoData.name)}</div>
          <div className="registry">{repoData.registryName}</div>
        </div>

        {versionDisplay && (
          <VersionDisplay version={versionDisplay} isLatest={isLatest} />
        )}

        <div className="table-container">
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
                ({
                  semanticVersion,
                  contentUri,
                  timestamp,
                  txHash,
                  sender,
                }) => (
                  <tr
                    key={semanticVersion}
                    onClick={() => selectVersion(semanticVersion)}
                  >
                    <td>{semanticVersion}</td>
                    <td>
                      <TimeDisplay timestamp={timestamp} />
                    </td>
                    <td className="content">
                      {analyze && (
                        <StatusBubble ok={isAvailable[semanticVersion]} />
                      )}
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
                      {txHash && (
                        <ExternalLink url={urlJoin(txViewer, txHash)} />
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (repoQuery.error) return <div>{repoQuery.error.message}</div>;
  if (repoQuery.loading) return <div>Loading...</div>;
  return null;
};
