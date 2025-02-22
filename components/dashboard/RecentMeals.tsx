"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash, FaClock } from "react-icons/fa";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  imageUrl: string;
}

interface RecentMealsProps {
  meals?: Meal[];
  onEdit?: (mealId: string) => void;
  onDelete?: (mealId: string) => void;
}

export default function RecentMeals({ 
  meals = [], 
  onEdit,
  onDelete: onDeleteProp
}: RecentMealsProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = (e: React.MouseEvent, mealId: string) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(mealId);
    } else {
      router.push(`/dashboard/meals/edit/${mealId}`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, meal: Meal) => {
    e.stopPropagation();
    setMealToDelete(meal);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!mealToDelete) return;

    setDeleting(true);
    setError("");

    try {
      if (onDeleteProp) {
        await onDeleteProp(mealToDelete.id);
      } else {
        const response = await fetch(`/api/meals/${mealToDelete.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete meal");
        }

        router.refresh();
      }
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete meal");
    } finally {
      setDeleting(false);
      setMealToDelete(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  if (meals.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">Recent Meals</h2>
          <Link 
            href="/dashboard/meals" 
            className="button-primary text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            View All
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No meals logged yet today</p>
          <Button
            onClick={() => router.push("/dashboard/meals/add")}
            className="button-primary"
          >
            Add Your First Meal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">Recent Meals</h2>
          <Link 
            href="/dashboard/meals" 
            className="button-primary text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            View All
          </Link>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => router.push(`/dashboard/meals/${meal.id}`)}
              onKeyPress={(e) => handleKeyPress(e, () => router.push(`/dashboard/meals/${meal.id}`))}
              tabIndex={0}
              role="button"
              className="card group p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-indigo-50 group-hover:ring-indigo-100 transition-all">
                <Image
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 64px) 100vw, 64px"
                  priority
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {meal.name}
                </h3>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center text-gray-500 space-x-1">
                    <FaClock className="w-4 h-4 text-indigo-400" />
                    <span>{meal.time}</span>
                  </div>
                  <div className="text-indigo-500 font-medium">
                    {meal.calories} cal
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => handleEdit(e, meal.id)}
                  onKeyPress={(e) => handleKeyPress(e, () => handleEdit(e as any, meal.id))}
                  aria-label={`Edit meal ${meal.name}`}
                  className="p-2 text-gray-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(e, meal)}
                  onKeyPress={(e) => handleKeyPress(e, () => handleDeleteClick(e as any, meal))}
                  aria-label={`Delete meal ${meal.name}`}
                  className="p-2 text-gray-400 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  disabled={deleting}
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMealToDelete(null);
          setError("");
        }}
        onConfirm={handleDelete}
        title="Delete Meal"
        message={`Are you sure you want to delete ${mealToDelete?.name}? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        isDestructive={true}
      />
    </>
  );
}
