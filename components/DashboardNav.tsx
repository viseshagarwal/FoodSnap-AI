"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";

interface NavProps {
  onLogout: () => void;
  userName: string;
  onAddMeal: () => void;
}

export default function DashboardNav({
  onLogout,
  userName,
  onAddMeal,
}: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="glass fixed top-0 left-0 right-0 z-[100] border-b border-teal-100/50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1">
                <Logo />
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  href="/dashboard" 
                  className="nav-link active-nav-link focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg px-3 py-2"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/meals" 
                  className="nav-link focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg px-3 py-2"
                >
                  Meal History
                </Link>
                <Link 
                  href="/dashboard/goals" 
                  className="nav-link focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg px-3 py-2"
                >
                  Goals
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={onAddMeal}
                className="px-4 py-2"
                type="button"
              >
                Add Meal
              </Button>

              <div className="relative">
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  onKeyDown={handleKeyDown}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="text-sm font-medium">
                    {userName ? userName[0].toUpperCase() : "U"}
                  </span>
                </button>

                {isMenuOpen && (
                  <div
                    ref={dropdownRef}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                    className="absolute right-0 w-48 mt-2 py-1 bg-white rounded-lg shadow-lg ring-1 ring-black/5 focus:outline-none z-[101]"
                    onKeyDown={handleKeyDown}
                  >
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 focus:outline-none focus:bg-teal-50 focus:text-teal-700"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 focus:outline-none focus:bg-teal-50 focus:text-teal-700"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 focus:outline-none focus:bg-teal-50 focus:text-teal-700"
                      role="menuitem"
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
      <div className="h-16" />
    </>
  );
}
