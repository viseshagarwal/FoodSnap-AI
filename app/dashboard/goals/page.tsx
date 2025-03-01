"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { FaPlus, FaCheck } from "react-icons/fa";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Daily Calorie Target",
      target: 2000,
      current: 1200,
      unit: "calories"
    },
    {
      id: "2",
      title: "Protein Intake",
      target: 150,
      current: 65,
      unit: "g"
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEditClick = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string) => {
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="mt-2 text-gray-600">Track and set your nutrition and fitness goals</p>
        </div>
        <Button 
          onClick={() => {/* TODO: Implement add goal */}}
          className="flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {goal.title}
                </h3>
                {editingId === goal.id ? (
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={goal.target}
                      className="w-24 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      aria-label={`Edit target for ${goal.title}`}
                    />
                    <span className="text-gray-500">{goal.unit}</span>
                    <Button
                      onClick={() => handleSave(goal.id)}
                      className="flex items-center gap-2 text-sm px-3"
                    >
                      <FaCheck className="w-3 h-3" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {goal.current}
                    </span>
                    <span className="text-gray-500">
                      / {goal.target} {goal.unit}
                    </span>
                  </div>
                )}
              </div>
              
              {editingId !== goal.id && (
                <Button
                  variant="secondary"
                  onClick={() => handleEditClick(goal.id)}
                  className="text-sm px-3"
                >
                  Edit
                </Button>
              )}
            </div>
            
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${(goal.current / goal.target) * 100}%` }}
                role="progressbar"
                aria-valuenow={goal.current}
                aria-valuemin={0}
                aria-valuemax={goal.target}
                aria-label={`Progress for ${goal.title}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
