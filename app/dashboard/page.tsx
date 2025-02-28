"use client";
import { Suspense, useEffect, useState } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentMeals from "@/components/dashboard/RecentMeals";
import ProfileCard from "@/components/dashboard/ProfileCard";
import GoalProgress from "@/components/dashboard/GoalProgress";
import MealSuggestions from "@/components/dashboard/MealSuggestions";
import QuickAdd from "@/components/dashboard/QuickAdd";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<{name?: string | null}>({});
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <main>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {isLoading ? '...' : user.name || 'Friend'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your nutrition journey and stay on top of your goals.
          </p>
        </div>
        <div>
          <Button 
            onClick={handleAddMeal}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Meal
          </Button>
        </div>
      </div>

      {/* Top Section: Stats Grid and Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading stats...</div>}>
            <StatsGrid />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div>Loading profile...</div>}>
            {/* @ts-ignore */}
            {/* eslint-disable-next-line */}
            <ProfileCard />
          </Suspense>
        </div>
      </div>

      {/* Middle Section: Goal Progress, Quick Add, and Meal Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <Suspense fallback={<div>Loading goals...</div>}>
            <GoalProgress />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div>Loading quick add...</div>}>
            <QuickAdd />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div>Loading suggestions...</div>}>
            <MealSuggestions />
          </Suspense>
        </div>
      </div>

      {/* Bottom Section: Recent Meals */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Meals</h2>
          <Button 
            onClick={() => router.push('/dashboard/meals')}
            className="text-teal-600 hover:text-teal-800"
            variant="secondary"
          >
            View All
          </Button>
        </div>
        <Suspense fallback={<div>Loading meals...</div>}>
          <RecentMeals showViewAll={false} />
        </Suspense>
      </div>
    </main>
  );
}
