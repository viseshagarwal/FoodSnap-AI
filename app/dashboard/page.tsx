"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentMeals from "@/components/dashboard/RecentMeals";
import DashboardFooter from "@/components/DashboardFooter";

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAddMeal = () => {
    router.push("/dashboard/meals/add");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav
        onLogout={handleLogout}
        userName={user?.name || "User"}
        onAddMeal={handleAddMeal}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name || "User"}
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
      <DashboardFooter />
    </div>
  );
}
