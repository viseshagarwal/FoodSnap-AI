import React from "react";

interface IconProps {
  className?: string;
  color?: string;
}

export default function LogoIcon({
  className = "h-8 w-8",
  color = "#F97316",
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Plate circle */}
      <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="4" />

      {/* Fork */}
      <path
        d="M24 16v32M20 16v8c0 2.2 1.8 4 4 4s4-1.8 4-4v-8"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Knife */}
      <path
        d="M40 16c0 0-2 8-2 12s2 8 10 8v12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sparkle effects */}
      <path
        d="M32 8v-4M56 32h4M32 60v-4M8 32H4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M48 16l2.8-2.8M16 48l-2.8 2.8M48 48l2.8 2.8M16 16l-2.8-2.8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
