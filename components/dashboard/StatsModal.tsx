"use client";

import { useState, useCallback } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
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
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string | number;
  trend?: number;
  chartData?: {
    labels: string[];
    values: number[];
  };
  color?: string;
  unit?: string;
  details?: {
    label: string;
    value: string | number;
  }[];
}

export default function StatsModal({
  isOpen,
  onClose,
  title,
  value,
  trend,
  chartData,
  color = "teal",
  unit = "",
  details = [],
}: StatsModalProps) {
  const [selectedRange, setSelectedRange] = useState<"day" | "week" | "month">("week");

  const getChartData = useCallback(() => {
    if (!chartData) return null;

    return {
      labels: chartData.labels,
      datasets: [
        {
          label: title,
          data: chartData.values,
          borderColor: `rgb(${
            color === "teal" ? "20, 184, 166" :
            color === "indigo" ? "99, 102, 241" :
            color === "orange" ? "249, 115, 22" :
            color === "pink" ? "236, 72, 153" :
            "20, 184, 166"
          })`,
          backgroundColor: `rgba(${
            color === "teal" ? "20, 184, 166" :
            color === "indigo" ? "99, 102, 241" :
            color === "orange" ? "249, 115, 22" :
            color === "pink" ? "236, 72, 153" :
            "20, 184, 166"
          }, 0.1)`,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [chartData, title, color]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.raw}${unit}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `${value}${unit}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message=""
      confirmText="Close"
      cancelText=""
      onConfirm={onClose}
      customContent={
        <div className="space-y-6">
          <div className="flex items-baseline justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {value}
                {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
              </h3>
              {trend !== undefined && (
                <p className={`text-sm mt-1 ${
                  trend >= 0 ? "text-emerald-500" : "text-red-500"
                } flex items-center gap-1`}>
                  <span aria-hidden="true">{trend >= 0 ? "↑" : "↓"}</span>
                  <span className="sr-only">
                    {trend >= 0 ? "Increased by" : "Decreased by"}
                  </span>
                  {Math.abs(trend)}%
                  <span className="text-gray-500 ml-1">vs previous</span>
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              {["day", "week", "month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range as "day" | "week" | "month")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedRange === range
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {chartData && (
            <div className="h-64">
              <Line data={getChartData()!} options={chartOptions} />
            </div>
          )}

          {details.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {details.map((detail) => (
                <div key={detail.label} className="space-y-1">
                  <p className="text-sm text-gray-500">{detail.label}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
}