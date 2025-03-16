"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NutritionChart, MacroDistribution } from "@/components/dashboard";
import { DataCard } from "@/components/cards";

interface NutritionData {
  todaysTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  chartData: {
    calories: { labels: string[]; values: number[] };
    protein: { labels: string[]; values: number[] };
    carbs: { labels: string[]; values: number[] };
    fat: { labels: string[]; values: number[] };
  };
  trends: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function Analytics() {
  const router = useRouter();
  const [data, setData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/stats?timeframe=${selectedTimeframe}`);
        
        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, selectedTimeframe]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="flex mb-4 space-x-2">
          {['day', 'week', 'month'].map((period) => (
            <div key={period} className="h-8 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-6 h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-600 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
        <p>{error || 'Failed to load analytics data'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Nutrition Analytics</h1>
        
        <div className="inline-flex items-center rounded-lg bg-white shadow-sm p-1">
          {['day', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period as 'day' | 'week' | 'month')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                selectedTimeframe === period
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MacroDistribution
          calories={data.todaysTotals.calories}
          protein={data.todaysTotals.protein}
          carbs={data.todaysTotals.carbs}
          fat={data.todaysTotals.fat}
          goals={data.goals}
        />

        <NutritionChart
          title="Calories"
          data={data.chartData.calories}
          unit="cal"
          color="orange"
          trend={data.trends.calories}
          details={[
            { label: "Daily Goal", value: `${data.goals.calories} cal` },
            { label: "Average", value: `${Math.round(data.chartData.calories.values.reduce((a, b) => a + b, 0) / data.chartData.calories.values.length)} cal` },
            { label: "Remaining", value: `${data.goals.calories - data.todaysTotals.calories} cal` }
          ]}
        />

        <NutritionChart
          title="Protein"
          data={data.chartData.protein}
          unit="g"
          color="purple"
          trend={data.trends.protein}
          details={[
            { label: "Daily Goal", value: `${data.goals.protein}g` },
            { label: "Average", value: `${Math.round(data.chartData.protein.values.reduce((a, b) => a + b, 0) / data.chartData.protein.values.length)}g` },
            { label: "Remaining", value: `${data.goals.protein - data.todaysTotals.protein}g` }
          ]}
        />

        <NutritionChart
          title="Carbohydrates"
          data={data.chartData.carbs}
          unit="g"
          color="indigo"
          trend={data.trends.carbs}
          details={[
            { label: "Daily Goal", value: `${data.goals.carbs}g` },
            { label: "Average", value: `${Math.round(data.chartData.carbs.values.reduce((a, b) => a + b, 0) / data.chartData.carbs.values.length)}g` },
            { label: "Remaining", value: `${data.goals.carbs - data.todaysTotals.carbs}g` }
          ]}
        />

        <DataCard
          title="Weekly Progress Summary"
          metrics={[
            {
              label: "Protein Goal Achievement",
              value: `${Math.round((data.todaysTotals.protein / data.goals.protein) * 100)}%`,
              trend: {
                value: data.trends.protein,
                label: "vs last week"
              }
            }
          ]}
          dataPoints={[
            { label: "Calorie Consistency", value: `${Math.round(data.trends.calories >= 0 ? data.trends.calories : 0)}% on target` },
            { label: "Protein Consistency", value: `${Math.round(data.trends.protein >= 0 ? data.trends.protein : 0)}% on target` },
            { label: "Carbs Consistency", value: `${Math.round(data.trends.carbs >= 0 ? data.trends.carbs : 0)}% on target` },
            { label: "Fat Consistency", value: `${Math.round(data.trends.fat >= 0 ? data.trends.fat : 0)}% on target` }
          ]}
          className="bg-white shadow-sm rounded-xl"
        />

        <NutritionChart
          title="Fat"
          data={data.chartData.fat}
          unit="g"
          color="teal"
          trend={data.trends.fat}
          details={[
            { label: "Daily Goal", value: `${data.goals.fat}g` },
            { label: "Average", value: `${Math.round(data.chartData.fat.values.reduce((a, b) => a + b, 0) / data.chartData.fat.values.length)}g` },
            { label: "Remaining", value: `${data.goals.fat - data.todaysTotals.fat}g` }
          ]}
        />
      </div>
    </div>
  );
}