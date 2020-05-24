import React from "react";
import { FaCircle } from "react-icons/fa";
import "./statusBubble.scss";

export function StatusBubble({ ok }: { ok?: boolean }) {
  const status = ok === true ? "ok" : ok === false ? "nok" : "";
  return (
    <span className={`status-bubble ${status}`}>
      <FaCircle />
    </span>
  );
}
