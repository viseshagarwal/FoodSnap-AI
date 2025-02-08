import React from 'react'

export default function Logo({ className = "h-8 w-8" }) {
  return (
    <div className="flex items-center space-x-2">
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2z"
          fill="currentColor"
        />
        <path
          d="M19 10c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z"
          fill="currentColor"
        />
        <path
          d="M5 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z"
          fill="currentColor"
        />
        <path
          d="M12 15c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2v-2c0-1.1-.9-2-2-2z"
          fill="currentColor"
        />
      </svg>
      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
        FoodSnap
      </span>
    </div>
  )
} 