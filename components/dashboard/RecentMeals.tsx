"use client";

import { useState } from "react";
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
}

interface RecentMealsProps {
  meals?: Meal[];
  onDelete?: (id: string) => void;
  onEdit?: (meal: Meal) => void;
}

export default function RecentMeals({ meals = [], onDelete, onEdit }: RecentMealsProps) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

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
      ? '/images/placeholder-meal.png' // Fallback static image path
      : PlaceholderImage;
    return defaultImg;
  };

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <DetailCard
          key={meal.id}
          title={meal.name}
          image={meal.imageUrl || renderPlaceholder()}
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
              label: "Delete",
              onClick: () => onDelete(meal.id),
              variant: "secondary"
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
    </div>
  );
}
