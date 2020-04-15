import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./summary-table.scss";
import { prettyName } from "../../utils/format";
import { RepoSummary } from "../../fetch/types";
import { sortBy } from "lodash";
import defaultLogo from "./defaultAvatarWhite.png";
import { TimeDisplay } from "../TimeDisplay";

export default function SummaryTable({
  repoSummary,
  ipfsGateway,
}: {
  ipfsGateway: string;
  repoSummary: RepoSummary[];
}) {
  const history = useHistory();

  function goToRepoView(registry: string, repo: string) {
    history.push(`/${registry}/${repo}`);
  }

  return (
    <table className="summary-table">
      <thead>
        <tr>
          <th className="logo"></th>
          <th>Name</th>
          <th>Last updated</th>
          <th>Last version</th>
          <th>Registry</th>
        </tr>
      </thead>
      <tbody>
        {sortBy(repoSummary, (repo) => (repo.latest || {}).timestamp || 0)
          .reverse()
          .map(({ name, registry, versionCount, latest }) => (
            <tr
              key={name + registry}
              onClick={() => goToRepoView(registry, name)}
            >
              <td className="logo">
                {latest && (
                  <LogoFallback
                    url={`${ipfsGateway}/${latest.contentUri}/avatar.png`}
                  />
                )}
              </td>
              <td>{prettyName(name)}</td>
              <td>
                <TimeDisplay timestamp={latest?.timestamp} />
              </td>
              <td>
                <div>{latest?.version}</div>
                <div className="light">{versionCount}</div>{" "}
              </td>
              <td>
                <RegistryDisplay registry={registry} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

/**
 * Hide broken image if logo not available
 * @param param0
 */
function LogoFallback({ url }: { url: string }) {
  const [src, setSrc] = useState(url);
  function onError() {
    setSrc(defaultLogo);
  }
  return <img src={src} onError={onError} alt="logo" />;
}

/**
 * Display registry as a colored pill by name
 */
function RegistryDisplay({ registry }: { registry: string }) {
  const shortName =
    registry === "dnp.dappnode.eth"
      ? "dnp"
      : registry === "public.dappnode.eth"
      ? "public"
      : undefined;
  return (
    <div className="registry">
      <span className={shortName}>{shortName || registry}</span>
    </div>
  );
}
