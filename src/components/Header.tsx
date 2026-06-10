import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { BrandMark } from "components/BrandMark";
import "./header.scss";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-container app-header__inner">
        <Link to="/" className="brand" aria-label="DAppNode Explorer home">
          <BrandMark className="brand__mark" />
          <span className="brand__text">
            <span className="brand__name">DAppNode</span>
            <span className="brand__sub">Explorer</span>
          </span>
        </Link>

        <nav className="app-header__nav" aria-label="Primary">
          <NavLink exact to="/" className="nav-link">
            Packages
          </NavLink>
          <a
            className="nav-link"
            href="https://github.com/dappnode"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span>GitHub</span>
          </a>
          <a
            className="btn btn-primary btn-sm"
            href="https://dappnode.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            dappnode.io
          </a>
        </nav>
      </div>
    </header>
  );
}
