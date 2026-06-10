import React from "react";

/**
 * DAppNode mark — a stylized "D" with a teal pulse.
 * Inline SVG so it picks up currentColor and ships with the bundle.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5ad6cd" />
          <stop offset="100%" stopColor="#2fbcb2" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        fill="url(#bm-grad)"
        opacity="0.18"
      />
      <path
        d="M11 8 H19 a6 6 0 0 1 0 12 H11 Z M11 14 H19"
        fill="none"
        stroke="url(#bm-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="22" r="2.2" fill="#2fbcb2" />
    </svg>
  );
}
