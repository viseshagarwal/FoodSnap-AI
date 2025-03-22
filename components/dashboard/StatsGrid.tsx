"use client";

import { useState, useEffect, useCallback } from "react";
import { FaFire, FaBullseye, FaDumbbell, FaChartLine, FaBreadSlice, FaOilCan } from "react-icons/fa";
import { StatsCard } from "@/components/cards";
import StatsModal from "./StatsModal";
import { useRouter } from "next/navigation";

interface StatDetails {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  color?: string;
  chartData?: {
    labels: string[];
    values: number[];
  };
  details?: Array<{
    label: string;
    value: string | number;
  }>;
}

interface DashboardStats {
  todaysTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  remaining: {
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
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function StatsGrid() {
  const router = useRouter();
  const [selectedStat, setSelectedStat] = useState<StatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatDetails[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include'
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data: DashboardStats = await response.json();

      // Ensure valid date strings for chart labels
      const formatDateString = (dateStr: string) => {
        try {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return ''; // Return empty string for invalid dates
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch (error) {
          console.error('Error formatting date:', error);
          return ''; // Return empty string on error
        }
      };

      const formattedStats: StatDetails[] = [
        {
          title: "Today's Calories",
          value: data.todaysTotals.calories,
          unit: "cal",
          trend: data.trends.calories,
          color: "orange",
          chartData: {
            labels: data.chartData.calories.labels.map(formatDateString),
            values: data.chartData.calories.values
          },
          details: [
            { label: "Daily Goal", value: `${data.goals.calories} cal` },
            { label: "Remaining", value: `${data.remaining.calories} cal` },
            { label: "Progress", value: `${Math.round((data.todaysTotals.calories / data.goals.calories) * 100)}%` },
            { label: "Time Left", value: "8 hours" },
          ],
        },
        {
          title: "Protein",
          value: data.todaysTotals.protein,
          unit: "g",
          trend: data.trends.protein,
          color: "purple",
          chartData: {
            labels: data.chartData.protein.labels.map(formatDateString),
            values: data.chartData.protein.values
          },
          details: [
            { label: "Daily Goal", value: `${data.goals.protein}g` },
            { label: "Remaining", value: `${data.remaining.protein}g` },
            { label: "Progress", value: `${Math.round((data.todaysTotals.protein / data.goals.protein) * 100)}%` },
            { label: "Protein Ratio", value: `${Math.round((data.todaysTotals.protein * 4 / (data.todaysTotals.calories || 1)) * 100)}%` },
          ],
        },
        {
          title: "Carbs",
          value: data.todaysTotals.carbs,
          unit: "g",
          trend: data.trends.carbs,
          color: "indigo",
          chartData: {
            labels: data.chartData.carbs.labels.map(formatDateString),
            values: data.chartData.carbs.values
          },
          details: [
            { label: "Daily Goal", value: `${data.goals.carbs}g` },
            { label: "Remaining", value: `${data.remaining.carbs}g` },
            { label: "Progress", value: `${Math.round((data.todaysTotals.carbs / data.goals.carbs) * 100)}%` },
            { label: "Carbs Ratio", value: `${Math.round((data.todaysTotals.carbs * 4 / (data.todaysTotals.calories || 1)) * 100)}%` },
          ],
        },
        {
          title: "Fat",
          value: data.todaysTotals.fat,
          unit: "g",
          trend: data.trends.fat,
          color: "teal",
          chartData: {
            labels: data.chartData.fat.labels.map(formatDateString),
            values: data.chartData.fat.values
          },
          details: [
            { label: "Daily Goal", value: `${data.goals.fat}g` },
            { label: "Remaining", value: `${data.remaining.fat}g` },
            { label: "Progress", value: `${Math.round((data.todaysTotals.fat / data.goals.fat) * 100)}%` },
            { label: "Fat Ratio", value: `${Math.round((data.todaysTotals.fat * 9 / (data.todaysTotals.calories || 1)) * 100)}%` },
          ],
        },
      ];

      setStats(formattedStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/80">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-2xl p-6 border border-red-100">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
        <button 
          onClick={fetchStats}
          className="mt-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 auto-rows-fr">
        {stats.map((stat, index) => (
          <div 
            key={stat.title}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <StatsCard
              title={stat.title}
              value={`${stat.value}${stat.unit ? ` ${stat.unit}` : ''}`}
              icon={
                stat.title === "Today's Calories" ? FaFire :
                stat.title === "Protein" ? FaDumbbell :
                stat.title === "Carbs" ? FaBreadSlice :
                FaOilCan
              }
              trend={stat.trend}
              color={stat.color === "orange" ? "orange" :
                     stat.color === "indigo" ? "indigo" :
                     stat.color === "purple" ? "purple" :
                     stat.color === "teal" ? "teal" :
                     "indigo"}
              onClick={() => setSelectedStat(stat)}
            />
          </div>
        ))}
      </div>

      {selectedStat && (
        <StatsModal
          isOpen={!!selectedStat}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          value={selectedStat.value}
          trend={selectedStat.trend}
          chartData={selectedStat.chartData}
          color={selectedStat.color}
          unit={selectedStat.unit}
          details={selectedStat.details}
        />
      )}
    </>
  );
}
