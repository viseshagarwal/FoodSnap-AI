import { Metadata } from "next";
import Pattern from "@/components/Pattern";

export const metadata: Metadata = {
  title: "Dashboard | FoodSnap",
  description: "View your nutrition analytics and meal history",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="absolute inset-0 bg-grid-indigo-100/[0.05] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-full h-full bg-white rounded-full opacity-30 blur-3xl bg-gradient-to-br from-indigo-200 via-pink-200/40 to-indigo-200" />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
