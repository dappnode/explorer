import React from "react";
import { MdOpenInNew } from "react-icons/md";
import "./externalLink.scss";

export function ExternalLink({ url }: { url: string }) {
  return (
    <a
      className="external-link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MdOpenInNew />
    </a>
  );
}
