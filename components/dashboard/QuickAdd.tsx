"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";

const COMMON_FOODS = [
  { name: "Coffee", calories: 5, protein: 0.3, carbs: 0, fat: 0, serving: "cup" },
  { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: "medium" },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: "medium" },
  { name: "Egg", calories: 70, protein: 6, carbs: 0.6, fat: 5, serving: "large" },
  { name: "Greek Yogurt", calories: 100, protein: 10, carbs: 4, fat: 3, serving: "100g" },
  { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g" },
  { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3, serving: "cup cooked" },
  { name: "Almonds", calories: 160, protein: 6, carbs: 6, fat: 14, serving: "1/4 cup" },
];

export default function QuickAdd() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const filteredFoods = searchTerm 
    ? COMMON_FOODS.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : COMMON_FOODS;

  const handleAddFood = async (foodName: string) => {
    try {
      setError(null);
      setSelectedFood(foodName);
      setLoading(true);
      
      const food = COMMON_FOODS.find(f => f.name === foodName);
      if (!food) return;

      const mealData = {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        mealType: "SNACK",
        images: [],
        ingredients: [food.name]
      };

      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mealData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to add meal');
      }

      router.refresh();
    } catch (error) {
      console.error('Error adding meal:', error);
      setError('Failed to add meal. Please try again.');
    } finally {
      setLoading(false);
      setSelectedFood(null);
    }
  };
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Add</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search common foods..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredFoods.map((food) => (
          <div 
            key={food.name} 
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
          >
            <div>
              <p className="font-medium text-gray-800">{food.name}</p>
              <p className="text-xs text-gray-500">{food.calories} kcal | {food.serving}</p>
            </div>
            <Button
              onClick={() => handleAddFood(food.name)}
              className={`text-xs py-1 px-3 ${
                selectedFood === food.name
                  ? "bg-teal-100 text-teal-700"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
              disabled={loading && selectedFood === food.name}
            >
              {loading && selectedFood === food.name ? "Adding..." : "Add"}
            </Button>
          </div>
        ))}
        
        {filteredFoods.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No matching foods found. Try another search term.
          </div>
        )}
      </div>
    </Card>
  );
}