import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | FoodSnap",
  description: "Learn how FoodSnap uses AI to help you track your nutrition",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            How It Works
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Track your nutrition in three simple steps
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Take a Photo</h3>
                  <p className="mt-2 text-gray-600">
                    Simply take a photo of your meal using your device's camera or upload an existing photo.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-semibold text-gray-900">AI Analysis</h3>
                  <p className="mt-2 text-gray-600">
                    Our AI instantly analyzes your food, identifying ingredients and calculating nutritional information.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Track Progress</h3>
                  <p className="mt-2 text-gray-600">
                    View your nutrition data, track your goals, and monitor your progress over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}