import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // Get timeframe parameter from URL
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "week"; // Default to 'week' if not provided
    
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
    
    // Define date ranges based on timeframe
    let startDate: Date;
    let periodLabels: string[] = [];
    let periodDates: string[] = [];
    
    const today = new Date();
    
    switch (timeframe) {
      case 'day':
        // Just today
        startDate = startOfDay;
        periodLabels = ['Morning', 'Afternoon', 'Evening', 'Night'];
        // Times of day for day view
        periodDates = [
          new Date(today.setHours(6, 0, 0, 0)).toISOString(),
          new Date(today.setHours(12, 0, 0, 0)).toISOString(),
          new Date(today.setHours(18, 0, 0, 0)).toISOString(),
          new Date(today.setHours(21, 0, 0, 0)).toISOString()
        ];
        break;
        
      case 'month':
        // Last 30 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        
        // Generate labels for each day in the month
        for (let i = 0; i < 30; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          periodLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          periodDates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
        }
        break;
        
      case 'week':
      default:
        // Last 7 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        
        // Day labels for week view (last 7 days)
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          periodLabels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
          periodDates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
        }
        break;
    }
    
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
    
    // Get meals for the selected timeframe
    const timeframeMeals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        mealTime: {
          gte: startDate,
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
    
    // Calculate remaining goals
    const remaining = {
      calories: Math.max(0, activeGoal.dailyCalories - todaysTotals.calories),
      protein: Math.max(0, activeGoal.dailyProtein - todaysTotals.protein),
      carbs: Math.max(0, activeGoal.dailyCarbs - todaysTotals.carbs),
      fat: Math.max(0, activeGoal.dailyFat - todaysTotals.fat)
    };
    
    // Process period data based on timeframe
    const periodData = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
    
    // Initialize all periods with zeros
    periodLabels.forEach(period => {
      periodData.set(period, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    });
    
    // Fill in the data
    timeframeMeals.forEach(meal => {
      const mealDate = new Date(meal.mealTime);
      let periodKey: string;
      
      if (timeframe === 'day') {
        // Assign to morning, afternoon, evening, or night
        const hour = mealDate.getHours();
        if (hour < 12) periodKey = 'Morning';
        else if (hour < 18) periodKey = 'Afternoon';
        else if (hour < 21) periodKey = 'Evening';
        else periodKey = 'Night';
      } else {
        // For week and month, use the day
        periodKey = mealDate.toLocaleDateString('en-US', 
          timeframe === 'week' ? { weekday: 'short' } : { month: 'short', day: 'numeric' }
        );
      }
      
      const current = periodData.get(periodKey) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
      periodData.set(periodKey, {
        calories: current.calories + meal.calories,
        protein: current.protein + meal.protein,
        carbs: current.carbs + meal.carbs,
        fat: current.fat + meal.fat
      });
    });
    
    // Calculate trends based on previous period
    const previousPeriodStart = new Date(startDate);
    const periodDuration = timeframe === 'day' ? 1 : 
                         timeframe === 'week' ? 7 : 30;
    
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDuration);
    
    const previousPeriodMeals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        mealTime: {
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    });
    
    const previousPeriodTotals = previousPeriodMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    
    const currentPeriodTotals = timeframeMeals.reduce(
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
        labels: periodDates,
        values: periodLabels.map(period => periodData.get(period)?.calories || 0)
      },
      protein: {
        labels: periodDates,
        values: periodLabels.map(period => periodData.get(period)?.protein || 0)
      },
      carbs: {
        labels: periodDates,
        values: periodLabels.map(period => periodData.get(period)?.carbs || 0)
      },
      fat: {
        labels: periodDates,
        values: periodLabels.map(period => periodData.get(period)?.fat || 0)
      }
    };
    
    return NextResponse.json({
      todaysTotals,
      remaining,
      chartData,
      timeframe,
      trends: {
        calories: calculateTrend(currentPeriodTotals.calories, previousPeriodTotals.calories),
        protein: calculateTrend(currentPeriodTotals.protein, previousPeriodTotals.protein),
        carbs: calculateTrend(currentPeriodTotals.carbs, previousPeriodTotals.carbs),
        fat: calculateTrend(currentPeriodTotals.fat, previousPeriodTotals.fat)
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