import { Metadata } from 'next'
import Pattern from '@/components/Pattern'

export const metadata: Metadata = {
  title: 'Dashboard | FoodSnap',
  description: 'View your nutrition analytics and meal history',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-100 relative">
      <div className="absolute inset-0 opacity-20">
        <Pattern />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 