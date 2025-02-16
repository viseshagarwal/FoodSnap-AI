import Link from "next/link";
import { TwitterIcon, GitHubIcon } from "@/components/icons";

export default function DashboardFooter() {
  return (
    <footer className="mt-auto py-4 px-6">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>&copy; {new Date().getFullYear()} FoodSnap</span>
          <Link href="/help" className="hover:text-gray-900">
            Help Center
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600"
          >
            <TwitterIcon className="h-5 w-5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
            Give Feedback
          </button>
        </div>
      </div>
    </footer>
  );
}
