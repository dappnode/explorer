import React, { useContext } from "react";
import { NewVersion } from "../../fetch/apm";
import SettingsContext from "../../settingsContext";
import { joinIpfsLocation } from "../../utils/url";
import "./versionDisplay.scss";

export default function VersionDisplay({
  version,
  isLatest,
}: {
  version: NewVersion;
  isLatest: boolean;
}) {
  const { ipfsGateway } = useContext(SettingsContext);
  const { contentUri } = version;

  return (
    <div className="version-display">
      <div className="header">
        <div className="title">
          {version.version} {isLatest ? "(latest)" : ""}
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
