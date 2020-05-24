import React from "react";
import makeBlockie from "ethereum-blockies-base64";
import { prettyAddress } from "utils/format";
import "./addressDisplay.scss";

export function AddressDisplay({ address }: { address?: string }) {
  return (
    <div className="address-display">
      {address && <img className="blockie" src={makeBlockie(address)} alt="" />}
      <span>{address ? prettyAddress(address) : ""}</span>
    </div>
  );
}
