import React from "react";
import "./header.scss";
import { Link } from "react-router-dom";
import { FetchStatus } from "../../types";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import moment from "moment";

export default function Header({
  fetchStatus,
  timestamp,
  blockNumber,
}: {
  fetchStatus: FetchStatus;
  timestamp?: number;
  blockNumber: number;
}) {
  return (
    <div className="app-header">
      <div className="app-container">
        <Link to="/">
          <h1>
            <span className="dappnode">DAppNode</span>
            <span className="explorer">EXPLORER</span>
          </h1>
        </Link>

        {fetchStatus.loading ? (
          <div className="status loading">
            <FaSpinner className="spinner" />
            <span>Loading</span>
          </div>
        ) : fetchStatus.success ? (
          <div className="status success">
            <div className="title">
              <FaCheckCircle />
              <span>{blockNumber}</span>
            </div>
            <div className="message">
              {timestamp && moment(timestamp * 1000).fromNow()}
            </div>
          </div>
        ) : fetchStatus.error ? (
          <div className="status error">
            <div className="title">
              <FaTimesCircle />
              <span>Error</span>
            </div>
            <div className="message">{fetchStatus.error}</div>
          </div>
        ) : (
          <div>-</div>
        )}
      </div>
    </div>
  );
}
