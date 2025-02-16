"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget.elements as any;
    const name = form.name?.value;
    const email = form.email?.value;
    const password = form.password?.value;
    const terms = form.terms?.checked;

    // Reset errors
    setErrors({
      name: "",
      email: "",
      password: "",
      terms: "",
    });

    // Validate form
    let hasErrors = false;
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Please enter your name" }));
      hasErrors = true;
    }
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
    if (!terms) {
      setErrors((prev) => ({
        ...prev,
        terms: "Please accept the terms and conditions",
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
                Already have an account?
              </span>
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Register Form - Improved responsiveness */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[min(100%,24rem)] sm:max-w-md space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 px-4">
              Join FoodSnap to start tracking your nutrition journey
            </p>
          </div>

          <form
            className="space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="space-y-3 sm:space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1 block w-full px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {errors.name && (
                  <p
                    className="mt-1 text-xs sm:text-sm text-red-600"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

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
                  autoComplete="new-password"
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

            {/* Terms and Conditions */}
            <div className="flex items-start sm:items-center">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all"
                />
              </div>
              <label
                htmlFor="terms"
                className="ml-2 block text-xs sm:text-sm text-gray-900"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs sm:text-sm text-red-600" role="alert">
                {errors.terms}
              </p>
            )}

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
                  <span>Creating account...</span>
                </span>
              ) : (
                "Create account"
              )}
            </button>

            {/* Mobile Sign In Link */}
            <div className="text-center sm:hidden">
              <span className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign in
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
