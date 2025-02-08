import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/components/Logo'
import PlaceholderImage from '@/components/PlaceholderImage'
import Pattern from '@/components/Pattern'

export const metadata: Metadata = {
  title: 'FoodSnap - AI-Powered Food Analysis',
  description: 'Track your nutrition with AI-powered food analysis. Simply snap a photo of your meal and get instant nutritional information.',
}

interface Feature {
  name: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    name: 'Visual Food Recognition',
    description: 'Advanced AI technology that recognizes food items from your photos',
    capabilities: [
      'Instant food identification',
      'Multiple item detection',
      'Portion size estimation',
      'Ingredient breakdown'
    ],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    name: 'Nutrition Tracking',
    description: 'Track calories, protein, carbs, and fat with detailed nutritional information.',
    capabilities: [
      'Automatic calorie calculation',
      'Macronutrient breakdown',
      'Daily nutrition summary',
      'Weekly progress reports'
    ],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Meal History',
    description: 'View your meal history and track your nutrition trends over time.',
    capabilities: [
      'Detailed meal logs',
      'Search and filter meals',
      'Meal categorization',
      'Favorite meals'
    ],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <Pattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 py-20 md:py-28 lg:py-32">
            <div className="sm:text-center lg:text-left lg:col-span-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                <span className="block text-gray-900 animate-fade-in">Track Your Meals,</span>
                <span className="block bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent animate-fade-in-up">
                  Know Your Nutrition
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl lg:max-w-none animate-fade-in-up delay-200">
                Simply snap a photo of your meal and let our AI instantly calculate calories and nutrients. Make informed food choices effortlessly.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                <Link
                  href="/register"
                  className="px-8 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Start Tracking Free
                </Link>
                <Link
                  href="/how-it-works"
                  className="px-8 py-3 bg-white text-amber-600 rounded-xl font-medium border-2 border-amber-200 hover:border-amber-300 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  See How It Works
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 animate-fade-in-left">
              <div className="relative">
                <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-100/20 backdrop-blur-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto mb-6 text-emerald-500">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-900">Snap Your Meal</p>
                      <p className="mt-2 text-sm text-gray-600">Take a photo of your food and get instant nutritional information</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -left-8 animate-float">
                  <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Instant Analysis</p>
                      <p className="text-xs text-gray-500">AI-powered results in seconds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-rose-500 tracking-wide uppercase">Why Choose FoodSnap</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Smart Food Tracking Made Simple
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Get accurate nutritional information without the hassle of manual logging
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{benefit.name}</h3>
                <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section with Screenshots */}
      <div className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Powerful Features for Better Health
            </h2>
          </div>

          {features.map((feature, index) => (
            <div key={feature.name} className={`mt-20 flex flex-col-reverse lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
              <div className="mt-10 lg:mt-0">
                <h3 className="text-2xl font-extrabold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  {feature.description}
                </p>
                <ul className="mt-8 space-y-5">
                  {feature.capabilities.map((capability) => (
                    <li key={capability} className="flex items-center">
                      <span className="flex-shrink-0 w-5 h-5 text-rose-500">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="ml-3 text-base text-gray-500">{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                  {/* Replace with actual feature screenshots */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-rose-100/20 backdrop-blur-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 text-amber-500">
                        {feature.icon}
                      </div>
                      <p className="text-sm text-gray-600">Feature Screenshot</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              What Our Users Say
            </h2>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-amber-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-600">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-rose-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start tracking?</span>
            <span className="block text-amber-200">Join thousands of happy users today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-rose-600 bg-white hover:bg-amber-50"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <Logo className="h-6 w-6" />
              <p className="mt-4 text-sm text-gray-500">
                &copy; 2024 FoodSnap. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const benefits = [
  {
    name: 'Instant Analysis',
    description: 'Get nutritional information in seconds just by taking a photo of your meal.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: 'Accurate Results',
    description: 'Our AI provides precise calorie and nutrient calculations based on visual analysis.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Easy Tracking',
    description: 'Keep track of your daily intake without the hassle of manual logging.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    quote: 'FoodSnap has made tracking my meals so much easier. No more guessing calories!',
  },
] 