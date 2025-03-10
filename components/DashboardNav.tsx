"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import Button from "./Button";

interface NavProps {
  onLogout: () => void;
  userName: string;
  onAddMeal: () => void;
  toggleSidebar?: () => void;
  sidebarOpen?: boolean;
  userImage?: string | null;
}

export default function DashboardNav({
  onLogout,
  userName,
  onAddMeal,
  toggleSidebar,
  sidebarOpen,
  userImage,
}: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    // Close mobile menu on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="glass sticky top-0 z-[100] border-b border-gray-200/50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-6">
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span className="sr-only">Open mobile menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
              
              <Link href="/dashboard" className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg">
                <Logo />
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                <Link 
                  href="/dashboard" 
                  className="nav-link px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/meals" 
                  className="nav-link px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  Meal History
                </Link>
                <Link 
                  href="/dashboard/goals" 
                  className="nav-link px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  Goals
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={onAddMeal}
                className="hidden sm:flex px-3 py-1.5 text-sm"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
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
                  className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span className="sr-only">Open user menu</span>
                  {userImage ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src={userImage}
                        alt={userName}
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 text-white flex items-center justify-center shadow-sm">
                      <span className="text-sm font-medium">
                        {userName ? userName[0].toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                </button>
                
                {isMenuOpen && (
                  <div
                    ref={dropdownRef}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                    className="absolute right-0 w-56 mt-2 py-1 bg-white rounded-lg shadow-lg ring-1 ring-black/5 focus:outline-none z-[101]"
                    onKeyDown={handleKeyDown}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                    </div>
                    
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

        {/* Mobile menu, show/hide based on mobile menu state */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/meals"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Meal History
              </Link>
              <Link
                href="/dashboard/goals"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Goals
              </Link>
              <div className="py-2">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAddMeal();
                  }}
                  className="w-full justify-center"
                  type="button"
                >
                  Add Meal
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
