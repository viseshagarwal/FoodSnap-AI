import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | FoodSnap",
  description: "Latest news, tips, and insights about nutrition and healthy living",
};

const blogPosts = [
  {
    id: 1,
    title: "The Science Behind AI Food Recognition",
    excerpt: "Learn how our advanced AI models identify and analyze different foods from photos.",
    date: "March 15, 2024",
    category: "Technology",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "5 Tips for Accurate Food Tracking",
    excerpt: "Make the most of FoodSnap with these expert tips for tracking your nutrition.",
    date: "March 10, 2024",
    category: "Tips & Tricks",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Understanding Your Nutritional Needs",
    excerpt: "A comprehensive guide to setting and achieving your nutrition goals.",
    date: "March 5, 2024",
    category: "Nutrition",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "The Future of AI in Nutrition",
    excerpt: "Exploring upcoming features and the future of AI-powered nutrition tracking.",
    date: "March 1, 2024",
    category: "News",
    readTime: "3 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
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
  );
}