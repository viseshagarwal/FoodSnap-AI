"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { DetailCard } from "@/components/cards";
import { useRouter } from "next/navigation";

interface Goal {
  id: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

interface EditableGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  type: 'calories' | 'protein' | 'carbs' | 'fat';
}

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<EditableGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/goals', {
        credentials: 'include'
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const data = await response.json();
      
      // Find active goal
      const activeGoal = data.find((g: Goal) => g.isActive);
      
      if (activeGoal) {
        // Transform the data into editable goals format
        const editableGoals: EditableGoal[] = [
          {
            id: '1',
            title: 'Daily Calorie Target',
            target: activeGoal.dailyCalories,
            current: 0, // Will be calculated from today's meals
            unit: 'calories',
            type: 'calories'
          },
          {
            id: '2',
            title: 'Protein Intake',
            target: activeGoal.dailyProtein,
            current: 0,
            unit: 'g',
            type: 'protein'
          },
          {
            id: '3',
            title: 'Carbs Intake',
            target: activeGoal.dailyCarbs,
            current: 0,
            unit: 'g',
            type: 'carbs'
          },
          {
            id: '4',
            title: 'Fat Intake',
            target: activeGoal.dailyFat,
            current: 0,
            unit: 'g',
            type: 'fat'
          }
        ];

        // Fetch today's progress
        const today = new Date().toISOString().split('T')[0];
        const mealsResponse = await fetch(`/api/meals/recent?days=1`, {
          credentials: 'include'
        });

        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json();
          const totals = mealsData.totals;
          
          // Update current values
          editableGoals[0].current = totals.calories || 0;
          editableGoals[1].current = totals.protein || 0;
          editableGoals[2].current = totals.carbs || 0;
          editableGoals[3].current = totals.fat || 0;
        }

        setGoals(editableGoals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (goal: EditableGoal) => {
    setEditingId(goal.id);
    setEditValue(goal.target);
  };

  const handleSave = async (goal: EditableGoal) => {
    try {
      setSaving(true);
      setError(null);

      // Prepare the data
      const updatedGoal = {
        dailyCalories: goals[0].target,
        dailyProtein: goals[1].target,
        dailyCarbs: goals[2].target,
        dailyFat: goals[3].target,
        // Update the specific value being edited
        [goal.type === 'calories' ? 'dailyCalories' : `daily${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}`]: editValue
      };

      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedGoal)
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      // Update local state
      setGoals(prev => prev.map(g => 
        g.id === goal.id ? { ...g, target: editValue } : g
      ));
      
      setEditingId(null);
      router.refresh();
    } catch (error) {
      console.error('Error updating goal:', error);
      setError(error instanceof Error ? error.message : 'Failed to update goal');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="mt-2 text-gray-600">Track and set your nutrition and fitness goals</p>
        </div>
      </div>

      {error && (
        <DetailCard
          status={{
            type: "error",
            message: error
          }}
          className="mb-4"
        />
      )}

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
                      value={editValue}
                      onChange={(e) => setEditValue(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      aria-label={`Edit target for ${goal.title}`}
                    />
                    <span className="text-gray-500">{goal.unit}</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave(goal)}
                        disabled={saving}
                        className="flex items-center gap-2 text-sm px-3"
                      >
                        <FaCheck className="w-3 h-3" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-2 text-sm px-3"
                      >
                        <FaTimes className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
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
                  onClick={() => handleEditClick(goal)}
                  className="text-sm px-3"
                >
                  Edit
                </Button>
              )}
            </div>
            
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
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
