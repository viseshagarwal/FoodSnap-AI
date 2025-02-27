import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get the JWT token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      console.log("Unauthorized: No JWT token found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    
    const userId = decoded.userId;
    console.log("User authenticated with ID:", userId);

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Returning profile data for user:", user.name || user.email);
    
    // Create a simplified profile object with directly available data
    // This avoids potential errors from missing tables/relationships
    const profile = {
      id: user.id,
      name: user.name || "User",
      email: user.email,
      dailyGoal: 2000, // Default value
      streakDays: 0,
      achievements: [] as string[], // Explicitly type achievements as string[]
      weightGoal: null as string | null,
      height: null as number | null,
      weight: null as number | null,
    };

    // Try to fetch additional user profile data if available
    try {
      const userProfile = await prisma.profile.findUnique({
        where: { userId: user.id },
      });
      
      if (userProfile) {
        profile.weightGoal = userProfile.weightGoal;
        profile.height = userProfile.height;
        profile.weight = userProfile.weight;
      }
    } catch (err) {
      console.log("No profile data found, using defaults");
    }

    // Try to fetch achievement data
    try {
      // Correct the Prisma model name to Goal
      const userAchievements = await prisma.goal.findMany({
        where: { userId: user.id },
      });
      
      if (userAchievements.length > 0) {
        profile.achievements = userAchievements.map(goal => 
          `${goal.dailyCalories} cal goal` // Using a property we know exists in the Goal model
        );
      }
    } catch (err) {
      console.log("No achievement data found");
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    
    // Return a more helpful error response
    return NextResponse.json(
      { 
        error: "Failed to fetch profile data", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate user streak
async function calculateUserStreak(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Using meal instead of mealLog based on Prisma schema
    const mealLogs = await prisma.meal.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
      },
      take: 30,
    }).catch(() => []);

    if (mealLogs.length === 0) {
      return 0;
    }
    
    const logDates = mealLogs.map((log) => {
      const date = new Date(log.createdAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });
    
    // Fix type issues with Set and sort
    const uniqueDates = [...new Set(logDates)].sort((a, b) => b - a);
    
    // Rest of the function remains the same
    let streak = 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    const hasLogForToday = uniqueDates.includes(today.getTime());
    
    if (hasLogForToday) {
      streak = 1;
      let lastDate = today.getTime();
      
      for (let i = 0; i < uniqueDates.length; i++) {
        if (uniqueDates[i] === today.getTime()) continue;
        
        if (lastDate - uniqueDates[i] === oneDayMs) {
          streak++;
          lastDate = uniqueDates[i];
        } else {
          break;
        }
      }
    }
    
    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
}