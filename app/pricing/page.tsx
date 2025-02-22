import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | FoodSnap",
  description: "Simple and transparent pricing plans for FoodSnap",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900">Free</h3>
            <p className="mt-4 text-4xl font-bold text-gray-900">$0</p>
            <p className="mt-2 text-sm text-gray-500">Forever free</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">10 meal analyses per month</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">Basic nutrition tracking</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">7-day meal history</span>
              </li>
            </ul>
            <Link 
              href="/register" 
              className="mt-8 block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="glass p-8 rounded-2xl border-2 border-indigo-500 relative">
            <div className="absolute top-0 right-0 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm">
              Popular
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
            <p className="mt-4 text-4xl font-bold text-gray-900">$9.99</p>
            <p className="mt-2 text-sm text-gray-500">per month</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">Unlimited meal analyses</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">Advanced nutrition insights</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">Full meal history</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">Custom goals</span>
              </li>
            </ul>
            <Link 
              href="/register?plan=pro" 
              className="mt-8 block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Pro
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
            <p className="mt-4 text-4xl font-bold text-gray-900">Custom</p>
            <p className="mt-2 text-sm text-gray-500">Contact for pricing</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">Custom integration</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">Dedicated support</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500">✓</span>
                <span className="ml-3 text-gray-600">SLA guarantee</span>
              </li>
            </ul>
            <Link 
              href="/contact" 
              className="mt-8 block w-full bg-gray-800 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}