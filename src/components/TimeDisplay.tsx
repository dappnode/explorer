import React from "react";
import moment from "moment";

/**
 * Display last time an event happened nicely
 */
export function TimeDisplay({ timestamp }: { timestamp?: number }) {
  if (!timestamp) return <div>-</div>;
  const time = moment(timestamp * 1000);
  return (
    <>
      <div>{time.calendar()}</div>
      <div className="light">{time.fromNow()}</div>
    </>
  );
}
