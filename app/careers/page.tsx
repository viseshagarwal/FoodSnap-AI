import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Careers | FoodSnap",
  description: "Join the FoodSnap team and help revolutionize nutrition tracking with AI",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Join Our Team
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Help us make healthy living accessible to everyone
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Why FoodSnap */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Why FoodSnap?</h2>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-600">
                    At FoodSnap, we're passionate about using cutting-edge technology to help people 
                    make better nutrition choices. Join us in our mission to revolutionize how 
                    people track and understand their nutrition.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Our Values</h3>
                      <ul className="mt-2 space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span>Innovation in AI and Health Tech</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span>User-First Approach</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span>Continuous Learning</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Benefits</h3>
                      <ul className="mt-2 space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span>Competitive Compensation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span>Remote-First Culture</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span>Health & Wellness Benefits</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Positions */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Open Positions</h2>
                <div className="mt-6 space-y-6">
                  {/* Engineering */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Engineering</h3>
                    <div className="mt-4 space-y-4">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900">Senior ML Engineer</h4>
                        <p className="mt-2 text-gray-600">
                          Lead the development of our food recognition AI models
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">Full-time</span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">Remote</span>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900">Full Stack Developer</h4>
                        <p className="mt-2 text-gray-600">
                          Build and maintain our web and mobile applications
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">Full-time</span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">Remote</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product & Design */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Product & Design</h3>
                    <div className="mt-4 space-y-4">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900">Product Manager</h4>
                        <p className="mt-2 text-gray-600">
                          Drive product strategy and roadmap for our nutrition tracking platform
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">Full-time</span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">Remote</span>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900">UI/UX Designer</h4>
                        <p className="mt-2 text-gray-600">
                          Create beautiful and intuitive user experiences
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">Full-time</span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">Remote</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Process */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Application Process</h2>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">1. Apply</h3>
                      <p className="mt-2 text-gray-600">
                        Submit your resume and tell us why you want to join FoodSnap
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">2. Interview</h3>
                      <p className="mt-2 text-gray-600">
                        Meet the team and show us your skills
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">3. Welcome</h3>
                      <p className="mt-2 text-gray-600">
                        Join us in revolutionizing nutrition tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
                <p className="mt-4 text-gray-600">
                  Don't see a position that matches your skills? We're always looking for talented 
                  individuals to join our team.
                </p>
                <div className="mt-6">
                  <a 
                    href="mailto:careers@foodsnap.com"
                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Send Us Your Resume
                  </a>
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