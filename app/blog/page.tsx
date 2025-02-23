import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | FoodSnap",
  description: "Nutrition tips, healthy recipes, and FoodSnap updates",
};

const blogPosts = [
  {
    id: 1,
    title: "How AI is Revolutionizing Nutrition Tracking",
    excerpt: "Discover how artificial intelligence is making it easier than ever to track your daily nutrition and make healthier food choices.",
    category: "Technology",
    date: "Mar 10, 2024",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "5 Tips for Accurate Food Photography",
    excerpt: "Learn how to take better food photos for more accurate nutritional analysis with these simple tips.",
    category: "Tips & Tricks",
    date: "Mar 8, 2024",
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "Understanding Your Macronutrients",
    excerpt: "A comprehensive guide to proteins, carbs, and fats - and why they matter for your health goals.",
    category: "Nutrition",
    date: "Mar 5, 2024",
    readTime: "7 min read"
  },
  {
    id: 4,
    title: "New Features: March 2024 Update",
    excerpt: "Check out the latest features and improvements we've added to make your nutrition tracking experience even better.",
    category: "Updates",
    date: "Mar 1, 2024",
    readTime: "4 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Blog
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Insights and updates from the FoodSnap team
            </p>
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
              {blogPosts.map((post) => (
                <article key={post.id} className="glass p-6 rounded-2xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">
                    <Link href={`/blog/${post.id}`} className="hover:text-indigo-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-gray-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-4">
                    <Link 
                      href={`/blog/${post.id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-16 glass p-8 rounded-2xl text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Subscribe to Our Newsletter
              </h2>
              <p className="mt-2 text-gray-600">
                Get the latest nutrition tips and FoodSnap updates delivered to your inbox.
              </p>
              <form className="mt-6 flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}