'use client'

import { useEffect, useRef } from 'react'

export default function Pattern() {
  const patternRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!patternRef.current) return

      // Calculate mouse position relative to viewport
      const mouseX = e.clientX
      const mouseY = e.clientY

      // Calculate the movement offset (reduced movement for subtle effect)
      const moveX = (mouseX - window.innerWidth / 2) * 0.02
      const moveY = (mouseY - window.innerHeight / 2) * 0.02

      // Apply the transform
      patternRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-white/50" />
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
            <path
              d="M 25 0 L 25 50 M 0 25 L 50 25"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-orange-200/20"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div 
        className="pointer-events-none absolute -inset-px opacity-50 mix-blend-soft-light"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,237,213,0.1), transparent 40%)',
        }}
      />
    </div>
  )
} 