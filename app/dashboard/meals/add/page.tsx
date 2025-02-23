"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import ImageUpload from "@/components/ImageUpload";
import { DetailCard } from "@/components/cards";

interface MealFormData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
  images: Array<{ id: string; url: string }>;
}

interface FormErrors {
  name?: string;
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
}

export default function AddMealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<MealFormData>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: "",
    images: [],
  });

  const validateField = (name: string, value: string | number): string | undefined => {
    if (typeof value === 'string' && !value.trim()) {
      return `${name} is required`;
    }
    
    if (typeof value === 'number') {
      if (isNaN(value)) {
        return `${name} must be a valid number`;
      }
      if (value < 0) {
        return `${name} cannot be negative`;
      }
      if (value > 10000) {
        return `${name} seems unusually high`;
      }
    }
    
    return undefined;
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : Number(value);
    
    setFormData(prev => ({ ...prev, [name]: numValue }));
    
    const error = validateField(name, numValue);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'name') {
      const error = validateField(name, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate required fields
    const fieldsToValidate = {
      name: formData.name,
      calories: formData.calories,
      protein: formData.protein,
      carbs: formData.carbs,
      fat: formData.fat
    };

    Object.entries(fieldsToValidate).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please correct the errors before submitting");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add meal");
      }

      router.push("/dashboard/meals");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imageData: { id: string; url: string }) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageData],
    }));
  };

  const handleImageDelete = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            value={formData.name}
            onChange={handleTextInput}
            className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
              formErrors.name ? 'border-red-300' : ''
            }`}
            placeholder="Enter meal name"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
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
              value={formData.calories || ""}
              onChange={handleNumberInput}
              className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                formErrors.calories ? 'border-red-300' : ''
              }`}
              placeholder="0"
            />
            {formErrors.calories && (
              <p className="mt-1 text-sm text-red-600">{formErrors.calories}</p>
            )}
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
              value={formData.protein || ""}
              onChange={handleNumberInput}
              className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                formErrors.protein ? 'border-red-300' : ''
              }`}
              placeholder="0"
            />
            {formErrors.protein && (
              <p className="mt-1 text-sm text-red-600">{formErrors.protein}</p>
            )}
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
              value={formData.carbs || ""}
              onChange={handleNumberInput}
              className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                formErrors.carbs ? 'border-red-300' : ''
              }`}
              placeholder="0"
            />
            {formErrors.carbs && (
              <p className="mt-1 text-sm text-red-600">{formErrors.carbs}</p>
            )}
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
              value={formData.fat || ""}
              onChange={handleNumberInput}
              className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                formErrors.fat ? 'border-red-300' : ''
              }`}
              placeholder="0"
            />
            {formErrors.fat && (
              <p className="mt-1 text-sm text-red-600">{formErrors.fat}</p>
            )}
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
            value={formData.notes}
            onChange={handleTextInput}
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
            existingImages={formData.images}
            maxImages={5}
          />
        </div>
      </div>
    </form>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Meal</h1>
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          Cancel
        </Button>
      </div>

      <DetailCard
        title="Meal Details"
        description="Enter the details of your meal below. All nutritional values should be in grams."
        content={formContent}
        status={error ? { type: "error", message: error } : undefined}
        actions={[
          {
            label: loading ? "Adding..." : "Add Meal",
            onClick: () => {
              const formElement = document.querySelector('form');
              if (formElement) {
                formElement.requestSubmit();
              }
            },
            variant: "primary"
          }
        ]}
      />
    </div>
  );
}