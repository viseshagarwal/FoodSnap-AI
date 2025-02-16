"use client";

import { useEffect, useRef } from "react";

export default function Pattern() {
  const patternRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!patternRef.current) return;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const moveX = (mouseX - window.innerWidth / 2) * 0.02;
      const moveY = (mouseY - window.innerHeight / 2) * 0.02;
      patternRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 opacity-80"
        style={{
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          transform:
            "translate(calc(var(--mouse-x) * -0.02), calc(var(--mouse-y) * -0.02))",
        }}
      />

      {/* Animated dot pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 77, 64, 0.1) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
          animation: "float 6s ease-in-out infinite",
          transform:
            "translate(calc(var(--mouse-x) * -0.01), calc(var(--mouse-y) * -0.01))",
        }}
      />

      {/* Floating gradient circles */}
      <div
        className="absolute -top-1/2 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-teal-200 to-teal-300 opacity-30 blur-3xl float"
        style={{
          animationDelay: "0s",
          transform:
            "translate(calc(var(--mouse-x) * -0.05), calc(var(--mouse-y) * -0.05))",
        }}
      />
      <div
        className="absolute -bottom-1/2 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-teal-200 to-teal-300 opacity-30 blur-3xl float"
        style={{
          animationDelay: "-2s",
          transform:
            "translate(calc(var(--mouse-x) * -0.05), calc(var(--mouse-y) * -0.05))",
        }}
      />

      {/* Animated pattern overlay */}
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
            {/* Animated plate icon */}
            <path
              d="M25 25m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-teal-300/30 pulse"
            />
            {/* Animated utensils */}
            <path
              d="M15 15l5 5M20 15l-5 5"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-teal-400/20 float"
              style={{ animationDelay: "-1s" }}
            />
            <path
              d="M35 35a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
              fill="currentColor"
              className="text-teal-200/20 float"
              style={{ animationDelay: "-2s" }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#food-pattern)" />
      </svg>

      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute -inset-px opacity-50 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 150, 136, 0.1), transparent 40%)",
        }}
      />

      {/* Shimmer effect */}
      <div
        className="absolute inset-0 shimmer-text"
        style={{
          maskImage:
            "linear-gradient(45deg, transparent 45%, white 55%, transparent 65%)",
          WebkitMaskImage:
            "linear-gradient(45deg, transparent 45%, white 55%, transparent 65%)",
        }}
      />
    </div>
  );
}
