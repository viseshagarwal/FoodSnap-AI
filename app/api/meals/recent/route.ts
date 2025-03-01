import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    let userEmail: string | undefined;
    let userId: string | undefined;

    if (session?.user?.email) {
      userEmail = session.user.email;
    } else {
      // Try JWT token from cookies as fallback
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;
      
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
        
        // Get user email from userId
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        userEmail = user.email;
      } catch (e) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const limitParam = searchParams.get("limit");
    
    // Set default values if not provided
    const days = daysParam ? parseInt(daysParam) : 1; // Default to 1 day (today)
    const limit = limitParam ? parseInt(limitParam) : 5; // Default to 5 meals
    
    // Calculate start date based on days parameter
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1)); // Subtract days-1 to include today
    
    // Calculate end date (end of today)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    // Get recent meals
    const meals = await prisma.meal.findMany({
      where: {
        user: {
          email: userEmail
        },
        mealTime: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        mealTime: 'desc'
      },
      include: {
        images: true,
        ingredients: true
      },
      take: limit
    });

    // Calculate total calories and macros
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
      meals,
      totals,
      period: {
        start: startDate,
        end: endDate,
        days
      }
    });
  } catch (error) {
    console.error("Error fetching recent meals:", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}
