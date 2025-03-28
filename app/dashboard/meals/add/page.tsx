"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import ImageUpload from "@/components/ImageUpload";
import { DetailCard } from "@/components/cards";
import Image from "next/image";

interface MealFormData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
  mealType: string;
  images: Array<{ id: string; url: string }>;
  ingredients: string[];
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
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'upload' | 'form'>('upload');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<MealFormData>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: "",
    mealType: "SNACK",
    images: [],
    ingredients: []
  });

  useEffect(() => {
    // Handle prefilled data from meal suggestions
    const prefillData = searchParams.get('prefill');
    if (prefillData) {
      try {
        const parsed = JSON.parse(prefillData);
        setFormData(prev => ({
          ...prev,
          ...parsed
        }));
        setStep('form'); // Skip to form step since we have data
      } catch (err) {
        console.error('Error parsing prefill data:', err);
      }
    }
  }, [searchParams]);

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
        credentials: "include", // Add this line to include auth cookies
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add meal");
      }

      // Redirect to the main dashboard instead of meals page
      router.push("/dashboard/meals");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (imageData: { id: string; url: string }) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageData],
    }));
  };

  const handleImageDelete = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId),
    }));
  };

  const handleAnalyze = async () => {
    if (formData.images.length === 0) {
      setError("Please upload an image first");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const imageUrl = formData.images[0].url;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const analysisFormData = new FormData();
      analysisFormData.append('image', blob, 'food.jpg');

      const analysisResponse = await fetch('/api/gemini', {
        method: 'POST',
        credentials: 'include', // Add this line to include auth cookies
        body: analysisFormData,
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze image');
      }

      const analysis = await analysisResponse.json();
      
      setFormData(prev => ({
        ...prev,
        name: analysis.name || prev.name,
        calories: analysis.calories || prev.calories,
        protein: analysis.protein || prev.protein,
        carbs: analysis.carbs || prev.carbs,
        fat: analysis.fat || prev.fat,
        ingredients: analysis.ingredients || prev.ingredients
      }));

      setStep('form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  const uploadContent = (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-teal-50 to-indigo-50 p-6 rounded-xl border border-gray-100">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="max-w-sm mx-auto ring-1 ring-gray-200 rounded-xl overflow-hidden">
            <ImageUpload
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
              existingImages={formData.images}
              maxImages={1}
            />
          </div>
        </div>
      </div>
      {formData.images.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 min-w-[200px] justify-center bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Analyze Image
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      {formData.images.length > 0 && (
        <div className="relative h-48 w-full sm:h-64 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 hover:shadow-md">
          <Image
            src={formData.images[0].url}
            alt="Uploaded food"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
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
                className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 ${
                  formErrors.name ? 'border-red-300 ring-1 ring-red-300' : ''
                }`}
                placeholder="Enter meal name"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={(e) => setFormData(prev => ({ ...prev, mealType: e.target.value }))}
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACK">Snack</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                Calories
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  required
                  min="0"
                  value={formData.calories || ""}
                  onChange={handleNumberInput}
                  className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-12 transition-all duration-300 ${
                    formErrors.calories ? 'border-red-300 ring-1 ring-red-300' : ''
                  }`}
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">kcal</span>
              </div>
              {formErrors.calories && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{formErrors.calories}</p>
              )}
            </div>

            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                Protein
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  required
                  min="0"
                  value={formData.protein || ""}
                  onChange={handleNumberInput}
                  className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8 transition-all duration-300 ${
                    formErrors.protein ? 'border-red-300 ring-1 ring-red-300' : ''
                  }`}
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">g</span>
              </div>
              {formErrors.protein && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{formErrors.protein}</p>
              )}
            </div>

            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                Carbs
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="carbs"
                  name="carbs"
                  required
                  min="0"
                  value={formData.carbs || ""}
                  onChange={handleNumberInput}
                  className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8 transition-all duration-300 ${
                    formErrors.carbs ? 'border-red-300 ring-1 ring-red-300' : ''
                  }`}
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">g</span>
              </div>
              {formErrors.carbs && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{formErrors.carbs}</p>
              )}
            </div>

            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                Fat
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="fat"
                  name="fat"
                  required
                  min="0"
                  value={formData.fat || ""}
                  onChange={handleNumberInput}
                  className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8 transition-all duration-300 ${
                    formErrors.fat ? 'border-red-300 ring-1 ring-red-300' : ''
                  }`}
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">g</span>
              </div>
              {formErrors.fat && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{formErrors.fat}</p>
              )}
            </div>
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
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
            placeholder="Add any notes about this meal..."
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="transition-all duration-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[120px] bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Adding...
            </>
          ) : (
            'Add Meal'
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Add New Meal
          </h1>
          <p className="mt-2 text-gray-600">
            {step === 'upload' 
              ? 'Upload a photo of your meal for quick analysis, or add details manually.'
              : 'Review and adjust the meal details below.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <DetailCard
            title={step === 'upload' ? "Upload Food Image" : "Meal Details"}
            description={
              step === 'upload' 
                ? "Upload a picture of your meal to get started. We'll analyze it for you."
                : "Review and edit the analyzed meal details below."
            }
            content={step === 'upload' ? uploadContent : formContent}
            status={error ? { type: "error", message: error } : undefined}
            className="animate-fade-in"
          />
        </div>
      </div>
    </div>
  );
}