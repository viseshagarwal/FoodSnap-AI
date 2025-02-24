"use client";

import { Suspense } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentMeals from "@/components/dashboard/RecentMeals";

export default function Dashboard() {
  return (
    <main>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your nutrition journey and stay on top of your goals.
        </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <StatsGrid />
      </Suspense>

      <div className="mt-8">
        <Suspense fallback={<div>Loading meals...</div>}>
          <RecentMeals />
        </Suspense>
      </div>
    </main>
  );
}
