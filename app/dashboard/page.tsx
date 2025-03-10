"use client";
import { Suspense, useEffect, useState } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentMeals from "@/components/dashboard/RecentMeals";
import ProfileCardContainer from "@/components/dashboard/ProfileCardContainer";
import GoalProgress from "@/components/dashboard/GoalProgress";
import MealSuggestions from "@/components/dashboard/MealSuggestions";
import QuickAdd from "@/components/dashboard/QuickAdd";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<{name?: string | null}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showMealSuggestions, setShowMealSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleAddMeal = () => {
    router.push("/dashboard/meals/add");
  };

  const handleToggleMealSuggestions = () => {
    setShowMealSuggestions(!showMealSuggestions);
  };

  return (
    <main className="space-y-8">
      {/* Header with animated greeting */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
        <div className="animate-fadeIn">
          <div className="relative">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent pb-1">
              Welcome back, {isLoading ? '...' : user.name || 'Friend'}!
            </h1>
            <div className="absolute -bottom-1 left-0 w-16 h-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-3">
            Track your nutrition journey and stay on top of your goals.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button 
            onClick={handleAddMeal}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Meal
          </Button>
        </div>
      </div>

      {/* Dashboard card grid with hover effects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fadeIn">
          <Suspense fallback={
            <div className="h-64 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex items-center justify-center p-6">
              <LoadingSpinner variant="gradient" size="lg" />
              <span className="ml-3 text-gray-500 font-medium">Loading stats...</span>
            </div>
          }>
            <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg">
              <StatsGrid />
            </div>
          </Suspense>
        </div>
        <div className="animate-fadeIn animation-delay-100">
          <Suspense fallback={
            <div className="h-64 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <LoadingSpinner variant="rings" size="md" />
              <span className="mt-3 text-gray-500 text-sm">Loading profile...</span>
            </div>
          }>
            <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg">
              <ProfileCardContainer />
            </div>
          </Suspense>
        </div>
      </div>

      {/* Middle Section with improved card design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-fadeIn animation-delay-200">
          <Suspense fallback={
            <div className="h-64 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <LoadingSpinner variant="pulse" size="md" />
              <span className="mt-3 text-gray-500 text-sm">Loading progress...</span>
            </div>
          }>
            <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg">
              <GoalProgress />
            </div>
          </Suspense>
        </div>
        <div className="animate-fadeIn animation-delay-300">
          <Suspense fallback={
            <div className="h-64 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <LoadingSpinner variant="wave" size="md" />
              <span className="mt-3 text-gray-500 text-sm">Loading quick add...</span>
            </div>
          }>
            <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg">
              <QuickAdd />
            </div>
          </Suspense>
        </div>
      </div>

      {/* Enhanced Meal Suggestions Button with animated gradient */}
      <div className="transition-all duration-300 ease-in-out animate-fadeIn animation-delay-400">
        <Button 
          onClick={handleToggleMealSuggestions}
          className={`w-full py-4 flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-sm transform hover:shadow ${
            showMealSuggestions 
              ? "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200" 
              : "bg-gradient-to-r from-teal-500 via-teal-400 to-indigo-500 hover:from-teal-600 hover:via-teal-500 hover:to-indigo-600 text-white"
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            {showMealSuggestions ? (
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            )}
          </svg>
          <span className="font-medium">{showMealSuggestions ? "Hide Meal Suggestions" : "Show AI Meal Suggestions"}</span>
        </Button>
      </div>

      {/* Meal Suggestions Section with improved animation */}
      {showMealSuggestions && (
        <div className="animate-slideDown">
          <Suspense fallback={
            <div className="h-96 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner variant="gradient" size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Generating meal suggestions with AI...</p>
                <p className="text-gray-400 text-sm mt-2">Analyzing your preferences and nutrition goals</p>
              </div>
            </div>
          }>
            <div className="transform transition-all duration-500">
              <MealSuggestions />
            </div>
          </Suspense>
        </div>
      )}

      {/* Bottom Section: Recent Meals with decorative elements */}
      <div className="animate-fadeIn animation-delay-500">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-teal-500 to-indigo-500 rounded-full"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Recent Meals
            </h2>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/meals')}
            className="text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 hover:bg-teal-50 px-3 py-1 rounded-lg transition-all"
            variant="secondary"
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
        <Suspense fallback={
          <div className="w-full h-64 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex flex-col items-center justify-center p-6">
            <LoadingSpinner variant="dots" size="md" className="mb-4" />
            <p className="text-gray-600 text-center font-medium">Loading your recent meals...</p>
          </div>
        }>
          <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg">
            <RecentMeals 
              showViewAll={false} 
              days={3}  // Show meals from the last 3 days
              limit={5}  // Show up to 5 recent meals
            />
          </div>
        </Suspense>
      </div>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; transform: translateY(-20px); }
          to { opacity: 1; max-height: 2000px; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
          opacity: 0;
        }

        .animate-slideDown {
          animation: slideDown 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
          overflow: hidden;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .shimmer-bg {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </main>
  );
}
