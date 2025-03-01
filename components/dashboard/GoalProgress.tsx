"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
  };

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
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Goals</h3>
      <div className="space-y-4">
        {/* Calories */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Calories</span>
            <span className="text-xs text-gray-500">{progress.calories} / {target.calories} kcal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${getBarColor(calculatePercentage(progress.calories, target.calories))}`}
              style={{ width: `${calculatePercentage(progress.calories, target.calories)}%` }}
            ></div>
          </div>
        </div>

        {/* Protein */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Protein</span>
            <span className="text-xs text-gray-500">{progress.protein} / {target.protein}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${getBarColor(calculatePercentage(progress.protein, target.protein))}`}
              style={{ width: `${calculatePercentage(progress.protein, target.protein)}%` }}
            ></div>
          </div>
        </div>

        {/* Carbs */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Carbs</span>
            <span className="text-xs text-gray-500">{progress.carbs} / {target.carbs}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${getBarColor(calculatePercentage(progress.carbs, target.carbs))}`}
              style={{ width: `${calculatePercentage(progress.carbs, target.carbs)}%` }}
            ></div>
          </div>
        </div>

        {/* Fat */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Fat</span>
            <span className="text-xs text-gray-500">{progress.fat} / {target.fat}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${getBarColor(calculatePercentage(progress.fat, target.fat))}`}
              style={{ width: `${calculatePercentage(progress.fat, target.fat)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
}