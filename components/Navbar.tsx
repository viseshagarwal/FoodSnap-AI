import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="flex-shrink-0 hover:scale-105 transition-transform"
          >
            <Logo />
          </Link>
          <div className="flex space-x-4">
            <Link href="/login" className="nav-link">
              Login
            </Link>
            <Link href="/register" className="button-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
