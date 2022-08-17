import React from "react";

interface Settings {
  ipfsGateway: string;
  ipfsApi: string;
  txViewer: string;
}

const SettingsContext = React.createContext<Settings>({
  ipfsGateway: "https://gateway.ipfs.dappnode.io",
  ipfsApi: "https://ipfs.infura.io:5001",
  txViewer: "https://etherscan.io/tx",
});

export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
