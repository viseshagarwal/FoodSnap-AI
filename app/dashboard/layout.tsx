import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | FoodSnap',
  description: 'View your nutrition analytics and meal history',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 