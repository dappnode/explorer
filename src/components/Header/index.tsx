import React from "react";
import Container from "../Container";
import "./header.scss";

export default function Header() {
  return (
    <div className="header_header">
      <Container>
        <h1>
          <span className="dappnode">DAppNode</span>
          <span className="explorer">EXPLORER</span>
        </h1>
      </Container>
    </div>
  );
}
