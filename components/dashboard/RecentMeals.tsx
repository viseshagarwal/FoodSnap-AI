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
  timestamp: string;
  images?: Array<{ id: string; url: string }>;
}

interface RecentMealsProps {
  meals?: Meal[];
  onDelete?: (id: string) => void;
  onEdit?: (meal: Meal) => void;
  showViewAll?: boolean;
}

export default function RecentMeals({ meals = [], onDelete, onEdit, showViewAll = true }: RecentMealsProps) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

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
      }
      router.refresh();
    } catch (error) {
      console.error('Error deleting meal:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatMealInfo = (meal: Meal) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Calories</p>
          <p className="text-lg font-semibold text-gray-900">{meal.calories} kcal</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Protein</p>
          <p className="text-lg font-semibold text-gray-900">{meal.protein}g</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Carbs</p>
          <p className="text-lg font-semibold text-gray-900">{meal.carbs}g</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fat</p>
          <p className="text-lg font-semibold text-gray-900">{meal.fat}g</p>
        </div>
      </div>
      {expandedMeal === meal.id && (
        <div className="pt-4 mt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Added on</p>
          <p className="text-sm text-gray-900">{new Date(meal.timestamp).toLocaleString()}</p>
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

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <DetailCard
          key={meal.id}
          title={meal.name}
          image={meal.images?.[0]?.url || meal.imageUrl || renderPlaceholder()}
          imageAlt={`Photo of ${meal.name}`}
          content={formatMealInfo(meal)}
          actions={[
            {
              label: expandedMeal === meal.id ? "Less" : "More",
              onClick: () => setExpandedMeal(expandedMeal === meal.id ? null : meal.id),
              variant: "secondary"
            },
            onEdit && {
              label: "Edit",
              onClick: () => onEdit(meal),
              variant: "secondary"
            },
            onDelete && {
              label: isDeleting === meal.id ? "Deleting..." : "Delete",
              onClick: () => handleDelete(meal.id),
              variant: "secondary",
              disabled: isDeleting === meal.id
            }
          ].filter(Boolean) as any}
        />
      ))}

      {meals.length === 0 && (
        <DetailCard
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
            className="inline-block mt-4 text-sm font-medium text-teal-600 hover:text-teal-500"
          >
            View All Meals →
          </Link>
        </div>
      )}
    </div>
  );
}
