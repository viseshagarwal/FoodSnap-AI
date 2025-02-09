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
import Pattern from '@/components/Pattern'
import PlaceholderImage from '@/components/PlaceholderImage'
import DashboardNav from '@/components/DashboardNav'
import DashboardFooter from '@/components/DashboardFooter'
import { CaloriesIcon, ProteinIcon, CarbsIcon, FatIcon, CameraIcon, ClockIcon } from '@/components/icons'

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

const features = [
  {
    name: 'Visual Food Recognition',
    description: 'Advanced AI technology that recognizes food items from your photos',
    capabilities: [
      'Instant food identification',
      'Multiple item detection',
      'Portion size estimation',
      'Ingredient breakdown'
    ],
    icon: <CameraIcon className="h-6 w-6" />,
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
    icon: <CaloriesIcon className="h-6 w-6" />,
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
    icon: <ClockIcon className="h-6 w-6" />,
  },
]

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
  const [isUploading, setIsUploading] = useState(false)

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
        borderColor: 'rgb(0,150,136)',
        backgroundColor: 'rgba(0,150,136,0.5)',
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

  const handleUpload = () => {
    setIsUploading(true)
    // Implement upload logic
    setTimeout(() => setIsUploading(false), 2000)
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardNav onLogout={handleLogout} userName={user?.name || 'User'} />
      
      <div className="relative flex-grow">
        <Pattern />
        <main className="relative z-10 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, User!</h1>
              <p className="mt-1 text-gray-500">Track your meals and stay on top of your nutrition goals.</p>
              
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Daily Stats */}
                <div className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CaloriesIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Calories Today</h3>
                      <p className="text-2xl font-semibold text-teal-600">{nutritionSummary.totalCalories} / 2,000</p>
                    </div>
                  </div>
                </div>

                {/* Other Stats */}
                <div className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ProteinIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Protein</h3>
                      <p className="text-2xl font-semibold text-teal-600">{nutritionSummary.totalProtein}g / 120g</p>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CarbsIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Carbs</h3>
                      <p className="text-2xl font-semibold text-teal-600">{nutritionSummary.totalCarbs}g / 250g</p>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FatIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Fat</h3>
                      <p className="text-2xl font-semibold text-teal-600">{nutritionSummary.totalFat}g / 65g</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900">Add a Meal</h2>
              <div className="mt-4">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-teal-300 rounded-xl hover:border-teal-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                      >
                        <span>Upload a photo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Meals */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Meals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentMeals.map((meal) => (
                  <div key={meal.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="relative h-48 w-full">
                      <PlaceholderImage name={meal.name} />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{meal.name}</h3>
                      <p className="text-sm text-gray-500">{meal.calories} calories</p>
                      <div className="mt-2 flex justify-between text-sm text-gray-500">
                        <span>Protein: {meal.protein}g</span>
                        <span>Carbs: {meal.carbs}g</span>
                        <span>Fat: {meal.fat}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <DashboardFooter />
    </div>
  )
}

const recentMeals = [
  {
    id: 1,
    name: 'Grilled Chicken Salad',
    calories: 350,
    protein: 32,
    carbs: 12,
    fat: 18,
  },
  {
    id: 2,
    name: 'Salmon with Quinoa',
    calories: 450,
    protein: 38,
    carbs: 35,
    fat: 22,
  },
  {
    id: 3,
    name: 'Vegetable Stir Fry',
    calories: 280,
    protein: 15,
    carbs: 42,
    fat: 8,
  },
] 