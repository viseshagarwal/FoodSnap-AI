import Link from 'next/link'
import Logo from './Logo'

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>
          <div className="flex space-x-4">
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 