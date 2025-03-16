"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { DetailCard } from "@/components/cards";
import LoadingSpinner from "@/components/LoadingSpinner";

interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

interface MealSuggestion {
  type: string;
  name: string;
  calories: number;
  description: string;
  ingredients: string[];
  macros: MacroNutrients;
}

export default function MealSuggestions() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); // For manual refresh

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/gemini/suggestions', {
        credentials: 'include'
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch meal suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error('Error fetching meal suggestions:', err);
      setError('Could not load meal suggestions');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSuggestions();
  }, [refreshKey, fetchSuggestions]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); // Trigger a refresh
  };

  const handleQuickAdd = (suggestion: MealSuggestion) => {
    router.push(`/dashboard/meals/add?prefill=${encodeURIComponent(JSON.stringify({
      name: suggestion.name,
      calories: suggestion.calories,
      protein: suggestion.macros.protein,
      carbs: suggestion.macros.carbs,
      fat: suggestion.macros.fat,
      mealType: suggestion.type.toUpperCase(),
      notes: `Ingredients: ${suggestion.ingredients.join(", ")}`
    }))}`);
  };

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Meal Suggestions</h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Meal Suggestions</h3>
        <DetailCard
          status={{
            type: "error",
            message: error
          }}
        />
      </Card>
    );
  }

  return (
    <Card className="p-4 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-800">Meal Suggestions</h3>
        <Button 
          variant="secondary"
          onClick={handleRefresh}
          className="text-sm"
        >
          Refresh
        </Button>
      </div>
      <div className="space-y-4 overflow-y-auto flex-grow pr-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium uppercase text-gray-500">{suggestion.type}</span>
              <span className="text-xs font-medium text-teal-600">{suggestion.calories} kcal</span>
            </div>
            <h4 className="font-medium text-gray-800">{suggestion.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {suggestion.ingredients.map((ingredient, i) => (
                <span 
                  key={i} 
                  className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                >
                  {ingredient}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-3">
                <div className="text-xs text-gray-500">
                  P: <span className="font-medium">{suggestion.macros.protein}g</span>
                </div>
                <div className="text-xs text-gray-500">
                  C: <span className="font-medium">{suggestion.macros.carbs}g</span>
                </div>
                <div className="text-xs text-gray-500">
                  F: <span className="font-medium">{suggestion.macros.fat}g</span>
                </div>
              </div>
              <Button
                variant="secondary"
                className="text-xs py-1 px-3"
                onClick={() => handleQuickAdd(suggestion)}
              >
                Quick Add
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}