import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        goals: true
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user.goals)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const json = await request.json()
    const { dailyCalories, dailyProtein, dailyCarbs, dailyFat } = json

    const goals = await prisma.goal.upsert({
      where: {
        userId: user.id
      },
      update: {
        dailyCalories,
        dailyProtein,
        dailyCarbs,
        dailyFat
      },
      create: {
        userId: user.id,
        dailyCalories,
        dailyProtein,
        dailyCarbs,
        dailyFat
      }
    })

    return NextResponse.json(goals)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
} 