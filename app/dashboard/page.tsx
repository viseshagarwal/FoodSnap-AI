"use client";
import { Suspense, useEffect, useState } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentMeals from "@/components/dashboard/RecentMeals";
import GoalProgress from "@/components/dashboard/GoalProgress";
import MealSuggestions from "@/components/dashboard/MealSuggestions";
import QuickAdd from "@/components/dashboard/QuickAdd";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative">
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 -z-10 opacity-5">
        <div className="w-96 h-96 bg-gradient-to-r from-teal-300 via-purple-300 to-indigo-300 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-5">
        <div className="w-64 h-64 bg-gradient-to-r from-indigo-300 via-teal-300 to-purple-300 rounded-full blur-3xl animate-float"></div>
      </div>

      <main className="space-y-8 pb-12">
        {/* Header with animated greeting */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100/50 animate-fade-in mb-2">
          <div>
            <div className="relative mb-1">
              <span className="text-sm font-medium text-gray-500 tracking-wide animate-fade-in-up">{getGreeting()}</span>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent pb-1 animate-fade-in">
                {isLoading ? 'Loading...' : user.name || 'Friend'}!
              </h1>
              <div className="absolute -bottom-1 left-0 w-20 h-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full animate-scale-up"></div>
            </div>
            <p className="text-gray-600 mt-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Track your nutrition journey and stay on top of your goals.
            </p>
          </div>
          <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
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

        {/* Stats and Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Suspense fallback={
              <div className="h-64 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex items-center justify-center p-6">
                <LoadingSpinner variant="gradient" size="lg" />
                <span className="ml-3 text-gray-500 font-medium">Loading stats...</span>
              </div>
            }>
              <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden group-hover:border-teal-100/70 transition-all duration-300">
                  <div className="bg-gradient-to-r from-teal-500/5 to-indigo-500/5 p-1">
                    <StatsGrid />
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
        </div>

        {/* Goals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Suspense fallback={
              <div className="h-64 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                <LoadingSpinner variant="pulse" size="md" />
                <span className="mt-3 text-gray-500 text-sm">Loading progress...</span>
              </div>
            }>
              <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden group-hover:border-purple-100/70 transition-all duration-300">
                  <div className="flex items-center px-5 py-3 border-b border-gray-100/80">
                    <div className="h-2 w-2 bg-purple-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-gray-700">Goal Progress</h3>
                  </div>
                  <GoalProgress />
                </div>
              </div>
            </Suspense>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Suspense fallback={
              <div className="h-64 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                <LoadingSpinner variant="wave" size="md" />
                <span className="mt-3 text-gray-500 text-sm">Loading quick add...</span>
              </div>
            }>
              <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden group-hover:border-teal-100/70 transition-all duration-300">
                  <div className="flex items-center px-5 py-3 border-b border-gray-100/80">
                    <div className="h-2 w-2 bg-teal-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-gray-700">Quick Add</h3>
                  </div>
                  <QuickAdd />
                </div>
              </div>
            </Suspense>
          </div>
        </div>

        {/* Enhanced Meal Suggestions Button with animated gradient */}
        <div className="transition-all duration-300 ease-in-out animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Button 
            onClick={handleToggleMealSuggestions}
            className={`w-full py-4 flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-sm transform hover:-translate-y-0.5 ${
              showMealSuggestions 
                ? "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200" 
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
            {!showMealSuggestions && (
              <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                AI
              </span>
            )}
          </Button>
        </div>

        {/* Meal Suggestions Section */}
        {showMealSuggestions && (
          <div className="animate-slide-down">
            <Suspense fallback={
              <div className="h-96 bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <LoadingSpinner variant="gradient" size="lg" className="mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Generating meal suggestions with AI...</p>
                  <p className="text-gray-400 text-sm mt-2">Analyzing your preferences and nutrition goals</p>
                </div>
              </div>
            }>
              <div className="transform transition-all duration-500 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
                <div className="flex items-center px-5 py-3 border-b border-gray-100/80 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                  <div className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-gray-700">AI Meal Suggestions</h3>
                  <div className="ml-auto flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Powered by AI
                    </span>
                  </div>
                </div>
                <MealSuggestions />
              </div>
            </Suspense>
          </div>
        )}

        {/* Recent Meals Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
            <div className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
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
          
          .animate-fade-in {
            animation: fadeIn 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
            opacity: 0;
          }
          
          .animate-fade-in-up {
            animation: fadeIn 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
            opacity: 0;
          }
          
          .animate-slide-down {
            animation: slideDown 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
            overflow: hidden;
          }
          
          .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.1;
            }
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
    </div>
  );
}
