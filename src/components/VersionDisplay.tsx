import React, { useContext } from "react";
import { ApmVersion } from "types";
import SettingsContext from "settingsContext";
import { joinIpfsLocation } from "utils/url";
import "./versionDisplay.scss";

export function VersionDisplay({
  version,
  isLatest,
}: {
  version: ApmVersion;
  isLatest: boolean;
}) {
  const { ipfsGateway } = useContext(SettingsContext);
  const { contentUri } = version;

  return (
    <div className="version-display">
      <div className="header">
        <div className="title">
          {version.semanticVersion} {isLatest ? "(latest)" : ""}
        </div>
        <div className="contentUri">{contentUri}</div>
      </div>
      <iframe
        className="content-preview"
        name="version-content"
        id="version-content"
        title="version-content"
        src={joinIpfsLocation(ipfsGateway, contentUri)}
        frameBorder={0}
      ></iframe>
    </div>
  );
}
