import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Help Center | FoodSnap",
  description: "Get help and support for using FoodSnap",
};

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-pink-50">
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
            <div className="space-y-8">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900">How accurate is the AI food recognition?</h3>
                <p className="mt-2 text-gray-600">
                  Our AI model has been trained on millions of food images and achieves over 95% accuracy in identifying common foods. The nutritional information is sourced from verified databases.
                </p>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900">How do I take good food photos?</h3>
                <p className="mt-2 text-gray-600">
                  For best results, ensure good lighting, capture the entire plate, and try to avoid shadows or glare on the food.
                </p>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900">How do I set my nutrition goals?</h3>
                <p className="mt-2 text-gray-600">
                  Go to your dashboard settings to set custom goals for calories, macronutrients, and other nutritional targets.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600">
                Can&apos;t find what you&apos;re looking for?
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
      <Footer />
    </div>
  );
}