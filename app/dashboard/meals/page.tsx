"use client";

import { useState } from "react";
import { FaSort, FaFilter, FaPlus } from "react-icons/fa";
import Button from "@/components/Button";
import RecentMeals from "@/components/dashboard/RecentMeals";

interface MealFilter {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  minCalories?: number;
  maxCalories?: number;
}

export default function MealsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "calories">("date");
  const [filters, setFilters] = useState<MealFilter>({});

  const handleAddMeal = () => {
    // Will be implemented with router.push("/dashboard/meals/add")
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSortChange = (value: "date" | "calories") => {
    setSortBy(value);
  };

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

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
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

          {isFilterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setFilters({})}
                  className="text-sm"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-sm"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          <RecentMeals 
            meals={[]} // Will be populated with actual meal data
            onEdit={(id) => console.log("Edit meal:", id)}
            onDelete={(id) => console.log("Delete meal:", id)}
          />
        </div>
      </div>
    </div>
  );
}
