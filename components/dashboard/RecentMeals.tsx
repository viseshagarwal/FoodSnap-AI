"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash, FaClock } from "react-icons/fa";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { DetailCard } from '@/components/cards';
import PlaceholderImage from '@/components/PlaceholderImage';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  timestamp?: string;
  mealTime?: string;
  images?: Array<{ id: string; url: string }>;
}

interface RecentMealsProps {
  meals?: Meal[];
  onDelete?: (id: string) => void;
  onEdit?: (meal: Meal) => void;
  showViewAll?: boolean;
  days?: number;
  limit?: number;
}

export default function RecentMeals({ 
  meals: propMeals, 
  onDelete, 
  onEdit, 
  showViewAll = true,
  days = 1,
  limit = 5
}: RecentMealsProps) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedMeals, setFetchedMeals] = useState<Meal[]>([]);
  const router = useRouter();

  // Use either provided meals or fetch them
  const meals = propMeals || fetchedMeals;

  useEffect(() => {
    // Only fetch if no meals were provided as props
    if (!propMeals) {
      fetchRecentMeals();
    }
  }, [propMeals, days, limit]);

  const fetchRecentMeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/meals/recent?days=${days}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent meals');
      }
      
      const data = await response.json();
      setFetchedMeals(data.meals.map((meal: any) => ({
        ...meal,
        timestamp: meal.mealTime || meal.timestamp
      })));
    } catch (error) {
      console.error('Error fetching recent meals:', error);
      setError('Could not load recent meals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      const response = await fetch(`/api/meals/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }
      if (onDelete) {
        onDelete(id);
      } else {
        // If no onDelete handler is provided, refetch meals
        fetchRecentMeals();
      }
      router.refresh();
    } catch (error) {
      console.error('Error deleting meal:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatMealInfo = (meal: Meal) => (
    <div className="space-y-1">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-gray-500">Calories</p>
          <p className="text-sm font-semibold text-gray-900">{meal.calories} kcal</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Protein</p>
          <p className="text-sm font-semibold text-gray-900">{meal.protein}g</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Carbs</p>
          <p className="text-sm font-semibold text-gray-900">{meal.carbs}g</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Fat</p>
          <p className="text-sm font-semibold text-gray-900">{meal.fat}g</p>
        </div>
      </div>
      {expandedMeal === meal.id && (
        <div className="pt-2 mt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">Added on</p>
          <p className="text-xs text-gray-900">{new Date(meal.timestamp || meal.mealTime || '').toLocaleString()}</p>
        </div>
      )}
    </div>
  );

  const renderPlaceholder = () => {
    const defaultImg = typeof PlaceholderImage === 'function' 
      ? '/images/placeholder-meal.png'
      : PlaceholderImage;
    return defaultImg;
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 border border-gray-200 rounded-lg shadow-sm">
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <DetailCard
        status={{
          type: "error",
          message: error
        }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {meals.length > 0 ? (
        meals.map((meal) => (
          <DetailCard
            key={meal.id}
            title={meal.name}
            titleClassName="text-sm font-medium"
            image={meal.images?.[0]?.url || meal.imageUrl || renderPlaceholder()}
            imageAlt={`Photo of ${meal.name}`}
            imageClassName="h-14 w-14 rounded-md object-cover"
            className="p-3 border border-gray-100"
            contentClassName="py-1"
            content={formatMealInfo(meal)}
            actions={[
              {
                label: expandedMeal === meal.id ? "Less" : "More",
                onClick: () => setExpandedMeal(expandedMeal === meal.id ? null : meal.id),
                variant: "secondary",
                className: "text-xs py-1 px-2"
              },
              onEdit && {
                label: "Edit",
                onClick: () => onEdit(meal),
                variant: "secondary",
                className: "text-xs py-1 px-2"
              },
              {
                label: isDeleting === meal.id ? "..." : "Delete",
                onClick: () => handleDelete(meal.id),
                variant: "secondary",
                className: "text-xs py-1 px-2",
                disabled: isDeleting === meal.id
              }
            ].filter(Boolean) as any}
            actionsClassName="gap-1 mt-1"
          />
        ))
      ) : (
        <DetailCard
          className="p-3"
          status={{
            type: "info",
            message: "No meals logged yet today. Add your first meal to start tracking!"
          }}
        />
      )}
      {showViewAll && meals.length > 0 && (
        <div className="text-center">
          <Link 
            href="/dashboard/meals"
            className="inline-block mt-3 text-xs font-medium text-teal-600 hover:text-teal-500"
          >
            View All Meals →
          </Link>
        </div>
      )}
    </div>
  );
}
