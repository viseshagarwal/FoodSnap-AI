import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | FoodSnap",
  description: "Terms and conditions for using FoodSnap",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Please read these terms carefully before using FoodSnap
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Agreement */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Agreement to Terms</h2>
              <p className="mt-4 text-gray-600">
                By accessing or using FoodSnap, you agree to be bound by these Terms of Service 
                and our Privacy Policy. If you disagree with any part of the terms, you may not 
                access the service.
              </p>
            </div>

            {/* Service Description */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
              <p className="mt-4 text-gray-600">
                FoodSnap provides AI-powered food recognition and nutrition tracking services. 
                While we strive for accuracy, the service is provided "as is" and should not 
                be considered medical or professional nutritional advice.
              </p>
            </div>

            {/* User Accounts */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
              <ul className="mt-4 space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>You must provide accurate and complete registration information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>You are responsible for maintaining the security of your account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>You must notify us of any unauthorized account access</span>
                </li>
              </ul>
            </div>

            {/* Acceptable Use */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Acceptable Use</h2>
              <p className="mt-4 text-gray-600">You agree not to:</p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Use the service for any illegal purposes</li>
                <li>• Share your account credentials</li>
                <li>• Attempt to bypass any security measures</li>
                <li>• Upload harmful or malicious content</li>
                <li>• Interfere with the service&apos;s operation</li>
              </ul>
            </div>

            {/* Subscription and Payments */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Subscription and Payments</h2>
              <ul className="mt-4 space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Some features require a paid subscription</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Subscriptions automatically renew unless cancelled</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Refunds are provided according to our refund policy</span>
                </li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
              <p className="mt-4 text-gray-600">
                The service and its original content, features, and functionality are owned by 
                FoodSnap and are protected by international copyright, trademark, and other 
                intellectual property laws.
              </p>
            </div>

            {/* Termination */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Termination</h2>
              <p className="mt-4 text-gray-600">
                We may terminate or suspend your account and access to the service immediately, 
                without prior notice, for conduct that we believe violates these Terms or is 
                harmful to other users, us, or third parties, or for any other reason.
              </p>
            </div>

            {/* Updates to Terms */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Updates to Terms</h2>
              <p className="mt-4 text-gray-600">
                We reserve the right to modify these terms at any time. We will notify users 
                of any material changes via email or through the service. Continued use of 
                the service after changes constitutes acceptance of the new terms.
              </p>
            </div>

            {/* Contact */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              <p className="mt-4 text-gray-600">
                If you have any questions about these Terms, please contact us at legal@foodsnap.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}