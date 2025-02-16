import React from "react";

interface IconProps {
  className?: string;
}

export default function CaloriesIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L3 7l9 5 9-5-9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
