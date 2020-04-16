import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { sortBy } from "lodash";
import SettingsContext from "../../settingsContext";
import { getRegistryFile, rootUrlFromBrowser } from "../../fetch/params";
import { LocalRegistry } from "../../fetch/types";
import { prettyName } from "../../utils/format";
import { TimeDisplay, AddressDisplay, ExternalLink } from "../Generic";
import { urlJoin } from "../../utils/url";

export const RegistryView: React.FC<RouteComponentProps<{
  registry: string;
}>> = ({ match }) => {
  const [registryData, setRegistryData] = useState<LocalRegistry>();

  const history = useHistory();
  const { txViewer } = useContext(SettingsContext);
  const { registry } = match.params;

  useEffect(() => {
    const filepath = getRegistryFile(registry);
    fetch(urlJoin(rootUrlFromBrowser, filepath))
      .then((res) => res.json())
      .then((_data: LocalRegistry) => {
        // Sanitize data, and sort versions
        if (!_data) return;
        // Sort repos
        _data.repos = sortBy(
          Array.isArray(_data.repos) ? _data.repos : [],
          (r) => r.blockNumber || 0
        ).reverse();
        setRegistryData(_data);
      });
  }, [registry]);

  function goToRepoView(repo: string) {
    history.push(`/${registry}/${repo}`);
  }

  if (!registryData) return <p className="soft">Loading...</p>;

  // Alias
  const repos = registryData.repos;

  return (
    <>
      <div className="repo-name">{registry}</div>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Owner</th>
            <th>Txn</th>
          </tr>
        </thead>
        <tbody>
          {repos.map(({ name, timestamp, sender, txHash }) => (
            <tr key={name} onClick={() => goToRepoView(name)}>
              <td>{prettyName(name)}</td>
              <td>
                <TimeDisplay timestamp={timestamp} />
              </td>
              <td>
                <AddressDisplay address={sender} />
              </td>
              <td>
                <ExternalLink url={`${txViewer}/${txHash}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
