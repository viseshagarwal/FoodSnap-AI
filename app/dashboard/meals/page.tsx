"use client";

import { useState, useEffect } from "react";
import { FaSort, FaFilter, FaPlus } from "react-icons/fa";
import Button from "@/components/Button";
import RecentMeals from "@/components/dashboard/RecentMeals";
import { DetailCard } from "@/components/cards";
import { useRouter } from "next/navigation";

interface MealFilter {
  dateRange?: string;
  mealType?: string;
  calorieRange?: {
    min?: number;
    max?: number;
  };
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  mealTime: string;
  images: Array<{ id: string; url: string }>;
}

export default function MealsPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"mealTime" | "calories">("mealTime");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MealFilter>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMeals = async (reset = false) => {
    try {
      const newPage = reset ? 1 : page;
      const params = new URLSearchParams({
        page: newPage.toString(),
        sortBy,
        order,
        ...(filters.mealType && { type: filters.mealType }),
        ...(filters.calorieRange?.min && { minCalories: filters.calorieRange.min.toString() }),
        ...(filters.calorieRange?.max && { maxCalories: filters.calorieRange.max.toString() }),
        ...(filters.dateRange && { from: new Date(filters.dateRange).toISOString() })
      });

      const response = await fetch(`/api/meals?${params}`);
      if (!response.ok) throw new Error('Failed to fetch meals');
      
      const data = await response.json();
      const newMeals = data.meals;
      const total = data.pagination.total;

      setMeals(prev => reset ? newMeals : [...prev, ...newMeals]);
      setHasMore(newPage * 10 < total);
      if (!reset) setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals(true);
  }, [sortBy, order, filters]);

  const handleAddMeal = () => {
    router.push("/dashboard/meals/add");
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSortChange = (value: "mealTime" | "calories") => {
    setSortBy(value);
  };

  const handleDeleteMeal = async (id: string) => {
    const response = await fetch(`/api/meals/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setMeals(prev => prev.filter(meal => meal.id !== id));
    }
  };

  const filterActions = [
    {
      label: "Reset",
      onClick: () => {
        setFilters({});
        setIsFilterOpen(false);
      },
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
            value={filters.dateRange || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type
          </label>
          <select 
            value={filters.mealType || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, mealType: e.target.value }))}
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACK">Snack</option>
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
              value={filters.calorieRange?.min || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                calorieRange: { ...prev.calorieRange, min: parseInt(e.target.value) }
              }))}
              className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.calorieRange?.max || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                calorieRange: { ...prev.calorieRange, max: parseInt(e.target.value) }
              }))}
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
                    onChange={(e) => handleSortChange(e.target.value as "mealTime" | "calories")}
                    className="text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="mealTime">Date</option>
                    <option value="calories">Calories</option>
                  </select>
                  <Button
                    variant="secondary"
                    onClick={() => setOrder(prev => prev === "asc" ? "desc" : "asc")}
                    className="p-1"
                  >
                    <FaSort className={`w-4 h-4 transform ${order === "desc" ? "rotate-180" : ""}`} />
                  </Button>
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
            meals={meals.map(meal => ({
              ...meal,
              timestamp: meal.mealTime,
              imageUrl: meal.images?.[0]?.url
            }))}
            onEdit={(meal) => router.push(`/dashboard/meals/edit/${meal.id}`)}
            onDelete={handleDeleteMeal}
            showViewAll={false}
          />
          
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )}
          
          {!loading && hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="secondary"
                onClick={() => fetchMeals()}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
