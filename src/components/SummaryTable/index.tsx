import React from "react";
import { useHistory } from "react-router-dom";
import { prettyName } from "../../utils/format";
import { RepoSummary } from "../../fetch/types";
import { sortBy } from "lodash";
import { TimeDisplay } from "../Generic/TimeDisplay";
import "./summary-table.scss";
import { urlJoin } from "../../utils/url";
import { rootUrlFromBrowser } from "../../fetch/params";

export default function SummaryTable({
  repoSummary,
}: {
  repoSummary: RepoSummary[];
}) {
  const history = useHistory();
  function goToRepoView(registry: string, repo: string) {
    history.push(`/${registry}/${repo}`);
  }

  return (
    <div className="table-container">
      <table className="summary-table">
        <thead>
          <tr>
            <th className="logo"></th>
            <th>Name</th>
            <th>Last updated</th>
            <th>Last version</th>
            <th className="registry">Registry</th>
          </tr>
        </thead>
        <tbody>
          {sortBy(repoSummary, (repo) => repo.timestamp || 0)
            .reverse()
            .map(
              ({ name, registry, versionCount, version, timestamp, logo }) => (
                <tr
                  key={name + registry}
                  onClick={() => goToRepoView(registry, name)}
                >
                  <td className="logo">
                    {logo && (
                      <img src={urlJoin(rootUrlFromBrowser, logo)} alt="logo" />
                    )}
                  </td>
                  <td>
                    <div>{prettyName(name)}</div>
                    <div className="registry-under-name">
                      <RegistryDisplay registry={registry} small />
                    </div>
                  </td>
                  <td>
                    <TimeDisplay timestamp={timestamp} />
                  </td>
                  <td>
                    <div>{version || "-"}</div>
                    <div className="light">{versionCount}</div>{" "}
                  </td>
                  <td className="registry">
                    <RegistryDisplay registry={registry} />
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

function prettyRegistry(registry: string) {
  return registry === "dnp.dappnode.eth"
    ? "dnp"
    : registry === "public.dappnode.eth"
    ? "public"
    : undefined;
}

/**
 * Display registry as a colored pill by name
 */
function RegistryDisplay({
  registry,
  small,
}: {
  registry: string;
  small?: boolean;
}) {
  const shortName = prettyRegistry(registry);
  return (
    <div className={`registry-badge ${small ? "small" : ""}`}>
      <span className={shortName}>{shortName || registry}</span>
    </div>
  );
}
