import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | FoodSnap",
  description: "Learn about FoodSnap's mission and team",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            About FoodSnap
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Making nutrition tracking effortless with AI
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          {/* Mission */}
          <div className="glass p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-gray-600 text-lg">
              At FoodSnap, we believe that maintaining a healthy lifestyle shouldn't be complicated. 
              Our mission is to make nutrition tracking accessible, accurate, and effortless for everyone 
              through the power of artificial intelligence.
            </p>
          </div>

          {/* Story */}
          <div className="glass p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
            <p className="mt-4 text-gray-600">
              Founded in 2024, FoodSnap started with a simple idea: what if tracking your nutrition 
              was as easy as taking a photo? Our team of nutrition experts and AI engineers came together 
              to create a solution that combines the latest in artificial intelligence with expert 
              nutritional knowledge.
            </p>
            <p className="mt-4 text-gray-600">
              Today, we're helping thousands of users make better nutritional choices and achieve their 
              health goals with just their smartphone camera.
            </p>
          </div>

          {/* Values */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass p-6 rounded-2xl text-center">
              <h3 className="text-xl font-semibold text-gray-900">Innovation</h3>
              <p className="mt-2 text-gray-600">
                Pushing the boundaries of AI technology to solve real-world problems.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center">
              <h3 className="text-xl font-semibold text-gray-900">Accuracy</h3>
              <p className="mt-2 text-gray-600">
                Committed to providing precise nutritional information you can trust.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center">
              <h3 className="text-xl font-semibold text-gray-900">Accessibility</h3>
              <p className="mt-2 text-gray-600">
                Making healthy living achievable for everyone, everywhere.
              </p>
            </div>
          </div>

          {/* Join Us */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Join us in our mission to make healthy living easier
            </p>
            <a 
              href="/register" 
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started with FoodSnap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}