import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get recent meals for the user
    const recentMeals = await prisma.meal.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        mealTime: "desc",
      },
      take: 5, // Limit to 5 most recent meals
      select: {
        id: true,
        name: true,
        calories: true,
        mealTime: true,
      },
    });

    // Transform the data to match the expected format
    const formattedMeals = recentMeals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      calories: meal.calories,
      timestamp: meal.mealTime.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      meals: formattedMeals,
    });
  } catch (error) {
    console.error("Error fetching recent meals:", error);
    return NextResponse.json(
      { error: "Error fetching recent meals" },
      { status: 500 }
    );
  }
}
