"use client";

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Logo from './Logo'

interface NavProps {
  onLogout: () => void
  userName: string
  onAddMeal: () => void
}

export default function DashboardNav({ onLogout, userName, onAddMeal }: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && 
          buttonRef.current && 
          !dropdownRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <nav className="glass fixed top-0 left-0 right-0 z-[100] border-b border-teal-100/50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex-shrink-0">
                <Logo />
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className="nav-link active-nav-link"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/meals"
                  className="nav-link"
                >
                  Meal History
                </Link>
                <Link
                  href="/dashboard/goals"
                  className="nav-link"
                >
                  Goals
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={onAddMeal}
                className="button-primary px-4 py-2"
              >
                Add Meal
              </button>
              
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors"
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="text-sm font-medium">
                    {userName ? userName[0].toUpperCase() : 'U'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div 
                    ref={dropdownRef}
                    className="absolute right-0 w-48 mt-2 py-1 bg-white rounded-lg shadow-lg ring-1 ring-black/5 focus:outline-none z-[101]"
                  >
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => { setIsMenuOpen(false); onLogout(); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  )
} 