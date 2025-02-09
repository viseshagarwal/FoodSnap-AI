import Link from 'next/link'
import { TwitterIcon, GitHubIcon } from '@/components/icons'

export default function DashboardFooter() {
  return (
    <footer className="glass border-t border-teal-100 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-teal-700">
            <p>&copy; 2024 FoodSnap. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/help"
              className="nav-link text-sm"
            >
              Help Center
            </Link>
            <Link
              href="/privacy"
              className="nav-link text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="nav-link text-sm"
            >
              Terms
            </Link>
            <a href="#" className="text-teal-500 hover:text-teal-600 transition-colors">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-teal-500 hover:text-teal-600 transition-colors">
              <span className="sr-only">GitHub</span>
              <GitHubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 