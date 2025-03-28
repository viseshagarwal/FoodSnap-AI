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
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-teal-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-300 to-indigo-300 opacity-50"></div>
          </div>
        </div>
        <p className="text-gray-700 font-medium">Generating personalized meal ideas...</p>
        <p className="text-gray-500 text-sm mt-1">Using Gemini Pro Vision to analyze your preferences</p>
      </div>
    );
  }

  if (error) {
    // Check if the error is related to rate limiting
    const isRateLimitError = error.toLowerCase().includes('quota') || 
                             error.toLowerCase().includes('rate limit') ||
                             error.toLowerCase().includes('too many requests');
    
    return (
      <div className="p-6">
        <div className={`${isRateLimitError ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'} border rounded-xl p-4 text-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" 
               className={`h-10 w-10 mx-auto ${isRateLimitError ? 'text-amber-400' : 'text-red-400'} mb-2`} 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            <path strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isRateLimitError 
                     ? "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                     : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
          </svg>
          <h3 className={`${isRateLimitError ? 'text-amber-800' : 'text-red-800'} font-medium mb-1`}>
            {isRateLimitError ? 'AI Service Currently Busy' : 'AI Suggestion Error'}
          </h3>
          <p className={`${isRateLimitError ? 'text-amber-600' : 'text-red-600'} text-sm`}>
            {isRateLimitError 
              ? "We've reached our AI quota limit. Please try again in a few minutes." 
              : error}
          </p>
          {isRateLimitError && (
            <p className="text-amber-600 text-xs mt-2">
              The Gemini AI service has a limit on the number of requests we can make per minute.
            </p>
          )}
          <Button 
            onClick={handleRefresh}
            className={`mt-3 ${isRateLimitError 
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' 
              : 'bg-red-100 hover:bg-red-200 text-red-800'} transition-colors`}
          >
            Try Again
          </Button>
        </div>
        
        {isRateLimitError && (
          <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2">While you wait, here are some nutrition tips:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Aim for a balanced plate with protein, complex carbs, and healthy fats</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Stay hydrated! Water helps with digestion and nutrient absorption</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Include colorful vegetables with each meal for essential micronutrients</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Plan your meals ahead to avoid impulsive food choices</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
          <h3 className="text-base font-medium text-gray-800">Personalized Meal Ideas</h3>
        </div>
        <Button 
          variant="secondary"
          onClick={handleRefresh}
          className="text-sm px-3 py-1.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:from-teal-50 hover:to-indigo-50 hover:border-teal-100 transition-all flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>
      
      <div className="space-y-4 overflow-y-auto flex-grow pr-2">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200">
                {suggestion.type}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-50 to-teal-100 text-teal-800 border border-teal-200">
                {suggestion.calories} kcal
              </span>
            </div>
            
            <h4 className="font-semibold text-gray-800 mb-1">{suggestion.name}</h4>
            <p className="text-sm text-gray-600">{suggestion.description}</p>
            
            <div className="mt-3 flex flex-wrap gap-1.5">
              {suggestion.ingredients.map((ingredient, i) => (
                <span 
                  key={i} 
                  className="inline-block px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100"
                >
                  {ingredient}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Protein</span>
                  <span className="font-medium text-gray-800">{suggestion.macros.protein}g</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Carbs</span>
                  <span className="font-medium text-gray-800">{suggestion.macros.carbs}g</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Fat</span>
                  <span className="font-medium text-gray-800">{suggestion.macros.fat}g</span>
                </div>
              </div>
              
              <Button
                variant="primary"
                className="text-xs py-1.5 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-sm"
                onClick={() => handleQuickAdd(suggestion)}
              >
                Quick Add
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
        Suggestions powered by Gemini 2.5 Pro Vision AI
      </div>
    </div>
  );
}