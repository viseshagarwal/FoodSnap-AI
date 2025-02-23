import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | FoodSnap",
  description: "Privacy policy and data protection information for FoodSnap users",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              How we protect and handle your data
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Introduction */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                <p className="mt-4 text-gray-600">
                  At FoodSnap, we take your privacy seriously. This policy describes how we collect, 
                  use, and protect your personal information when you use our service.
                </p>
              </div>

              {/* Data Collection */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Data We Collect</h2>
                <ul className="mt-4 space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span><strong>Account Information:</strong> Email, name, and profile details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span><strong>Food Images:</strong> Photos you upload for analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span><strong>Nutrition Data:</strong> Your meal logs and nutritional information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span><strong>Usage Data:</strong> How you interact with our service</span>
                  </li>
                </ul>
              </div>

              {/* How We Use Your Data */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Data</h2>
                <ul className="mt-4 space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>To provide and improve our AI food recognition service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>To track your nutrition goals and progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>To send important updates about our service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>To improve our AI models and service accuracy</span>
                  </li>
                </ul>
              </div>

              {/* Data Protection */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Data Protection</h2>
                <p className="mt-4 text-gray-600">
                  We implement industry-standard security measures to protect your data. 
                  Your information is encrypted in transit and at rest, and we regularly 
                  review our security practices.
                </p>
              </div>

              {/* Your Rights */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                <p className="mt-4 text-gray-600">
                  You have the right to:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate data</li>
                  <li>• Request deletion of your data</li>
                  <li>• Export your data</li>
                  <li>• Opt-out of marketing communications</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                <p className="mt-4 text-gray-600">
                  If you have any questions about our privacy policy or how we handle your data, 
                  please contact our Data Protection Officer at privacy@foodsnap.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}