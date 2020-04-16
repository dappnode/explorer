import React from "react";
import { prettyAddress } from "../RepoViewer/utils";
import makeBlockie from "ethereum-blockies-base64";
import "./addressDisplay.scss";

export function AddressDisplay({ address }: { address?: string }) {
  return (
    <div className="address-display">
      {address && <img className="blockie" src={makeBlockie(address)} alt="" />}
      <span>{address ? prettyAddress(address) : ""}</span>
    </div>
  );
}
