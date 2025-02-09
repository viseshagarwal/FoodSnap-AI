import React from 'react';

interface IconProps {
  className?: string;
  stroke?: string;
}

export default function CaloriesIcon({ className = "h-6 w-6", stroke = "currentColor" }: IconProps) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke={stroke}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
      />
    </svg>
  );
} 