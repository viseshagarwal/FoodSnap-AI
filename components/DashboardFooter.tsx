import Link from 'next/link'
import { TwitterIcon, GitHubIcon } from '@/components/icons'

export default function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <p>&copy; 2024 FoodSnap. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/help"
              className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
            >
              Help Center
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
            >
              Terms
            </Link>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <GitHubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 