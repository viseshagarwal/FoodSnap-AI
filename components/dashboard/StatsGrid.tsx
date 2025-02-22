"use client";

import { useState } from "react";
import { FaFire, FaBullseye, FaDumbbell, FaChartLine } from "react-icons/fa";
import StatsCard from "./StatsCard";
import StatsModal from "./StatsModal";

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

export default function StatsGrid() {
  const [selectedStat, setSelectedStat] = useState<StatDetails | null>(null);

  const stats: StatDetails[] = [
    {
      title: "Today's Calories",
      value: "1,200",
      unit: "cal",
      trend: 5,
      color: "orange",
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [1100, 1300, 1200, 900, 1500, 1200, 1200],
      },
      details: [
        { label: "Daily Goal", value: "2,000 cal" },
        { label: "Average This Week", value: "1,200 cal" },
        { label: "Protein Ratio", value: "25%" },
        { label: "Carbs Ratio", value: "50%" },
      ],
    },
    {
      title: "Remaining Goal",
      value: "800",
      unit: "cal",
      color: "indigo",
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [900, 700, 800, 1100, 500, 800, 800],
      },
      details: [
        { label: "Daily Goal", value: "2,000 cal" },
        { label: "Time to Goal", value: "8 hours" },
        { label: "Goal Progress", value: "60%" },
      ],
    },
    {
      title: "Protein",
      value: "65",
      unit: "g",
      trend: -2,
      color: "purple",
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [70, 65, 80, 60, 75, 65, 65],
      },
      details: [
        { label: "Daily Goal", value: "120g" },
        { label: "Average This Week", value: "68g" },
        { label: "Protein/kg", value: "1.2g" },
      ],
    },
    {
      title: "Weekly Progress",
      value: "85",
      unit: "%",
      trend: 12,
      color: "pink",
      chartData: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        values: [65, 70, 78, 85],
      },
      details: [
        { label: "Goals Met", value: "12/14" },
        { label: "Streak", value: "5 days" },
        { label: "Monthly Trend", value: "+15%" },
      ],
    },
  ];

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
            color={stat.color}
            onClick={() => setSelectedStat(stat)}
          />
        ))}
      </div>

      <StatsModal
        isOpen={!!selectedStat}
        onClose={() => setSelectedStat(null)}
        title={selectedStat?.title || ""}
        value={selectedStat?.value || ""}
        trend={selectedStat?.trend}
        chartData={selectedStat?.chartData}
        color={selectedStat?.color}
        unit={selectedStat?.unit}
        details={selectedStat?.details}
      />
    </>
  );
}
