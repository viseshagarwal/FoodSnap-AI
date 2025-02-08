import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | FoodSnap',
  description: 'Login to your FoodSnap account',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 