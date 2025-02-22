import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | FoodSnap",
  description: "Join our team and help make nutrition tracking accessible to everyone",
};

const openPositions = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 4,
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Join Our Team
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Help us revolutionize nutrition tracking with AI
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          {/* Why Join Us */}
          <div className="glass p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Why Join FoodSnap?</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  🚀
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Innovation First</h3>
                  <p className="mt-2 text-gray-600">
                    Work on cutting-edge AI technology that's changing how people track nutrition.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  🌍
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Remote Culture</h3>
                  <p className="mt-2 text-gray-600">
                    Work from anywhere in the world with our distributed team.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  📈
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Growth Opportunities</h3>
                  <p className="mt-2 text-gray-600">
                    Develop your skills and grow your career with us.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  🎯
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Meaningful Impact</h3>
                  <p className="mt-2 text-gray-600">
                    Help people live healthier lives through better nutrition.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Open Positions</h2>
            <div className="mt-6 space-y-4">
              {openPositions.map((position) => (
                <div key={position.id} className="glass p-6 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {position.title}
                      </h3>
                      <div className="mt-2 space-x-4">
                        <span className="text-gray-600">{position.department}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{position.location}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{position.type}</span>
                      </div>
                    </div>
                    <a 
                      href={`/careers/${position.id}`}
                      className="button-primary"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Finding Your Role */}
          <div className="mt-12 glass p-8 rounded-2xl text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Don't see the right role?
            </h2>
            <p className="mt-2 text-gray-600">
              Send your resume to careers@foodsnap.com and tell us how you can contribute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}