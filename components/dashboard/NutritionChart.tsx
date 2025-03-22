"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useState, useMemo } from "react";
import { DataCard } from "@/components/cards";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface NutritionChartProps {
  data: {
    labels: string[];
    values: number[];
    target?: number;
  };
  title: string;
  unit: string;
  color: string;
  trend?: number;
  details?: Array<{ label: string; value: string | number }>;
}

export default function NutritionChart({ data, title, unit, color, trend, details }: NutritionChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3months'>('week');

  const getColorValues = () => {
    const colorMap = {
      teal: { rgb: "20, 184, 166", light: "#d1faf5", dark: "#0d9488", bgClass: "bg-teal-50", textClass: "text-teal-600" },
      orange: { rgb: "249, 115, 22", light: "#ffedd5", dark: "#ea580c", bgClass: "bg-orange-50", textClass: "text-orange-600" },
      indigo: { rgb: "99, 102, 241", light: "#e0e7ff", dark: "#4f46e5", bgClass: "bg-indigo-50", textClass: "text-indigo-600" },
      purple: { rgb: "168, 85, 247", light: "#f3e8ff", dark: "#9333ea", bgClass: "bg-purple-50", textClass: "text-purple-600" },
      pink: { rgb: "236, 72, 153", light: "#fce7f3", dark: "#db2777", bgClass: "bg-pink-50", textClass: "text-pink-600" },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.teal;
  };

  const colorValues = getColorValues();
  
  // Filter data based on time range for future implementation
  const filteredData = useMemo(() => {
    // This would filter the data based on the selected time range
    // For now, we're just returning the full dataset
    return data;
  }, [data, timeRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.raw}${unit}`,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false,
        },
        ticks: {
          callback: (value: any) => `${value}${unit}`,
          color: '#64748b',
          font: { size: 11 },
          padding: 8,
        },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 45,
        },
        border: { display: false }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const chartData = {
    labels: filteredData.labels,
    datasets: [
      {
        data: filteredData.values,
        borderColor: `rgb(${colorValues.rgb})`,
        backgroundColor: `rgba(${colorValues.rgb}, 0.1)`,
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: `rgb(${colorValues.rgb})`,
        pointBorderColor: 'white',
        pointBorderWidth: 2,
      }
    ]
  };

  const metrics = [{
    label: title,
    value: data.values.length > 0 ? data.values[data.values.length - 1] + unit : "0" + unit,
    trend: trend ? {
      value: trend,
      label: "vs previous"
    } : undefined,
    color: color
  }];

  return (
    <DataCard
      title={title}
      metrics={metrics}
      chart={
        <div className="relative">
          <div className="absolute top-0 right-0 flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg z-10">
            {['week', 'month', '3months'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'week' | 'month' | '3months')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  timeRange === range
                    ? colorValues.bgClass + ' ' + colorValues.textClass
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range === 'week' ? '1W' : range === 'month' ? '1M' : '3M'}
              </button>
            ))}
          </div>
          <Line data={chartData} options={chartOptions} />
        </div>
      }
      dataPoints={details}
      className="bg-white shadow-sm rounded-xl"
    />
  );
}