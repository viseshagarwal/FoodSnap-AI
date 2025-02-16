import React from "react";

interface IconProps {
  className?: string;
  stroke?: string;
}

export default function ProteinIcon({
  className = "h-6 w-6",
  stroke = "currentColor",
}: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}
