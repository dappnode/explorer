import React from "react";
import Container from "../Container";
import "./header.scss";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header_header">
      <Container>
        <Link to="/">
          <h1>
            <span className="dappnode">DAppNode</span>
            <span className="explorer">EXPLORER</span>
          </h1>
        </Link>
      </Container>
    </div>
  );
}
