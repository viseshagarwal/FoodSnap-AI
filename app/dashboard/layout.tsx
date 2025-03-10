"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pattern from "@/components/Pattern";
import DashboardNav from "@/components/DashboardNav";
import DashboardFooter from "@/components/DashboardFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

interface User {
  name?: string | null;
  email?: string;
  image?: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-white/20">
          <div className="flex flex-col items-center">
            <LoadingSpinner 
              size="xl" 
              variant="wave"
              customSize={80}
              className="mb-6"
            />
            <p className="text-gray-600 mt-5 text-center font-medium">
              Preparing your dashboard...
            </p>
            <div className="text-sm text-gray-400 mt-2">Analyzing your nutrition data</div>
            
            <div className="mt-10 flex space-x-3">
              <LoadingSpinner variant="dots" size="sm" className="text-teal-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced background elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/90 via-white to-pink-50/90 -z-20" />
      <div className="fixed inset-0 bg-grid-indigo-100/[0.02] -z-10" />
      
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[70%] h-[40%] bg-teal-100/20 rounded-full opacity-70 blur-3xl transform translate-x-1/4 -translate-y-1/2 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[40%] bg-indigo-100/20 rounded-full opacity-60 blur-3xl transform -translate-x-1/3 translate-y-1/3 animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/3 w-[40%] h-[30%] bg-pink-100/20 rounded-full opacity-40 blur-3xl animate-blob animation-delay-3000" />
      </div>

      {/* Main layout */}
      <DashboardNav
        onLogout={handleLogout}
        userName={user?.name || "User"}
        onAddMeal={handleAddMeal}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        userImage={user?.image}
      />

      <div className="flex-grow flex pt-4">
        {/* Main content */}
        <main className="relative flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {/* Content inner container with glass morphism effect */}
          <div className="bg-white/60 backdrop-blur-xl shadow-lg rounded-3xl p-6 lg:p-8 border border-white/50 transition-all duration-500">
            {children}
          </div>
        </main>
      </div>

      <DashboardFooter />
      
      {/* Add global styles */}
      <style jsx global>{`
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes blob {
          0% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(5%, 5%); }
          66% { transform: scale(0.9) translate(-5%, 5%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
