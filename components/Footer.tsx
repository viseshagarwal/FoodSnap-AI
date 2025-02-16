import Logo from './Logo'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="glass mt-auto border-t border-indigo-100/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Logo className="h-8 w-8" />
            <p className="mt-4 text-sm text-gray-600">
              Track your nutrition with AI-powered food analysis
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="#features" className="nav-link">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="nav-link">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="nav-link">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/docs" className="nav-link">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="nav-link">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/privacy" className="nav-link">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="nav-link">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-indigo-100/50 pt-8">
          <p className="text-base text-gray-500 text-center">
            &copy; {new Date().getFullYear()} FoodSnap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 