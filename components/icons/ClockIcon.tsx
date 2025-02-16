import React from "react";

interface IconProps {
  className?: string;
  stroke?: string;
}

export default function ClockIcon({
  className = "h-6 w-6",
  stroke = "currentColor",
}: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={stroke}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
