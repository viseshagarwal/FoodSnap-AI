"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Metadata } from "next";
import Pattern from "@/components/Pattern";
import DashboardNav from "@/components/DashboardNav";
import DashboardFooter from "@/components/DashboardFooter";

interface User {
  name?: string | null;
}

export const metadata: Metadata = {
  title: "Dashboard | FoodSnap",
  description: "View your nutrition analytics and meal history",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="absolute inset-0 bg-grid-indigo-100/[0.05] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-full h-full bg-white rounded-full opacity-30 blur-3xl bg-gradient-to-br from-indigo-200 via-pink-200/40 to-indigo-200" />
      </div>
      <DashboardNav
        onLogout={handleLogout}
        userName={user?.name || "User"}
        onAddMeal={handleAddMeal}
      />
      <div className="relative z-10 container mx-auto px-4 py-8 flex-grow">
        {children}
      </div>
      <DashboardFooter />
    </div>
  );
}
