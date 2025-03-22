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
    if (!chartData || !chartData.labels || !chartData.values) {
      setProcessedChartData({ labels: [], values: [] });
      return;
    }
    
    const today = new Date();
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    let startDate = new Date();
    let filteredLabels: string[] = [];
    let filteredValues: number[] = [];

    // Calculate start date based on selected range
    switch(selectedTimeRange) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'all':
      default:
        startDate = new Date(0);
    }

    try {
      chartData.labels.forEach((label, index) => {
        const date = new Date(label);
        if (!isNaN(date.getTime()) && date >= startDate) {
          filteredLabels.push(formatDate(date));
          filteredValues.push(chartData.values[index]);
        }
      });

      setProcessedChartData({
        labels: filteredLabels.length > 0 ? filteredLabels : chartData.labels,
        values: filteredValues.length > 0 ? filteredValues : chartData.values
      });
    } catch (error) {
      console.error('Error processing chart data:', error);
      setProcessedChartData({ labels: chartData.labels, values: chartData.values });
    }
  }, [selectedTimeRange, chartData]);

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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            return `${title}: ${context.raw}${unit}`;
          },
          afterBody: function() {
            return selectedTimeRange === 'week' ? '' : 'Click for daily breakdown';
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
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return `${value}${unit}`;
          },
          color: '#64748b',
          font: {
            size: 11,
          },
          padding: 8,
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
          color: '#64748b',
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        border: {
          display: false,
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.3,
      }
    },
  };

  const getChartData = useCallback(() => {
    if (!processedChartData || processedChartData.values.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: title,
          data: [],
          borderColor: `rgb(${colorValues.rgb})`,
          backgroundColor: `rgba(${colorValues.rgb}, 0.1)`,
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: `rgb(${colorValues.rgb})`,
          pointBorderColor: 'white',
          pointBorderWidth: 2,
        }]
      };
    }

    return {
      labels: processedChartData.labels,
      datasets: [{
        label: title,
        data: processedChartData.values,
        borderColor: `rgb(${colorValues.rgb})`,
        backgroundColor: `rgba(${colorValues.rgb}, 0.1)`,
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: `rgb(${colorValues.rgb})`,
        pointBorderColor: 'white',
        pointBorderWidth: 2,
      }]
    };
  }, [processedChartData, title, colorValues.rgb]);

  const metrics = [{
    label: title,
    value: value,
    trend: trend ? {
      value: trend,
      label: "vs previous"
    } : undefined
  }];

  const generateWeeklyInsights = () => {
    if (!processedChartData || processedChartData.values.length === 0) return [];
    
    const insights = [];
    
    // Calculate the average
    const avg = processedChartData.values.reduce((sum, val) => sum + Number(val), 0) / processedChartData.values.length;
    insights.push({
      label: "Average",
      value: `${avg.toFixed(1)}${unit}`
    });
    
    // Find the highest value
    const max = Math.max(...processedChartData.values);
    const maxIndex = processedChartData.values.indexOf(max);
    insights.push({
      label: "Peak Value",
      value: `${max}${unit} (${processedChartData.labels[maxIndex]})`
    });
    
    // Calculate week-over-week change if we have enough data
    if (processedChartData.values.length > 1) {
      const current = processedChartData.values[processedChartData.values.length - 1];
      const previous = processedChartData.values[processedChartData.values.length - 2];
      const percentChange = ((current - previous) / previous) * 100;
      
      insights.push({
        label: "Change",
        value: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`
      });
    }
    
    return insights;
  };
  
  const enhancedDetails = [...details, ...generateWeeklyInsights()];

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
        <div className="space-y-6 max-h-[85vh] overflow-y-auto px-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-white z-10 pb-3 pt-1">
            <div className="flex items-center gap-2">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-${color}-400/20 to-${color}-500/20 flex items-center justify-center`}>
                <svg className={`h-5 w-5 text-${color}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{title} History</h3>
            </div>
            <div className="inline-flex p-1 bg-gray-100 rounded-lg shadow-inner">
              {(['week', 'month', '3months', 'year', 'all'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    selectedTimeRange === range
                      ? `bg-white shadow text-${colorValues.text}-600 border border-gray-100`
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {range === 'week' ? 'Week' : 
                   range === 'month' ? 'Month' :
                   range === '3months' ? '3 Months' :
                   range === 'year' ? 'Year' : 'All'}
                </button>
              ))}
            </div>
          </div>
          
          <DataCard
            title=""
            metrics={metrics}
            chart={
              <div className="transition-all duration-300 hover:scale-[1.02]">
                <Line 
                  data={getChartData()} 
                  options={chartOptions}
                />
              </div>
            }
            dataPoints={enhancedDetails}
            className="bg-white/80 backdrop-blur-sm border border-gray-100/80 rounded-2xl"
          />
        </div>
      }
    />
  );
}