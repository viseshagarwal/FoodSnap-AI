"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget.elements as any;
    const email = form.email?.value;
    const password = form.password?.value;

    // Reset errors
    setErrors({
      email: "",
      password: "",
    });

    // Validate form
    let hasErrors = false;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Please enter your email" }));
      hasErrors = true;
    }
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Please enter your password",
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setErrors((prev) => ({ ...prev, email: data.error }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, email: "An unexpected error occurred" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation - Made more responsive */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden xs:inline">
                New to FoodSnap?
              </span>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form - Improved responsiveness */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[min(100%,24rem)] sm:max-w-md space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 px-4">
              Sign in to your account to continue
            </p>
          </div>

          <form
            className="space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="space-y-3 sm:space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {errors.email && (
                  <p
                    className="mt-1 text-xs sm:text-sm text-red-600"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {errors.password && (
                  <p
                    className="mt-1 text-xs sm:text-sm text-red-600"
                    role="alert"
                  >
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div>
                <Link
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Mobile Sign Up Link */}
            <div className="text-center sm:hidden">
              <span className="text-xs text-gray-600">
                New to FoodSnap?{" "}
                <Link
                  href="/register"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Create an account
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Footer - Made responsive */}
      <Footer className="mt-8 sm:mt-12" />
    </div>
  );
}
