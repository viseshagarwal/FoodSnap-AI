"use client";
import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface MealSuggestion {
  type: string;
  name: string;
  calories: number;
  description: string;
}

export default function MealSuggestions() {
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([
    {
      type: "breakfast",
      name: "Greek Yogurt with Berries",
      calories: 250,
      description: "High protein breakfast with antioxidant-rich berries"
    },
    {
      type: "lunch",
      name: "Quinoa Salad",
      calories: 350,
      description: "Protein-packed grain with mixed vegetables"
    },
    {
      type: "dinner",
      name: "Grilled Chicken with Vegetables",
      calories: 400,
      description: "Lean protein with fiber-rich vegetables"
    },
  ]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Meal Suggestions</h3>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium uppercase text-gray-500">{suggestion.type}</span>
              <span className="text-xs font-medium text-teal-600">{suggestion.calories} kcal</span>
            </div>
            <h4 className="font-medium text-gray-800">{suggestion.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
          </div>
        ))}
        <Button 
          className="w-full mt-2 text-sm bg-white text-teal-600 border border-teal-600 hover:bg-teal-50"
        >
          Get Personalized Suggestions
        </Button>
      </div>
    </Card>
  );
}