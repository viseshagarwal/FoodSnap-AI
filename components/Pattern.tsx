export default function Pattern() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-white/50" />
      <svg
        className="absolute inset-0 w-full h-full animate-pattern-shift"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(15)"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-orange-200/40"
            />
            <circle
              cx="50"
              cy="50"
              r="1"
              fill="currentColor"
              className="text-orange-300/40"
            />
            <circle
              cx="0"
              cy="0"
              r="1"
              fill="currentColor"
              className="text-orange-300/40"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
} 