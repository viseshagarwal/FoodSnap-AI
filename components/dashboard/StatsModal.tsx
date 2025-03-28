"use client";
import React, { useState, useCallback, useEffect } from "react";
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
  Filler,
} from "chart.js";
import { DataCard } from '@/components/cards';

// Register ChartJS components
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

type TimeRange = 'week' | 'month' | '3months' | 'year' | 'all';

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
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week');
  const [processedChartData, setProcessedChartData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });

  // Process chart data based on selected time range
  useEffect(() => {
    if (!chartData?.labels?.length || !chartData?.values?.length) {
      setProcessedChartData({ labels: [], values: [] });
      return;
    }

    try {
      // Create display labels (format dates for display)
      const displayLabels = chartData.labels.map(label => {
        // If it's a date in ISO or YYYY-MM-DD format
        if (label.includes('-')) {
          try {
            const dateParts = label.split('T')[0].split('-').map(Number);
            const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
          } catch (e) {
            // Ignore parsing errors and return original label
          }
        }
        
        // Return original label if not a date or failed to parse
        return label;
      });
      
      // Apply selected timeframe filtering client-side
      let filteredData = {
        labels: displayLabels,
        values: chartData.values
      };
      
      // We're directly using the data that's already filtered by the API
      setProcessedChartData(filteredData);
    } catch (error) {
      console.error('Error processing chart data:', error);
      setProcessedChartData({ labels: [], values: [] });
    }
  }, [selectedTimeRange, chartData]);
  
  // When timeframe changes, fetch new data
  const fetchTimeframeData = useCallback(async (timeframe: TimeRange) => {
    try {
      // Fetch data with selected timeframe
      const apiTimeframe = timeframe === '3months' ? 'month' : timeframe;
      
      // Call API with timeframe parameter
      const response = await fetch(`/api/dashboard/stats?timeframe=${apiTimeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      console.log(`Data refreshed for ${timeframe} timeframe`);
    } catch (error) {
      console.error('Error fetching timeframe data:', error);
    }
  }, []);

  // When timeframe changes, fetch new data
  useEffect(() => {
    fetchTimeframeData(selectedTimeRange);
  }, [selectedTimeRange, fetchTimeframeData]);

  const getColorValues = () => {
    const colorMap = {
      teal: { rgb: "20, 184, 166", light: "#d1faf5", dark: "#0d9488", text: "teal" },
      indigo: { rgb: "99, 102, 241", light: "#e0e7ff", dark: "#4f46e5", text: "indigo" },
      orange: { rgb: "249, 115, 22", light: "#ffedd5", dark: "#ea580c", text: "orange" },
      purple: { rgb: "168, 85, 247", light: "#f3e8ff", dark: "#9333ea", text: "purple" },
      pink: { rgb: "236, 72, 153", light: "#fce7f3", dark: "#db2777", text: "pink" },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.teal;
  };

  const colorValues = getColorValues();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 8,
        cornerRadius: 6,
        displayColors: false,
        titleFont: {
          size: 12,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 11,
        },
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            return `${context.raw}${unit}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: function(value: any) {
            return `${value}${unit}`;
          },
          color: '#94a3b8',
          font: {
            size: 10,
          },
          padding: 4,
        },
        border: {
          display: false,
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 4,
        },
        border: {
          display: false,
        }
      }
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 4,
      },
      line: {
        tension: 0.4,
      }
    },
  };

  const getChartData = useCallback(() => ({
    labels: processedChartData.labels,
    datasets: [{
      label: title,
      data: processedChartData.values,
      borderColor: `rgb(${colorValues.rgb})`,
      backgroundColor: `rgba(${colorValues.rgb}, 0.1)`,
      tension: 0.4,
      fill: true,
      pointRadius: 2,
      pointBackgroundColor: `rgb(${colorValues.rgb})`,
      pointBorderColor: 'white',
      pointBorderWidth: 1,
    }]
  }), [processedChartData, title, colorValues.rgb]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      message=""
      confirmText="Close"
      cancelText=""
      onConfirm={onClose}
      customContent={
        <div className="p-4 max-w-lg w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg bg-${color}-100 flex items-center justify-center`}>
                <svg className={`h-4 w-4 text-${color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {value}
              <span className="text-gray-500 ml-1">{unit}</span>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mb-4">
            {(['week', 'month', '3months'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedTimeRange === range
                    ? `bg-${color}-50 text-${color}-600 ring-1 ring-${color}-200`
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range === 'week' ? '7D' : 
                 range === 'month' ? '1M' : '3M'}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="h-48 mb-4">
            <Line 
              data={getChartData()} 
              options={chartOptions}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {details.map((detail, index) => (
              <div key={index} className="p-2 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">{detail.label}</div>
                <div className="text-sm font-medium text-gray-900">{detail.value}</div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}