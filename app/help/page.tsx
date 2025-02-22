import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | FoodSnap",
  description: "Get help with using FoodSnap and find answers to common questions",
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Help Center
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Find answers to common questions and get support
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          {/* Common Questions */}
          <div className="space-y-8">
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">How accurate is the AI food recognition?</h3>
              <p className="mt-2 text-gray-600">
                Our AI model is trained on millions of food images and provides accurate results for most common foods. However, for complex dishes or unusual items, you may need to make minor adjustments.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">Can I edit the AI's analysis?</h3>
              <p className="mt-2 text-gray-600">
                Yes, you can always adjust the nutritional information and portion sizes after the AI analysis to ensure accuracy.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">How do I track my progress?</h3>
              <p className="mt-2 text-gray-600">
                Your dashboard shows daily, weekly, and monthly progress. You can view detailed charts and analytics to track your nutrition goals over time.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900">How do I set my nutrition goals?</h3>
              <p className="mt-2 text-gray-600">
                Go to your dashboard settings to set custom goals for calories, macronutrients, and other nutritional targets.
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Can't find what you're looking for?
            </p>
            <a 
              href="/contact" 
              className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}