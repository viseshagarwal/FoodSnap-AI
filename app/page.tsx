import { Metadata } from "next";
import Link from "next/link";
import {
  FaCamera,
  FaChartLine,
  FaHistory,
  FaCheck,
  FaApple,
  FaHeartbeat,
  FaBrain,
  FaUserFriends,
} from "react-icons/fa";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FoodSnap - AI-Powered Food Analysis",
  description:
    "Track your nutrition with AI-powered food analysis. Simply snap a photo of your meal and get instant nutritional information.",
};

interface Feature {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const features: Feature[] = [
  {
    name: "Visual Food Recognition",
    description:
      "Take a photo of your meal and let our AI instantly identify and analyze your food.",
    icon: <FaCamera className="w-6 h-6" />,
    color: "text-orange-500",
  },
  {
    name: "Smart Nutrition Tracking",
    description:
      "Get detailed nutritional information including calories, protein, carbs, and fat.",
    icon: <FaChartLine className="w-6 h-6" />,
    color: "text-indigo-500",
  },
  {
    name: "Meal History & Insights",
    description:
      "Track your nutrition journey with detailed meal history and personalized insights.",
    icon: <FaHistory className="w-6 h-6" />,
    color: "text-purple-500",
  },
];

const benefits = [
  {
    icon: <FaHeartbeat className="w-6 h-6" />,
    title: "Better Health Choices",
    description:
      "Make informed decisions about your nutrition with accurate, real-time data.",
    color: "text-pink-500",
  },
  {
    icon: <FaBrain className="w-6 h-6" />,
    title: "AI-Powered Insights",
    description:
      "Get personalized recommendations based on your eating habits and goals.",
    color: "text-indigo-500",
  },
  {
    icon: <FaApple className="w-6 h-6" />,
    title: "Comprehensive Database",
    description:
      "Access nutritional information for thousands of foods and recipes.",
    color: "text-green-500",
  },
  {
    icon: <FaUserFriends className="w-6 h-6" />,
    title: "Community Support",
    description:
      "Join a community of health-conscious individuals on their nutrition journey.",
    color: "text-orange-500",
  },
];

const plans = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Visual food recognition",
      "Basic nutritional information",
      "Daily meal logging",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    features: [
      "Everything in Basic",
      "Detailed macro tracking",
      "Meal recommendations",
      "Advanced analytics",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "$19.99/mo",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom meal plans",
      "API access",
      "Dedicated support",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Get Started
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Track Your Nutrition with
              <span className="block sm:inline bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                {" "}
                AI
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-6">
              Simply snap a photo of your meal and get instant nutritional
              information. Make healthier choices with AI-powered food analysis.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all text-sm sm:text-base text-center"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 text-gray-600 hover:text-gray-900 rounded-lg font-medium transition-all text-sm sm:text-base text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 sm:mt-24 lg:mt-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
              {features.map((feature) => (
                <div key={feature.name} className="relative group">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl transition-all h-full group-hover:scale-105">
                    <div
                      className={`${feature.color} mb-4 sm:mb-5 w-12 h-12 flex items-center justify-center rounded-full`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* App Preview Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Simplify Your Nutrition Journey
            </h2>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600">
              Get accurate nutritional information in seconds
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-8">
              {/* Dashboard Interface SVG */}
              <svg className="w-full h-full" viewBox="0 0 800 500" fill="none">
                {/* Main Background */}
                <rect
                  x="100"
                  y="50"
                  width="600"
                  height="400"
                  rx="16"
                  fill="white"
                  opacity="0.9"
                  className="shadow-2xl"
                />
                
                {/* Header */}
                <rect
                  x="120"
                  y="70"
                  width="560" 
                  height="60"
                  rx="8"
                  fill="#F9FAFB"
                />
                
                {/* Header Logo and Title */}
                {/* Logo - Camera with flame icon */}
                <circle cx="140" cy="100" r="14" fill="url(#logoGradient)" />
                <path d="M133 98 L133 102 L147 102 L147 98 Z" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M136 98 L136 96 L144 96 L144 98" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M140 100.5 C140 99 142 99.5 142 101" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="140" cy="100" r="3" stroke="white" strokeWidth="1" fill="none" />
                
                {/* Brand name and navigation */}
                <text x="160" y="104" fill="#111827" fontSize="13" fontWeight="600">FoodSnap</text>
                
                {/* Navigation Menu Items with proper spacing and indicators */}
                <rect x="310" y="90" width="55" height="22" rx="6" fill="#6366F1" opacity="0.15" />
                <text x="326" y="105" fill="#4F46E5" fontSize="11" fontWeight="600">Home</text>
                <circle cx="315" cy="101" r="3" fill="#4F46E5" />
                
                <rect x="375" y="90" width="55" height="22" rx="6" fill="#FFFFFF" />
                <text x="385" y="105" fill="#4B5563" fontSize="11" fontWeight="500">Meals</text>
                
                <rect x="440" y="90" width="70" height="22" rx="6" fill="#FFFFFF" />
                <text x="450" y="105" fill="#4B5563" fontSize="11" fontWeight="500">Analytics</text>
                
                <rect x="520" y="90" width="50" height="22" rx="6" fill="#FFFFFF" />
                <text x="530" y="105" fill="#4B5563" fontSize="11" fontWeight="500">Goals</text>
                
                <rect
                  x="130"
                  y="85"
                  width="200"
                  height="30"
                  rx="4"
                  fill="#F3F4F6"
                />
                <circle cx="660" cy="100" r="15" fill="#EEF2FF" />
                <path
                  d="M655 100L659 104L666 97"
                  stroke="#6366F1"
                  strokeWidth="2"
                />

                {/* Stats Cards - Row 1 */}
                <g>
                  <rect
                    x="120"
                    y="145" 
                    width="130"
                    height="90"
                    rx="8"
                    fill="white"
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                  <circle cx="140" cy="165" r="12" fill="#FFEDD5" />
                  <path d="M135 165C135 165 138 160 140 160C142 160 145 165 145 165C145 165 142 170 140 170C138 170 135 165 135 165Z" stroke="#F97316" strokeWidth="2" />
                  <text x="155" y="168" fill="#374151" fontSize="10" fontWeight="500">Calories</text>
                  <rect x="135" y="185" width="100" height="10" rx="2" fill="#F3F4F6" />
                  <rect x="135" y="205" width="80" height="15" rx="2" fill="#374151" />
                  <text x="140" y="216" fill="white" fontSize="9" fontWeight="500">1,540 kcal</text>
                </g>

                <g>
                  <rect
                    x="260" 
                    y="145"
                    width="130"
                    height="90"
                    rx="8" 
                    fill="white"
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                  <circle cx="280" cy="165" r="12" fill="#E0E7FF" />
                  <path d="M280 160L280 170M275 165L285 165" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                  <text x="295" y="168" fill="#374151" fontSize="10" fontWeight="500">Protein</text>
                  <rect x="275" y="185" width="100" height="10" rx="2" fill="#F3F4F6" />
                  <rect x="275" y="205" width="70" height="15" rx="2" fill="#374151" />
                  <text x="280" y="216" fill="white" fontSize="9" fontWeight="500">65g</text>
                </g>

                <g>
                  <rect
                    x="400"
                    y="145" 
                    width="130"
                    height="90"
                    rx="8"
                    fill="white" 
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                  <circle cx="420" cy="165" r="12" fill="#F3E8FF" />
                  <path d="M415 168C415 168 420 162 425 168M417 164C417 164 420 160 423 164" stroke="#9333EA" strokeWidth="2" strokeLinecap="round"/>
                  <text x="435" y="168" fill="#374151" fontSize="10" fontWeight="500">Carbs</text>
                  <rect x="415" y="185" width="100" height="10" rx="2" fill="#F3F4F6" />
                  <rect x="415" y="205" width="60" height="15" rx="2" fill="#374151" />
                  <text x="420" y="216" fill="white" fontSize="9" fontWeight="500">195g</text>
                </g>

                <g>
                  <rect
                    x="540"
                    y="145" 
                    width="140"
                    height="90"
                    rx="8"
                    fill="white"
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                  <circle cx="560" cy="165" r="12" fill="#D1FAF5" />
                  <path d="M555 165A5 5 0 0 1 565 165A5 5 0 0 1 555 165Z" stroke="#0D9488" strokeWidth="2" />
                  <text x="575" y="168" fill="#374151" fontSize="10" fontWeight="500">Fat</text>
                  <rect x="555" y="185" width="100" height="10" rx="2" fill="#F3F4F6" />
                  <rect x="555" y="205" width="75" height="15" rx="2" fill="#374151" />
                  <text x="560" y="216" fill="white" fontSize="9" fontWeight="500">48g</text>
                </g>

                {/* Chart Area */}
                <rect
                  x="120"
                  y="250"
                  width="300"
                  height="180"
                  rx="8"
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <rect x="140" y="270" width="120" height="15" rx="2" fill="#374151" />
                
                {/* Chart Lines */}
                <path 
                  d="M140 380 L410 380" 
                  stroke="#E5E7EB" 
                  strokeWidth="1" 
                />
                <path 
                  d="M140 340 L410 340" 
                  stroke="#E5E7EB" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                />
                <path 
                  d="M140 300 L410 300" 
                  stroke="#E5E7EB" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                />
                
                {/* Chart Line */}
                <path 
                  d="M160 360 L190 330 L220 350 L250 310 L280 300 L310 320 L340 290 L370 310" 
                  stroke="#6366F1" 
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Chart Points */}
                <circle cx="160" cy="360" r="4" fill="#6366F1" />
                <circle cx="190" cy="330" r="4" fill="#6366F1" />
                <circle cx="220" cy="350" r="4" fill="#6366F1" />
                <circle cx="250" cy="310" r="4" fill="#6366F1" />
                <circle cx="280" cy="300" r="4" fill="#6366F1" />
                <circle cx="310" cy="320" r="4" fill="#6366F1" />
                <circle cx="340" cy="290" r="4" fill="#6366F1" />
                <circle cx="370" cy="310" r="4" fill="#6366F1" />
                
                {/* Chart Labels */}
                <rect x="160" y="390" width="15" height="10" rx="2" fill="#E5E7EB" />
                <rect x="220" y="390" width="15" height="10" rx="2" fill="#E5E7EB" />
                <rect x="280" y="390" width="15" height="10" rx="2" fill="#E5E7EB" />
                <rect x="340" y="390" width="15" height="10" rx="2" fill="#E5E7EB" />

                {/* Progress Area */}
                <rect
                  x="430"
                  y="250"
                  width="250"
                  height="180"
                  rx="8"
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <rect x="450" y="270" width="150" height="15" rx="2" fill="#374151" />
                
                {/* Progress Bar 1 */}
                <rect x="450" y="300" width="210" height="8" rx="4" fill="#F3F4F6" />
                <rect x="450" y="300" width="160" height="8" rx="4" fill="#F97316" />
                <rect x="450" y="315" width="40" height="10" rx="2" fill="#6B7280" />
                
                {/* Progress Bar 2 */}
                <rect x="450" y="335" width="210" height="8" rx="4" fill="#F3F4F6" />
                <rect x="450" y="335" width="145" height="8" rx="4" fill="#4F46E5" />
                <rect x="450" y="350" width="40" height="10" rx="2" fill="#6B7280" />
                
                {/* Progress Bar 3 */}
                <rect x="450" y="370" width="210" height="8" rx="4" fill="#F3F4F6" />
                <rect x="450" y="370" width="180" height="8" rx="4" fill="#0D9488" />
                <rect x="450" y="385" width="40" height="10" rx="2" fill="#6B7280" />
                
                {/* Floating AI Assistant Button */}
                <g>
                  <circle cx="130" cy="430" r="20" fill="url(#gradientButton)" />
                  <path 
                    d="M126 430L130 434L134 426" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </g>

                {/* Gradients */}
                <defs>
                  <linearGradient id="gradientButton" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Why Choose FoodSnap?
            </h2>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600">
              Experience the future of nutrition tracking
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="relative">
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm h-full">
                  <div className={`${benefit.color} mb-3 sm:mb-4`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      {/* <div className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600">
              Choose the plan that&apos;s right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className="relative">
                <div className={`
                  bg-white rounded-2xl p-6 sm:p-8 shadow-sm h-full border-2
                  ${plan.popular ? 'border-indigo-600' : 'border-transparent'}
                `}>
                  {plan.popular && (
                    <span className="absolute top-0 right-6 sm:right-8 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                      Popular
                    </span>
                  )}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {plan.price}
                  </p>
                  <ul className="space-y-3 sm:space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-600 text-sm sm:text-base">
                        <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`
                      mt-6 sm:mt-8 block text-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base
                      ${plan.popular 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}
                    `}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="bg-indigo-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-indigo-100 mb-6 sm:mb-8 text-base sm:text-lg">
              Join thousands of users making healthier choices with FoodSnap
            </p>
            <Link
              href="/register"
              className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
