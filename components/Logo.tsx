import React from 'react';
import LogoIcon from './icons/LogoIcon';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <div className="flex items-center space-x-2 group">
      <div className="transform transition-transform duration-300 group-hover:scale-110">
        <LogoIcon 
          className={`${className} transition-all duration-300 group-hover:rotate-12`} 
          color="var(--primary)"
        />
      </div>
      <span className="text-2xl font-bold gradient-text relative">
        FoodSnap
        <span className="absolute inset-0 gradient-text opacity-75 blur-sm" aria-hidden="true">
          FoodSnap
        </span>
      </span>
    </div>
  );
} 