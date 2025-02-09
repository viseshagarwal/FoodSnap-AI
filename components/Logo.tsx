import React from 'react';
import LogoIcon from './icons/LogoIcon';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <LogoIcon className={className} />
      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
        FoodSnap
      </span>
    </div>
  );
} 