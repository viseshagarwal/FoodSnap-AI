import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | FoodSnap",
  description: "Technical documentation and guides for using FoodSnap",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Documentation
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Learn how to make the most of FoodSnap
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          {/* Quick Start */}
          <div className="glass p-8 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Quick Start Guide</h2>
            <div className="mt-4 space-y-4">
              <div className="pl-4 border-l-4 border-indigo-500">
                <h3 className="font-semibold text-gray-900">Step 1: Create an Account</h3>
                <p className="mt-1 text-gray-600">Sign up for a new account and choose your plan.</p>
              </div>
              <div className="pl-4 border-l-4 border-indigo-500">
                <h3 className="font-semibold text-gray-900">Step 2: Set Your Goals</h3>
                <p className="mt-1 text-gray-600">Configure your nutrition goals in the dashboard settings.</p>
              </div>
              <div className="pl-4 border-l-4 border-indigo-500">
                <h3 className="font-semibold text-gray-900">Step 3: Start Tracking</h3>
                <p className="mt-1 text-gray-600">Take photos of your meals and let AI do the work.</p>
              </div>
            </div>
          </div>

          {/* Feature Documentation */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">AI Recognition</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Supported food types</li>
                <li>• Image requirements</li>
                <li>• Accuracy guidelines</li>
                <li>• Manual adjustments</li>
              </ul>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">Goal Setting</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Calorie targets</li>
                <li>• Macro tracking</li>
                <li>• Progress monitoring</li>
                <li>• Custom goals</li>
              </ul>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">Analytics</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Dashboard metrics</li>
                <li>• Data visualization</li>
                <li>• Export options</li>
                <li>• Trend analysis</li>
              </ul>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">Account Management</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Profile settings</li>
                <li>• Privacy options</li>
                <li>• Data backup</li>
                <li>• Subscription management</li>
              </ul>
            </div>
          </div>

          {/* API Documentation Link */}
          <div className="mt-12 text-center">
            <a 
              href="/docs/api" 
              className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              View API Documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}