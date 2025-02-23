"use client";

import { useState } from "react";
import { FaSort, FaFilter, FaPlus } from "react-icons/fa";
import Button from "@/components/Button";
import RecentMeals from "@/components/dashboard/RecentMeals";
import { DetailCard } from "@/components/cards";
import { useRouter } from "next/navigation";

interface MealFilter {
  dateRange?: string;
  mealType?: string;
  calorieRange?: {
    min: number;
    max: number;
  };
}

export default function MealsPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "calories">("date");
  const [filters, setFilters] = useState<MealFilter>({});

  const handleAddMeal = () => {
    router.push("/dashboard/meals/add");
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSortChange = (value: "date" | "calories") => {
    setSortBy(value);
  };

  const filterActions = [
    {
      label: "Reset",
      onClick: () => setFilters({}),
      variant: "secondary" as const
    },
    {
      label: "Apply",
      onClick: () => setIsFilterOpen(false),
      variant: "primary" as const
    }
  ];

  const filterContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <input
            type="date"
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type
          </label>
          <select className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option value="">All Types</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calorie Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meal History</h1>
          <p className="mt-2 text-gray-600">
            Track and analyze your nutritional intake over time
          </p>
        </div>
        <Button
          onClick={handleAddMeal}
          className="flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add New Meal
        </Button>
      </div>

      <div className="space-y-6">
        <DetailCard
          content={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={handleFilterToggle}
                  className="flex items-center gap-2 text-sm"
                >
                  <FaFilter className="w-4 h-4" />
                  Filter
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as "date" | "calories")}
                    className="text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="date">Date</option>
                    <option value="calories">Calories</option>
                  </select>
                </div>
              </div>
            </div>
          }
        />

        {isFilterOpen && (
          <DetailCard
            title="Filters"
            content={filterContent}
            actions={filterActions}
          />
        )}

        <div className="space-y-4">
          <RecentMeals 
            meals={[]} // Will be populated with actual meal data
            onEdit={(meal) => router.push(`/dashboard/meals/edit/${meal.id}`)}
            onDelete={(id) => console.log("Delete meal:", id)}
          />
        </div>
      </div>
    </div>
  );
}
