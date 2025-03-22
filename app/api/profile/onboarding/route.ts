import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
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

    const {
      age,
      height,
      weight,
      gender,
      activityLevel,
      dietaryType,
      weightGoal,
      allergies = [],
      healthConditions = []
    } = await request.json();

    // Basic validation
    if (!age || !height || !weight || !gender || !activityLevel) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Calculate BMR and daily calorie needs based on activity level
    const bmr = calculateBMR(parseInt(age), parseFloat(height), parseFloat(weight), gender);
    const activityMultipliers: { [key: string]: number } = {
      SEDENTARY: 1.2,
      LIGHT: 1.375,
      MODERATE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTRA_ACTIVE: 1.9
    };

    // Calculate daily calories based on activity level and weight goal
    let dailyCalories = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
    if (weightGoal === "LOSE") {
      dailyCalories = Math.round(dailyCalories * 0.8); // 20% deficit
    } else if (weightGoal === "GAIN") {
      dailyCalories = Math.round(dailyCalories * 1.2); // 20% surplus
    }

    // Update user profile with the new information
    const updatedUser = await prisma.user.update({
      where: {
        email: userEmail
      },
      data: {
        profile: {
          upsert: {
            create: {
              age: parseInt(age),
              height: parseFloat(height),
              weight: parseFloat(weight),
              gender,
              activityLevel,
              dietaryType,
              weightGoal,
              allergies,
              healthConditions
            },
            update: {
              age: parseInt(age),
              height: parseFloat(height),
              weight: parseFloat(weight),
              gender,
              activityLevel,
              dietaryType,
              weightGoal,
              allergies,
              healthConditions
            }
          }
        },
        goals: {
          create: {
            dailyCalories,
            dailyProtein: Math.round(dailyCalories * 0.3 / 4), // 30% of calories from protein
            dailyCarbs: Math.round(dailyCalories * 0.4 / 4),   // 40% of calories from carbs
            dailyFat: Math.round(dailyCalories * 0.3 / 9),     // 30% of calories from fat
            isActive: true,
            startDate: new Date()
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// Helper function to calculate Basal Metabolic Rate (BMR)
function calculateBMR(age: number, height: number, weight: number, gender: string): number {
  // Using Mifflin-St Jeor Equation
  const bmr = 10 * weight + 6.25 * height - 5 * age;
  return gender === "FEMALE" ? bmr - 161 : bmr + 5;
}