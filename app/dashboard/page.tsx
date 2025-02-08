'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/components/Logo'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Meal {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealTime: string;
}

interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
}

interface WeeklyStats {
  labels: string[];
  calories: number[];
  protein: number[];
  carbs: number[];
  fat: number[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [meals, setMeals] = useState<Meal[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    labels: [],
    calories: [],
    protein: [],
    carbs: [],
    fat: []
  })
  const router = useRouter()

  // Calculate nutrition summary
  const nutritionSummary = meals.reduce((acc: NutritionSummary, meal) => ({
    totalCalories: acc.totalCalories + meal.calories,
    totalProtein: acc.totalProtein + (meal.protein || 0),
    totalCarbs: acc.totalCarbs + (meal.carbs || 0),
    totalFat: acc.totalFat + (meal.fat || 0),
    mealCount: acc.mealCount + 1
  }), {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    mealCount: 0
  })

  // Calculate weekly stats
  useEffect(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    const stats = {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      calories: last7Days.map(date => 
        meals.filter(meal => meal.mealTime.startsWith(date))
          .reduce((sum, meal) => sum + meal.calories, 0)
      ),
      protein: last7Days.map(date => 
        meals.filter(meal => meal.mealTime.startsWith(date))
          .reduce((sum, meal) => sum + (meal.protein || 0), 0)
      ),
      carbs: last7Days.map(date => 
        meals.filter(meal => meal.mealTime.startsWith(date))
          .reduce((sum, meal) => sum + (meal.carbs || 0), 0)
      ),
      fat: last7Days.map(date => 
        meals.filter(meal => meal.mealTime.startsWith(date))
          .reduce((sum, meal) => sum + (meal.fat || 0), 0)
      ),
    }

    setWeeklyStats(stats)
  }, [meals])

  // Chart data
  const chartData = {
    labels: weeklyStats.labels,
    datasets: [
      {
        label: 'Calories',
        data: weeklyStats.calories,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
      },
    ],
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
          // Fetch user's meals
          const mealsRes = await fetch('/api/meals')
          if (mealsRes.ok) {
            const mealsData = await mealsRes.json()
            setMeals(mealsData)
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) return

    setUploadLoading(true)
    try {
      // Upload image and analyze with Gemini API
      // Implementation will be added later
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploadLoading(false)
      setShowUploadModal(false)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        router.push('/login')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Add Meal
              </button>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                  {user?.name?.[0] || user?.email[0]}
                </div>
                <span className="text-gray-700">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'meals', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Nutrition Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Calories</dt>
                        <dd className="text-lg font-medium text-gray-900">{nutritionSummary.totalCalories}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Protein</dt>
                        <dd className="text-lg font-medium text-gray-900">{nutritionSummary.totalProtein}g</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Carbs</dt>
                        <dd className="text-lg font-medium text-gray-900">{nutritionSummary.totalCarbs}g</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Fat</dt>
                        <dd className="text-lg font-medium text-gray-900">{nutritionSummary.totalFat}g</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Progress</h3>
              <div className="h-64">
                <Line data={chartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} />
              </div>
            </div>

            {/* Recent Meals Preview */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Meals</h3>
                <button
                  onClick={() => setActiveTab('meals')}
                  className="text-orange-600 hover:text-orange-700"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.slice(0, 3).map((meal) => (
                  <div key={meal.id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                    <div className="relative h-48 w-full rounded-t-xl overflow-hidden">
                      <Image
                        src={meal.imageUrl}
                        alt={meal.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900">{meal.name}</h4>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{meal.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {meal.calories} kcal
                        </span>
                        <time className="text-xs text-gray-500">
                          {new Date(meal.mealTime).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'meals' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Full Meal List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal) => (
                <div key={meal.id} className="bg-white overflow-hidden shadow-sm rounded-lg border">
                  <div className="relative h-48 w-full">
                    <Image
                      src={meal.imageUrl}
                      alt={meal.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{meal.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{meal.description}</p>
                    <div className="mt-4 flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Calories: {meal.calories}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(meal.mealTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Detailed Analytics Components */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nutrient Distribution</h3>
              {/* Add pie chart for macronutrient distribution */}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Meal Timing Analysis</h3>
              {/* Add time-based analysis */}
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Meal</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleMealSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Food Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading || !selectedImage}
                  className={`bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 ${
                    (uploadLoading || !selectedImage) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadLoading ? 'Analyzing...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 