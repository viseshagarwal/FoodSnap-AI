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
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId }
        });
        
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        userEmail = user.email;
      } catch (e) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    // Get user with active goals
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        goals: {
          where: { isActive: true },
          orderBy: { startDate: 'desc' },
          take: 1,
        }
      }
    });

    if (!user || !user.goals.length) {
      return NextResponse.json({ error: "No active goals found" }, { status: 404 });
    }

    const activeGoal = user.goals[0];

    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Get this week's range
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    // Get today's meals
    const todaysMeals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        mealTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    // Get this week's meals for the chart
    const weeklyMeals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        mealTime: {
          gte: startOfWeek,
          lte: endOfDay
        }
      },
      orderBy: {
        mealTime: 'asc'
      }
    });

    // Calculate daily totals
    const todaysTotals = todaysMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Calculate daily averages for the past week
    const dailyTotals = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    weeklyMeals.forEach(meal => {
      const day = days[new Date(meal.mealTime).getDay()];
      const current = dailyTotals.get(day) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
      dailyTotals.set(day, {
        calories: current.calories + meal.calories,
        protein: current.protein + meal.protein,
        carbs: current.carbs + meal.carbs,
        fat: current.fat + meal.fat
      });
    });

    // Calculate remaining goals
    const remaining = {
      calories: Math.max(0, activeGoal.dailyCalories - todaysTotals.calories),
      protein: Math.max(0, activeGoal.dailyProtein - todaysTotals.protein),
      carbs: Math.max(0, activeGoal.dailyCarbs - todaysTotals.carbs),
      fat: Math.max(0, activeGoal.dailyFat - todaysTotals.fat)
    };

    // Calculate week over week trends
    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    
    const previousWeekMeals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        mealTime: {
          gte: previousWeekStart,
          lt: startOfWeek
        }
      }
    });

    const previousWeekTotals = previousWeekMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const currentWeekTotals = weeklyMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Prepare chart data
    const chartData = {
      calories: {
        labels: days,
        values: days.map(day => dailyTotals.get(day)?.calories || 0)
      },
      protein: {
        labels: days,
        values: days.map(day => dailyTotals.get(day)?.protein || 0)
      },
      carbs: {
        labels: days,
        values: days.map(day => dailyTotals.get(day)?.carbs || 0)
      },
      fat: {
        labels: days,
        values: days.map(day => dailyTotals.get(day)?.fat || 0)
      }
    };

    return NextResponse.json({
      todaysTotals,
      remaining,
      chartData,
      trends: {
        calories: calculateTrend(currentWeekTotals.calories, previousWeekTotals.calories),
        protein: calculateTrend(currentWeekTotals.protein, previousWeekTotals.protein),
        carbs: calculateTrend(currentWeekTotals.carbs, previousWeekTotals.carbs),
        fat: calculateTrend(currentWeekTotals.fat, previousWeekTotals.fat)
      },
      goals: {
        calories: activeGoal.dailyCalories,
        protein: activeGoal.dailyProtein,
        carbs: activeGoal.dailyCarbs,
        fat: activeGoal.dailyFat
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}