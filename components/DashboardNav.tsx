import Link from 'next/link'
import Logo from './Logo'

interface NavProps {
  onLogout: () => void
  userName: string
}

export default function DashboardNav({ onLogout, userName }: NavProps) {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <Logo />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="nav-link"
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
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                onClick={() => {}}
                className="button-primary mr-4"
              >
                Add Meal
              </button>
            </div>
            
            <div className="ml-3 relative group">
              <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                  {userName[0].toUpperCase()}
                </div>
              </button>
              
              <div className="absolute right-0 w-48 mt-1 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                <div className="glass py-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    href="/dashboard/profile"
                    className="nav-link block px-4 py-2"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="nav-link block px-4 py-2"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={onLogout}
                    className="nav-link block w-full text-left px-4 py-2"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 