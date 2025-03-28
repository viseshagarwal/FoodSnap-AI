"use client";
import { useState, useEffect, useCallback } from "react";
import Button from "@/components/Button";
import { FaPlus, FaCheck, FaEdit, FaHistory, FaChartLine } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { DataCard } from "@/components/cards";

interface Goal {
  id: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  updatedAt?: string;
}

interface NutritionGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  type: 'calories' | 'protein' | 'carbs' | 'fat';
  color: string;
}

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<NutritionGoal[]>([]);
  const [apiGoals, setApiGoals] = useState<Goal[]>([]);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{[key: string]: number}>({});
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newGoalValues, setNewGoalValues] = useState({
    dailyCalories: 2000,
    dailyProtein: 150, 
    dailyCarbs: 225,
    dailyFat: 55
  });
  const [todaysTotals, setTodaysTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Show a notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch goals from API
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch goals
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
      setApiGoals(data);
      
      // Find active goal
      const active = data.find((goal: Goal) => goal.isActive);
      if (active) {
        setActiveGoal(active);
        
        // Initialize edit values with current active goal
        setNewGoalValues({
          dailyCalories: active.dailyCalories,
          dailyProtein: active.dailyProtein,
          dailyCarbs: active.dailyCarbs,
          dailyFat: active.dailyFat
        });
      }
      
      // Get today's totals for progress tracking
      const totalsResponse = await fetch('/api/meals/daily-totals', {
        credentials: 'include'
      });
      
      if (totalsResponse.ok) {
        const totalsData = await totalsResponse.json();
        setTodaysTotals(totalsData);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);
  
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);
  
  // Transform API goals into UI format
  useEffect(() => {
    if (activeGoal) {
      const formattedGoals: NutritionGoal[] = [
        {
          id: `${activeGoal.id}-calories`,
          title: "Daily Calorie Target",
          target: activeGoal.dailyCalories,
          current: todaysTotals.calories,
          unit: "calories",
          type: "calories",
          color: "orange"
        },
        {
          id: `${activeGoal.id}-protein`,
          title: "Protein Intake",
          target: activeGoal.dailyProtein,
          current: todaysTotals.protein,
          unit: "g",
          type: "protein",
          color: "indigo"
        },
        {
          id: `${activeGoal.id}-carbs`,
          title: "Carbohydrates Intake",
          target: activeGoal.dailyCarbs,
          current: todaysTotals.carbs,
          unit: "g",
          type: "carbs",
          color: "teal"
        },
        {
          id: `${activeGoal.id}-fat`,
          title: "Fat Intake",
          target: activeGoal.dailyFat,
          current: todaysTotals.fat,
          unit: "g",
          type: "fat",
          color: "purple"
        }
      ];
      
      setGoals(formattedGoals);
    }
  }, [activeGoal, todaysTotals]);

  // Handle edit of single goal
  const handleEditClick = (goal: NutritionGoal) => {
    setEditingId(goal.id);
    setEditValues({ ...editValues, [goal.id]: goal.target });
  };

  const handleEditChange = (id: string, value: number) => {
    setEditValues({ ...editValues, [id]: value });
  };

  const handleGoalValueChange = (field: string, value: number) => {
    setNewGoalValues({
      ...newGoalValues,
      [field]: value
    });
  };

  // Save a single goal edit
  const handleSingleGoalSave = async (goal: NutritionGoal) => {
    try {
      if (!activeGoal) return;
      
      // Prepare new goal values with updated target
      const updatedGoalData = {
        dailyCalories: activeGoal.dailyCalories,
        dailyProtein: activeGoal.dailyProtein,
        dailyCarbs: activeGoal.dailyCarbs,
        dailyFat: activeGoal.dailyFat,
        updateExisting: true
      };
      
      // Update specific nutrition value
      if (goal.type === 'calories') {
        updatedGoalData.dailyCalories = editValues[goal.id] || goal.target;
      } else if (goal.type === 'protein') {
        updatedGoalData.dailyProtein = editValues[goal.id] || goal.target;
      } else if (goal.type === 'carbs') {
        updatedGoalData.dailyCarbs = editValues[goal.id] || goal.target;
      } else if (goal.type === 'fat') {
        updatedGoalData.dailyFat = editValues[goal.id] || goal.target;
      }
      
      // Send updated goal to API
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedGoalData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      
      const updatedGoals = await response.json();
      setApiGoals(updatedGoals);
      setActiveGoal(updatedGoals.find((g: Goal) => g.isActive) || null);
      
      showNotification(`Updated ${goal.title.toLowerCase()}`, 'success');
      setEditingId(null);
    } catch (err) {
      console.error('Error updating goal:', err);
      setError(err instanceof Error ? err.message : 'Failed to update goal');
      showNotification('Failed to update goal', 'error');
    }
  };

  // Save all goal edits
  const handleAllGoalsSave = async () => {
    try {
      // Send updated goal plan to API
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newGoalValues,
          updateExisting: isEditingGoals
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update goals');
      }
      
      const updatedGoals = await response.json();
      setApiGoals(updatedGoals);
      setActiveGoal(updatedGoals.find((g: Goal) => g.isActive) || null);
      
      showNotification(isEditingGoals ? 'Updated nutrition goals' : 'Created new goal plan', 'success');
      setIsEditingGoals(false);
    } catch (err) {
      console.error('Error updating goals:', err);
      setError(err instanceof Error ? err.message : 'Failed to update goals');
      showNotification('Failed to update goals', 'error');
    }
  };

  // Calculate completion percentage
  const getCompletionPercentage = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner variant="gradient" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-medium mb-2">Error Loading Goals</h3>
          <p>{error}</p>
          <button 
            onClick={() => fetchGoals()} 
            className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg shadow-lg p-4 transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          notification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          <div className="flex items-center">
            <span className={`mr-2 ${
              notification.type === 'success' ? 'text-green-500' :
              notification.type === 'error' ? 'text-red-500' :
              'text-blue-500'
            }`}>
              {notification.type === 'success' ? <FaCheck /> :
               notification.type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Nutrition Goals</h1>
          <p className="mt-2 text-gray-600">Track your daily nutrition targets and progress</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2"
          >
            <FaHistory className="w-4 h-4" />
            {showHistory ? 'Hide History' : 'View History'}
          </Button>
          
          {!isEditingGoals && (
            <Button 
              onClick={() => setIsEditingGoals(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
            >
              <FaEdit className="w-4 h-4" />
              {activeGoal ? 'Edit All Goals' : 'Set Goals'}
            </Button>
          )}
        </div>
      </div>
      
      {isEditingGoals && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {activeGoal ? 'Edit Nutrition Goals' : 'Create New Nutrition Goals'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="dailyCalories" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Calories
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="dailyCalories"
                  type="number"
                  value={newGoalValues.dailyCalories}
                  onChange={(e) => handleGoalValueChange('dailyCalories', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min="0"
                />
                <span className="text-gray-500">calories</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="dailyProtein" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Protein
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="dailyProtein"
                  type="number"
                  value={newGoalValues.dailyProtein}
                  onChange={(e) => handleGoalValueChange('dailyProtein', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min="0"
                />
                <span className="text-gray-500">g</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="dailyCarbs" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Carbs
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="dailyCarbs"
                  type="number"
                  value={newGoalValues.dailyCarbs}
                  onChange={(e) => handleGoalValueChange('dailyCarbs', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min="0"
                />
                <span className="text-gray-500">g</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="dailyFat" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Fat
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="dailyFat"
                  type="number"
                  value={newGoalValues.dailyFat}
                  onChange={(e) => handleGoalValueChange('dailyFat', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min="0"
                />
                <span className="text-gray-500">g</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsEditingGoals(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAllGoalsSave}
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
            >
              <FaCheck className="w-3 h-3" />
              {activeGoal ? 'Update Goals' : 'Create Goals'}
            </Button>
          </div>
        </div>
      )}
      
      {goals.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-indigo-50 text-teal-700 rounded-lg p-4 mb-6 flex justify-between items-center">
            <p className="text-sm font-medium">
              Today's Progress as of {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
            <div className="text-xs px-3 py-1 bg-white rounded-full text-teal-700 border border-teal-100">
              Plan Active Since {formatDate(activeGoal?.startDate || '')}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-xl shadow-sm hover:shadow transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className={`h-1.5 bg-${goal.color}-500`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {goal.title}
                      </h3>
                      {editingId === goal.id ? (
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            value={editValues[goal.id] || goal.target}
                            onChange={(e) => handleEditChange(goal.id, Number(e.target.value))}
                            className="w-24 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            aria-label={`Edit target for ${goal.title}`}
                            min="0"
                          />
                          <span className="text-gray-500">{goal.unit}</span>
                          <Button
                            onClick={() => handleSingleGoalSave(goal)}
                            className={`flex items-center gap-2 text-sm px-3 bg-${goal.color}-500 hover:bg-${goal.color}-600 text-white`}
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
                        onClick={() => handleEditClick(goal)}
                        className="text-sm px-3"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.current / goal.target > 1 
                          ? 'bg-orange-500' // Over the goal
                          : goal.current / goal.target > 0.8 
                            ? 'bg-green-500' // Near target
                            : `bg-${goal.color}-500` // Standard progress
                      }`}
                      style={{ 
                        width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
                      }}
                      role="progressbar"
                      aria-valuenow={goal.current}
                      aria-valuemin={0}
                      aria-valuemax={goal.target}
                      aria-label={`Progress for ${goal.title}`}
                    />
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500 flex justify-between">
                    <div>
                      {goal.current >= goal.target ? (
                        <span className="text-green-600 font-medium">Goal reached!</span>
                      ) : (
                        <span>
                          {getCompletionPercentage(goal.current, goal.target)}% complete
                        </span>
                      )}
                    </div>
                    <div>
                      {goal.type === 'calories' && goal.current < goal.target && (
                        <span className="font-medium">{goal.target - goal.current} left today</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <DataCard
              title="Nutritional Balance"
              metrics={[
                {
                  label: "Protein (%)",
                  value: `${Math.round((todaysTotals.protein * 4 / (todaysTotals.calories || 1)) * 100)}%`,
                  target: "~25-35%"
                },
                {
                  label: "Carbs (%)",
                  value: `${Math.round((todaysTotals.carbs * 4 / (todaysTotals.calories || 1)) * 100)}%`,
                  target: "~45-65%"
                },
                {
                  label: "Fat (%)",
                  value: `${Math.round((todaysTotals.fat * 9 / (todaysTotals.calories || 1)) * 100)}%`,
                  target: "~20-35%"
                },
                {
                  label: "Total",
                  value: `${todaysTotals.calories} cal`,
                  target: `${activeGoal?.dailyCalories || 0} cal`
                }
              ]}
              className="bg-white shadow-sm rounded-xl"
            />
          </div>
          
          {showHistory && (
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Goal History</h3>
                <div className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {apiGoals.length} Plan{apiGoals.length !== 1 ? 's' : ''} Total
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                {apiGoals.map((goal, index) => (
                  <div 
                    key={goal.id}
                    className={`py-3 px-4 rounded-lg ${goal.isActive ? 'bg-teal-50 border-l-4 border-teal-500' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">
                            Plan {apiGoals.length - index}
                          </h4>
                          {goal.isActive && (
                            <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(goal.startDate)} 
                          {goal.endDate ? ` - ${formatDate(goal.endDate)}` : ' - Present'}
                        </p>
                      </div>
                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Calories:</span>
                            <span className="font-medium">{goal.dailyCalories}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Protein:</span>
                            <span className="font-medium">{goal.dailyProtein}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Carbs:</span>
                            <span className="font-medium">{goal.dailyCarbs}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Fat:</span>
                            <span className="font-medium">{goal.dailyFat}g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
            <FaChartLine className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Goals Set</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Setting nutrition goals helps you track your daily intake and make progress towards your health objectives.
          </p>
          {!isEditingGoals && (
            <Button
              onClick={() => setIsEditingGoals(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-500"
            >
              <FaPlus className="w-4 h-4" />
              Set Your Goals
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
