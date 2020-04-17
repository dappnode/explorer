import React, { useContext } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { sortBy } from "lodash";
import SettingsContext from "../../settingsContext";
import { LocalRegistry } from "../../fetch/types";
import { prettyName } from "../../utils/format";
import { TimeDisplay, AddressDisplay, ExternalLink } from "../Generic";

export const RegistryView: React.FC<
  { registryData?: LocalRegistry } & RouteComponentProps<{
    registry: string;
  }>
> = ({ registryData, match }) => {
  const history = useHistory();
  const { txViewer } = useContext(SettingsContext);
  const { registry } = match.params;

  function goToRepoView(repo: string) {
    history.push(`/${registry}/${repo}`);
  }

  if (!registryData) return <p className="soft">Loading...</p>;

  // Alias
  const repos = sortBy(
    Array.isArray(registryData.repos) ? registryData.repos : [],
    (r) => r.blockNumber || 0
  ).reverse();
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
