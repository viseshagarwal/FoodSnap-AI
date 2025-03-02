"use client";

import { useState, useEffect, useCallback } from "react";
import { FaFire, FaBullseye, FaDumbbell, FaChartLine } from "react-icons/fa";
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

      const formattedStats: StatDetails[] = [
        {
          title: "Today's Calories",
          value: data.todaysTotals.calories,
          unit: "cal",
          trend: data.trends.calories,
          color: "orange",
          chartData: data.chartData.calories,
          details: [
            { label: "Daily Goal", value: `${data.goals.calories} cal` },
            { label: "Remaining", value: `${data.remaining.calories} cal` },
            { label: "Protein Ratio", value: `${Math.round((data.todaysTotals.protein * 4 / (data.todaysTotals.calories || 1)) * 100)}%` },
            { label: "Carbs Ratio", value: `${Math.round((data.todaysTotals.carbs * 4 / (data.todaysTotals.calories || 1)) * 100)}%` },
          ],
        },
        {
          title: "Remaining Goal",
          value: data.remaining.calories,
          unit: "cal",
          trend: -data.trends.calories,
          color: "indigo",
          chartData: {
            labels: data.chartData.calories.labels,
            values: data.chartData.calories.labels.map((_, i) => 
              Math.max(0, data.goals.calories - (data.chartData.calories.values[i] || 0))
            ),
          },
          details: [
            { label: "Daily Goal", value: `${data.goals.calories} cal` },
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
          chartData: data.chartData.protein,
          details: [
            { label: "Daily Goal", value: `${data.goals.protein}g` },
            { label: "Remaining", value: `${data.remaining.protein}g` },
            { label: "Progress", value: `${Math.round((data.todaysTotals.protein / data.goals.protein) * 100)}%` },
          ],
        },
        {
          title: "Weekly Progress",
          value: Math.round((data.todaysTotals.calories / data.goals.calories) * 100),
          unit: "%",
          trend: data.trends.calories,
          color: "pink",
          chartData: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: data.chartData.calories.values.map(cal => 
              Math.round((cal / data.goals.calories) * 100)
            ),
          },
          details: [
            { label: "Weekly Average", value: `${Math.round(data.chartData.calories.values.reduce((a, b) => a + b, 0) / 7)} cal` },
            { label: "Goal Progress", value: `${Math.round((data.todaysTotals.calories / data.goals.calories) * 100)}%` },
            { label: "Week Trend", value: `${data.trends.calories >= 0 ? '+' : ''}${data.trends.calories}%` },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-lg p-4">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={`${stat.value}${stat.unit ? ` ${stat.unit}` : ''}`}
            icon={
              stat.title === "Today's Calories" ? FaFire :
              stat.title === "Remaining Goal" ? FaBullseye :
              stat.title === "Protein" ? FaDumbbell :
              FaChartLine
            }
            trend={stat.trend}
            color={stat.color === "orange" ? "orange" :
                   stat.color === "indigo" ? "indigo" :
                   stat.color === "purple" ? "purple" :
                   stat.color === "pink" ? "pink" :
                   "teal"}
            onClick={() => setSelectedStat(stat)}
          />
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
