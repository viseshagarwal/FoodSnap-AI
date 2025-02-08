import Link from 'next/link'
import Logo from './Logo'

interface NavProps {
  onLogout: () => void
  userName: string
}

export default function DashboardNav({ onLogout, userName }: NavProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-amber-100">
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
                  className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/meals"
                  className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Meal History
                </Link>
                <Link
                  href="/dashboard/goals"
                  className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 mr-4"
              >
                Add Meal
              </button>
            </div>
            
            <div className="ml-3 relative group">
              <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  {userName[0].toUpperCase()}
                </div>
              </button>
              
              <div className="absolute right-0 w-48 mt-1 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                <div className="py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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