'use client'

import { useEffect, useRef } from 'react'

export default function Pattern() {
  const patternRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!patternRef.current) return
      const mouseX = e.clientX
      const mouseY = e.clientY
      const moveX = (mouseX - window.innerWidth / 2) * 0.02
      const moveY = (mouseY - window.innerHeight / 2) * 0.02
      patternRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-rose-50/30 to-white/50" />
      <svg
        ref={patternRef}
        className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="food-pattern"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(15)"
          >
            {/* Plate icon */}
            <path
              d="M25 25m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-amber-300/30"
            />
            {/* Fork icon */}
            <path
              d="M15 15l5 5M20 15l-5 5"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-rose-300/20"
            />
            {/* Spoon icon */}
            <path
              d="M35 35a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
              fill="currentColor"
              className="text-amber-200/20"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#food-pattern)" />
      </svg>

      <div 
        className="pointer-events-none absolute -inset-px opacity-50 mix-blend-soft-light"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(251, 191, 36, 0.1), transparent 40%)',
        }}
      />
    </div>
  )
} 