import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Features | FoodSnap",
  description: "Explore the features that make FoodSnap the best way to track your nutrition",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-pink-50">
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

            {/* Nutrition Database */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">Extensive Database</h3>
              <p className="mt-2 text-gray-600">
                Access our comprehensive database of foods, ingredients, and nutritional information.
              </p>
            </div>

            {/* Custom Goals */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">Custom Goals</h3>
              <p className="mt-2 text-gray-600">
                Set and track personalized nutrition goals tailored to your needs.
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">Progress Tracking</h3>
              <p className="mt-2 text-gray-600">
                Monitor your progress with detailed charts and visualizations.
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
      <Footer />
    </div>
  );
}