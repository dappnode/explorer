import React from "react";
import { Link } from "react-router-dom";
import "./header.scss";

export default function Header() {
  return (
    <div className="app-header">
      <div className="app-container">
        <Link to="/">
          <h1>
            <span className="dappnode">DAppNode</span>
            <span className="explorer">EXPLORER</span>
          </h1>
        </Link>
      </div>
    </div>
  );
}
