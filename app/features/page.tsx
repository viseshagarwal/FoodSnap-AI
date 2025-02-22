import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | FoodSnap",
  description: "Discover the powerful features of FoodSnap's AI-powered calorie tracking",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Features
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to track your nutrition journey with AI
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* AI Food Recognition */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900">AI Food Recognition</h3>
            <p className="mt-2 text-gray-600">
              Simply snap a photo of your meal and let our AI instantly identify and analyze your food.
            </p>
          </div>

          {/* Nutrition Tracking */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900">Nutrition Tracking</h3>
            <p className="mt-2 text-gray-600">
              Track calories, macros, and nutrients with detailed breakdowns of your meals.
            </p>
          </div>

          {/* Goal Setting */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900">Goal Setting</h3>
            <p className="mt-2 text-gray-600">
              Set and track personalized nutrition goals with progress monitoring.
            </p>
          </div>

          {/* Meal History */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900">Meal History</h3>
            <p className="mt-2 text-gray-600">
              View your meal history and track your eating patterns over time.
            </p>
          </div>

          {/* Analytics */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900">Analytics</h3>
            <p className="mt-2 text-gray-600">
              Get insights into your nutrition habits with detailed analytics and charts.
            </p>
          </div>

          {/* Real-time Updates */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900">Real-time Updates</h3>
            <p className="mt-2 text-gray-600">
              See your nutrition data update instantly as you log your meals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}