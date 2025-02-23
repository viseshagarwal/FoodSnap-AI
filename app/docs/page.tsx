import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Documentation | FoodSnap",
  description: "Technical documentation and guides for using FoodSnap",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Documentation
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to know about using FoodSnap
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Getting Started */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-600">
                    Welcome to FoodSnap! This guide will help you get started with our AI-powered
                    nutrition tracking app.
                  </p>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">Prerequisites</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>A smartphone with a camera</li>
                      <li>FoodSnap account (free or premium)</li>
                      <li>Internet connection</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Core Features */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Core Features</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Food Recognition</h3>
                    <p className="mt-2 text-gray-600">
                      Learn how to use our AI-powered food recognition system for accurate meal tracking.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Nutrition Tracking</h3>
                    <p className="mt-2 text-gray-600">
                      Understand how to view and interpret your nutritional information.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Goal Setting</h3>
                    <p className="mt-2 text-gray-600">
                      Set up and manage your nutrition goals effectively.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Features */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Advanced Features</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Custom Meals</h3>
                    <p className="mt-2 text-gray-600">
                      Create and save custom meals for quick logging.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Analytics</h3>
                    <p className="mt-2 text-gray-600">
                      Deep dive into your nutrition data with advanced analytics.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">API Integration</h3>
                    <p className="mt-2 text-gray-600">
                      Connect FoodSnap with other health and fitness apps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Troubleshooting</h2>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-600">
                    Common issues and their solutions:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Image Recognition Issues:</strong> Ensure good lighting and clear photos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Sync Problems:</strong> Check your internet connection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Account Access:</strong> Reset password or contact support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Support */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Need More Help?</h2>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-600">
                    If you can't find what you're looking for, our support team is here to help:
                  </p>
                  <div className="flex space-x-4">
                    <a 
                      href="/contact" 
                      className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Contact Support
                    </a>
                    <a 
                      href="/help" 
                      className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Visit Help Center
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}