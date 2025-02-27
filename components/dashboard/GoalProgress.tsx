"use client";
import { useState, useEffect } from "react";
import Card from "@/components/Card";

interface GoalProgress {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface GoalTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export default function GoalProgress() {
  const [progress, setProgress] = useState<GoalProgress>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  });
  
  const [target, setTarget] = useState<GoalTarget>({
    calories: 2000,
    protein: 150,
    carbs: 225,
    fat: 55,
    water: 8,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an actual API call to fetch user's daily progress
    // For demonstration, using dummy data
    const fetchProgress = async () => {
      setLoading(true);
      try {
        // Simulate API call with dummy data
        setTimeout(() => {
          setProgress({
            calories: 1200,
            protein: 75,
            carbs: 135,
            fat: 30,
            water: 5,
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

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
          {[1, 2, 3, 4, 5].map((i) => (
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
              className={`h-2.5 rounded-full ${getBarColor(calculatePercentage(progress.calories, target.calories))}`}
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
              className={`h-2.5 rounded-full ${getBarColor(calculatePercentage(progress.protein, target.protein))}`}
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
              className={`h-2.5 rounded-full ${getBarColor(calculatePercentage(progress.carbs, target.carbs))}`}
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
              className={`h-2.5 rounded-full ${getBarColor(calculatePercentage(progress.fat, target.fat))}`}
              style={{ width: `${calculatePercentage(progress.fat, target.fat)}%` }}
            ></div>
          </div>
        </div>

        {/* Water */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Water</span>
            <span className="text-xs text-gray-500">{progress.water} / {target.water} glasses</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getBarColor(calculatePercentage(progress.water, target.water))}`}
              style={{ width: `${calculatePercentage(progress.water, target.water)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
}