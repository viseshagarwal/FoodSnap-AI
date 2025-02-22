"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import ImageUpload from "@/components/ImageUpload";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
  images: Array<{ id: string; url: string }>;
}

export default function EditMealPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`/api/meals/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch meal");
        }
        const data = await response.json();
        setMeal(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch meal");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [params.id]);

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : Math.max(0, parseInt(value, 10));
    setMeal((prev) => prev ? { ...prev, [name]: numValue } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meal) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/meals/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update meal");
      }

      router.push("/dashboard/meals");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update meal");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (imageData: { id: string; url: string }) => {
    setMeal((prev) => prev ? {
      ...prev,
      images: [...prev.images, imageData],
    } : null);
  };

  const handleImageDelete = (imageId: string) => {
    setMeal((prev) => prev ? {
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    } : null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Meal Not Found</h1>
          <p className="text-gray-600 mb-6">The meal you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => router.push("/dashboard/meals")}>
            Return to Meals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Meal</h1>
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={meal.name}
                onChange={(e) => setMeal((prev) => prev ? { ...prev, name: e.target.value } : null)}
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter meal name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                  Calories
                </label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  required
                  min="0"
                  value={meal.calories || ""}
                  onChange={handleNumberInput}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  required
                  min="0"
                  value={meal.protein || ""}
                  onChange={handleNumberInput}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  id="carbs"
                  name="carbs"
                  required
                  min="0"
                  value={meal.carbs || ""}
                  onChange={handleNumberInput}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  id="fat"
                  name="fat"
                  required
                  min="0"
                  value={meal.fat || ""}
                  onChange={handleNumberInput}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={meal.notes}
                onChange={(e) => setMeal((prev) => prev ? { ...prev, notes: e.target.value } : null)}
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Add any notes about this meal..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                onImageDelete={handleImageDelete}
                existingImages={meal.images}
                maxImages={5}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}