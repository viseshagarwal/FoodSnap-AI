import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get today's start and end time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get recent meals for today
    const meals = await prisma.meal.findMany({
      where: {
        user: {
          email: session.user.email
        },
        mealTime: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: {
        mealTime: 'desc'
      },
      include: {
        images: true
      },
      take: 5 // Limit to 5 most recent meals
    });

    // Calculate total calories and macros for today
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });

    return NextResponse.json({
      meals: meals.map(meal => ({
        ...meal,
        timestamp: meal.mealTime
      })),
      totals
    });
  } catch (error) {
    console.error("Error fetching recent meals:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
