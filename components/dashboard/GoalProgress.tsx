"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import { FaBullseye, FaFire, FaDumbbell, FaBreadSlice, FaOilCan } from "react-icons/fa";

interface GoalProgress {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface GoalTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function GoalProgress() {
  const router = useRouter();
  const [progress, setProgress] = useState<GoalProgress>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  
  const [target, setTarget] = useState<GoalTarget>({
    calories: 2000,
    protein: 150,
    carbs: 225,
    fat: 55,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active goals
      const goalsResponse = await fetch('/api/goals', {
        credentials: 'include'
      });

      if (goalsResponse.status === 401) {
        router.push('/login');
        return;
      }

      if (!goalsResponse.ok) {
        throw new Error('Failed to fetch goals');
      }

      const goalsData = await goalsResponse.json();
      const activeGoal = goalsData.find((g: any) => g.isActive);

      if (activeGoal) {
        setTarget({
          calories: activeGoal.dailyCalories,
          protein: activeGoal.dailyProtein,
          carbs: activeGoal.dailyCarbs,
          fat: activeGoal.dailyFat,
        });
      }

      // Fetch today's progress
      const mealsResponse = await fetch('/api/meals/recent?days=1', {
        credentials: 'include'
      });

      if (mealsResponse.ok) {
        const mealsData = await mealsResponse.json();
        const totals = mealsData.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
        setProgress({
          calories: totals.calories,
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fat,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculatePercentage = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const getBarColor = (percentage: number) => {
    if (percentage < 25) return "bg-red-500";
    if (percentage < 50) return "bg-orange-500";
    if (percentage < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Goals</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Goals</h3>
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Today's Goals</h3>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400/20 to-indigo-400/20 flex items-center justify-center">
          <FaBullseye className="h-4 w-4 text-teal-500" />
        </div>
      </div>
      <div className="space-y-6">
        {/* Calories */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <FaFire className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Calories</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{progress.calories}</span>
              <span className="text-sm text-gray-500">/ {target.calories}</span>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(calculatePercentage(progress.calories, target.calories))}`}
              style={{ width: `${calculatePercentage(progress.calories, target.calories)}%` }}
            >
              <div className="w-full h-full opacity-30 bg-gradient-to-r from-white/20"></div>
            </div>
          </div>
        </div>

        {/* Protein */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <FaDumbbell className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Protein</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{progress.protein}</span>
              <span className="text-sm text-gray-500">/ {target.protein}g</span>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(calculatePercentage(progress.protein, target.protein))}`}
              style={{ width: `${calculatePercentage(progress.protein, target.protein)}%` }}
            >
              <div className="w-full h-full opacity-30 bg-gradient-to-r from-white/20"></div>
            </div>
          </div>
        </div>

        {/* Carbs */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <FaBreadSlice className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Carbs</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{progress.carbs}</span>
              <span className="text-sm text-gray-500">/ {target.carbs}g</span>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(calculatePercentage(progress.carbs, target.carbs))}`}
              style={{ width: `${calculatePercentage(progress.carbs, target.carbs)}%` }}
            >
              <div className="w-full h-full opacity-30 bg-gradient-to-r from-white/20"></div>
            </div>
          </div>
        </div>

        {/* Fat */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <FaOilCan className="h-4 w-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">Fat</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{progress.fat}</span>
              <span className="text-sm text-gray-500">/ {target.fat}g</span>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(calculatePercentage(progress.fat, target.fat))}`}
              style={{ width: `${calculatePercentage(progress.fat, target.fat)}%` }}
            >
              <div className="w-full h-full opacity-30 bg-gradient-to-r from-white/20"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}