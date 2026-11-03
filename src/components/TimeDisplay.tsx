import React from "react";
import moment from "moment";

/**
 * Display last time an event happened nicely
 */
export function TimeDisplay({ timestamp }: { timestamp?: number | string }) {
  if (!timestamp) return <div>-</div>;
  const time = moment(Number(timestamp) * 1000);
  return (
    <>
      <div>{time.calendar()}</div>
      <div className="light">{time.fromNow()}</div>
    </>
  );
}
