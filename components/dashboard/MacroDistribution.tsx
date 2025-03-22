"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { DataCard } from "@/components/cards";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MacroDistributionProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function MacroDistribution({ calories, protein, carbs, fat, goals }: MacroDistributionProps) {
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;

  const chartData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [{
      data: [proteinCalories, carbsCalories, fatCalories],
      backgroundColor: [
        "rgb(168, 85, 247)", // purple
        "rgb(99, 102, 241)", // indigo
        "rgb(249, 115, 22)", // orange
      ],
      borderColor: "white",
      borderWidth: 2,
      hoverOffset: 5,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              return data.labels.map(function(label: string, i: number) {
                const value = data.datasets[0].data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label}: ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${value} cal (${percentage}%)`;
          },
          title: (context: any) => {
            return context[0].label;
          }
        },
      },
    },
    cutout: "70%",
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const details = [
    {
      label: "Protein",
      value: `${protein}g (${Math.round((proteinCalories / calories) * 100)}%)`,
    },
    {
      label: "Carbs",
      value: `${carbs}g (${Math.round((carbsCalories / calories) * 100)}%)`,
    },
    {
      label: "Fat",
      value: `${fat}g (${Math.round((fatCalories / calories) * 100)}%)`,
    },
  ];

  const metrics = [{
    label: "Total Calories",
    value: calories,
    trend: {
      value: Math.round((calories / goals.calories) * 100),
      label: "of daily goal"
    }
  }];

  const remainingCalories = goals.calories - calories;
  const remainingPercentage = Math.round((remainingCalories / goals.calories) * 100);

  return (
    <DataCard
      title="Macro Distribution"
      metrics={metrics}
      chart={
        <div className="h-64 relative pt-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{calories}</div>
              <div className="text-sm text-gray-500">calories</div>
              {remainingCalories > 0 ? (
                <div className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <span className="flex items-center gap-0.5">
                    {remainingCalories} cal remaining
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                    {remainingPercentage}%
                  </span>
                </div>
              ) : (
                <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="flex items-center gap-0.5">
                    {Math.abs(remainingCalories)} cal over
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                    {Math.abs(remainingPercentage)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="transition-all duration-300 hover:scale-105">
            <Doughnut data={chartData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  ...chartOptions.plugins.tooltip,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  titleColor: '#1e293b',
                  bodyColor: '#475569',
                  borderColor: 'rgba(226, 232, 240, 0.8)',
                  borderWidth: 1,
                  padding: 12,
                  cornerRadius: 8,
                  displayColors: true,
                  boxWidth: 8,
                  boxHeight: 8,
                  boxPadding: 4,
                  usePointStyle: true,
                }
              }
            }} />
          </div>
        </div>
      }
      dataPoints={details}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 hover:shadow-md transition-all duration-300"
    />
  );
}