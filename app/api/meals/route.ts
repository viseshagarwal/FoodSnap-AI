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
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const meals = await prisma.meal.findMany({
      where: { userId: user.id },
      include: {
        ingredients: true,
        images: true
      },
      orderBy: {
        mealTime: 'desc'
      }
    })

    return NextResponse.json(meals)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(request: Request) {
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
    const { name, description, imageUrl, calories, protein, carbs, fat, ingredients } = json

    const meal = await prisma.meal.create({
      data: {
        name,
        description,
        calories,
        protein,
        carbs,
        fat,
        userId: user.id,
        ingredients: {
          create: ingredients
        },
        images: imageUrl ? {
          create: {
            url: imageUrl,
            fileName: `meal-${Date.now()}.jpg`,
            fileSize: 0, // This would need to be calculated from the actual image
            fileType: 'image/jpeg',
            userId: user.id,
            isProcessed: true
          }
        } : undefined
      },
      include: {
        ingredients: true,
        images: true
      }
    })

    return NextResponse.json(meal)
  } catch (error) {
    console.error('Error creating meal:', error);
    return new NextResponse('Internal Error', { status: 500 })
  }
} 