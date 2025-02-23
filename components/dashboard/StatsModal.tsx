"use client";

import React, { useState, useCallback } from "react";
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
import { DataCard } from '@/components/cards';

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

  const metrics = [{
    label: title,
    value: value,
    trend: trend ? {
      value: trend,
      label: "vs previous"
    } : undefined
  }];

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
        <DataCard
          title={title}
          metrics={metrics}
          chart={chartData && <Line data={getChartData()!} options={chartOptions} />}
          dataPoints={details}
        />
      }
    />
  );
}