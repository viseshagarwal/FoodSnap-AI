"use client";
import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";

const COMMON_FOODS = [
  { name: "Coffee", calories: 5, serving: "cup" },
  { name: "Apple", calories: 95, serving: "medium" },
  { name: "Banana", calories: 105, serving: "medium" },
  { name: "Egg", calories: 70, serving: "large" },
  { name: "Greek Yogurt", calories: 100, serving: "100g" },
  { name: "Chicken Breast", calories: 165, serving: "100g" },
  { name: "Oatmeal", calories: 150, serving: "cup cooked" },
  { name: "Almonds", calories: 160, serving: "1/4 cup" },
];

export default function QuickAdd() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  
  const filteredFoods = searchTerm 
    ? COMMON_FOODS.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : COMMON_FOODS;

  const handleAddFood = async (foodName: string) => {
    setSelectedFood(foodName);
    setLoading(true);
    
    // Simulate adding the food to user's daily log
    setTimeout(() => {
      setLoading(false);
      setSelectedFood(null);
      // Here you would normally call an API to log the meal
      console.log(`Added ${foodName} to your daily log`);
    }, 800);
  };
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Add</h3>
      
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