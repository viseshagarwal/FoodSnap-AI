import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How It Works | FoodSnap",
  description: "Learn how FoodSnap uses AI to analyze your food and track nutrition",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              How FoodSnap Works
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Discover how we make nutrition tracking effortless
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">1. Take a Photo</h2>
                <p className="mt-4 text-gray-600">
                  Simply snap a photo of your meal using your smartphone camera. Our app works with 
                  any type of food, from home-cooked meals to restaurant dishes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">2. AI Analysis</h2>
                <p className="mt-4 text-gray-600">
                  Our advanced AI instantly analyzes your food photo, identifying ingredients and 
                  portion sizes with high accuracy. The AI has been trained on millions of food 
                  images to ensure reliable results.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">3. Get Nutritional Info</h2>
                <p className="mt-4 text-gray-600">
                  Within seconds, receive detailed nutritional information including calories, 
                  macronutrients (protein, carbs, fats), and micronutrients. All data is based 
                  on verified nutritional databases.
                </p>
              </div>

              {/* Step 4 */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">4. Track Progress</h2>
                <p className="mt-4 text-gray-600">
                  Your meal data is automatically logged and organized. View detailed analytics, 
                  track your nutrition goals, and receive personalized insights to improve your 
                  eating habits.
                </p>
              </div>

              {/* AI Technology */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Our AI Technology</h2>
                <p className="mt-4 text-gray-600">
                  FoodSnap uses state-of-the-art computer vision and machine learning models, 
                  continuously trained and improved to recognize a wide variety of foods and 
                  cuisines. Our AI can:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Identify multiple food items in a single image</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Estimate portion sizes accurately</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Recognize ingredients and cooking methods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Account for regional and cultural food variations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}