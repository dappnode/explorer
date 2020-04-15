import React from "react";

interface Settings {
  ipfsGateway: string;
  txViewer: string;
}

const SettingsContext = React.createContext<Settings>({
  ipfsGateway: "https://ipfs.io",
  txViewer: "https://etherscan.io/tx",
});

export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
