import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SettingsContext from "settingsContext";
import { prettyName, semanticVersionDots } from "utils/format";
import { urlJoin } from "utils/url";
import { TimeDisplay } from "components/TimeDisplay";
import { useReposQuery } from "generated/graphql";
import "./summary-table.scss";

const showInterval = 20;

export default function SummaryTable() {
  const [showIndex, setShowIndex] = useState(showInterval);
  const history = useHistory();
  const { ipfsGateway } = useContext(SettingsContext);
  const reposSummary = useReposQuery();

  // Detect bottom scroll event
  useEffect(() => {
    function onScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop >
        document.documentElement.offsetHeight * 0.99
      )
        setShowIndex((x) => x + showInterval);
    }
    if (reposSummary.data && reposSummary.data.repos.length > showIndex)
      document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [showIndex, reposSummary.data]);

  if (reposSummary.data) {
    const { repos } = reposSummary.data;
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
            {repos
              .sort(
                (a, b) =>
                  (b.lastVersion?.timestamp || 0) -
                  (a.lastVersion?.timestamp || 0)
              )
              .slice(0, showIndex)
              .map(({ id, name, registryName, versionCount, lastVersion }) => (
                <tr key={id} onClick={() => history.push(`/repo/${id}`)}>
                  <td className="logo">
                    {lastVersion && (
                      <img
                        src={urlJoin(
                          ipfsGateway,
                          lastVersion.contentUri,
                          "avatar.png"
                        )}
                        alt="logo"
                      />
                    )}{" "}
                  </td>
                  <td>
                    <div className="name-cell">
                      <span className="name">{prettyName(name)}</span>
                      <div className="registry-under-name">
                        <RegistryDisplay registry={registryName} small />
                      </div>
                    </div>
                  </td>
                  <td>
                    <TimeDisplay timestamp={lastVersion?.timestamp} />
                  </td>
                  <td>
                    {lastVersion ? (
                      <>
                        <div>
                          {semanticVersionDots(lastVersion.semanticVersion)}
                        </div>
                        <div className="light">{versionCount}</div>
                      </>
                    ) : (
                      <div>-</div>
                    )}
                  </td>
                  <td className="registry">
                    <RegistryDisplay registry={registryName} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reposSummary.error) return <div>{reposSummary.error.message}</div>;
  if (reposSummary.loading) return <div>Loading...</div>;
  return null;
}

function prettyRegistry(registry: string) {
  const r = registry.toLowerCase();
  if (r.includes("dnp.dappnode")) return "dnp";
  if (r.includes("public.dappnode")) return "public";
  if (r.includes("dappnode")) return "dappnode";
  return undefined;
}

/**
 * Display registry as a colored pill by name.
 * The modifier class goes on the wrapper so the dot + chip colors apply.
 */
function RegistryDisplay({
  registry,
  small,
}: {
  registry: string;
  small?: boolean;
}) {
  const shortName = prettyRegistry(registry);
  const variant = shortName || "other";
  const classes = ["registry-badge", variant, small ? "small" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes}>
      <span>{shortName || registry}</span>
    </div>
  );
}
