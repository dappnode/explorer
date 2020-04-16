import React from "react";
import { prettyAddress } from "../RepoViewer/utils";

export function AddressDisplay({ address }: { address?: string }) {
  return <div>{address ? prettyAddress(address) : ""}</div>;
}
