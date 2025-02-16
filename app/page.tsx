import { Metadata } from 'next'
import Link from 'next/link'
import { FaCamera, FaChartLine, FaHistory, FaCheck, FaApple, FaHeartbeat, FaBrain, FaUserFriends } from 'react-icons/fa'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FoodSnap - AI-Powered Food Analysis',
  description: 'Track your nutrition with AI-powered food analysis. Simply snap a photo of your meal and get instant nutritional information.',
}

interface Feature {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const features: Feature[] = [
  {
    name: 'Visual Food Recognition',
    description: 'Take a photo of your meal and let our AI instantly identify and analyze your food.',
    icon: <FaCamera className="w-6 h-6" />,
    color: 'text-orange-500'
  },
  {
    name: 'Smart Nutrition Tracking',
    description: 'Get detailed nutritional information including calories, protein, carbs, and fat.',
    icon: <FaChartLine className="w-6 h-6" />,
    color: 'text-indigo-500'
  },
  {
    name: 'Meal History & Insights',
    description: 'Track your nutrition journey with detailed meal history and personalized insights.',
    icon: <FaHistory className="w-6 h-6" />,
    color: 'text-purple-500'
  },
]

const benefits = [
  {
    icon: <FaHeartbeat className="w-6 h-6" />,
    title: 'Better Health Choices',
    description: 'Make informed decisions about your nutrition with accurate, real-time data.',
    color: 'text-pink-500'
  },
  {
    icon: <FaBrain className="w-6 h-6" />,
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations based on your eating habits and goals.',
    color: 'text-indigo-500'
  },
  {
    icon: <FaApple className="w-6 h-6" />,
    title: 'Comprehensive Database',
    description: 'Access nutritional information for thousands of foods and recipes.',
    color: 'text-green-500'
  },
  {
    icon: <FaUserFriends className="w-6 h-6" />,
    title: 'Community Support',
    description: 'Join a community of health-conscious individuals on their nutrition journey.',
    color: 'text-orange-500'
  }
]

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    features: [
      'Visual food recognition',
      'Basic nutritional information',
      'Daily meal logging',
      'Basic analytics'
    ]
  },
  {
    name: 'Pro',
    price: '$9.99/mo',
    features: [
      'Everything in Basic',
      'Detailed macro tracking',
      'Meal recommendations',
      'Advanced analytics',
      'Priority support'
    ],
    popular: true
  },
  {
    name: 'Team',
    price: '$19.99/mo',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom meal plans',
      'API access',
      'Dedicated support'
    ]
  }
]

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
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Track Your Nutrition with
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 bg-clip-text text-transparent"> AI</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Simply snap a photo of your meal and get instant nutritional information. Make healthier choices with AI-powered food analysis.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all text-sm sm:text-base"
              >
                Start Free Trial
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-3 text-gray-600 hover:text-gray-900 rounded-lg font-medium transition-all text-sm sm:text-base"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div 
                  key={feature.name}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-sm transition-all">
                    <div className={`${feature.color} mb-5`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600">
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
      <div className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Simplify Your Nutrition Journey
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Get accurate nutritional information in seconds
            </p>
          </div>
          
          <div className="relative mx-auto max-w-5xl">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
              {/* App Interface SVG */}
              <svg className="w-full h-full" viewBox="0 0 800 500" fill="none">
                <rect x="100" y="50" width="600" height="400" rx="16" fill="white" className="shadow-2xl"/>
                <rect x="120" y="70" width="200" height="40" rx="8" fill="#EEF2FF"/>
                <rect x="120" y="130" width="560" height="100" rx="8" fill="#F5F3FF"/>
                <rect x="120" y="250" width="270" height="180" rx="8" fill="#FEF3F2"/>
                <rect x="410" y="250" width="270" height="180" rx="8" fill="#ECFDF5"/>
                <circle cx="150" cy="90" r="10" fill="#6366F1"/>
                <path d="M146 90L149 93L154 88" stroke="white" strokeWidth="2"/>
                <rect x="140" y="150" width="520" height="60" rx="4" fill="white"/>
                <circle cx="170" cy="180" r="15" fill="#818CF8"/>
                <rect x="200" y="170" width="120" height="8" rx="4" fill="#6366F1"/>
                <rect x="200" y="182" width="80" height="6" rx="3" fill="#A5B4FC"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose FoodSnap?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Experience the future of nutrition tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                  <div className={`${benefit.color} mb-4`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className="relative">
                <div className={`
                  bg-white rounded-2xl p-8 shadow-sm h-full border-2
                  ${plan.popular ? 'border-indigo-600' : 'border-transparent'}
                `}>
                  {plan.popular && (
                    <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                      Popular
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-6">
                    {plan.price}
                  </p>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-600">
                        <FaCheck className="w-5 h-5 text-indigo-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`
                      mt-8 block text-center px-6 py-3 rounded-lg font-medium transition-all
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
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Join thousands of users making healthier choices with FoodSnap
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 