import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
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

    // Get the user with their goals
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        goals: {
          orderBy: {
            startDate: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If no goals exist, create default goals
    if (user.goals.length === 0) {
      const defaultGoal = await prisma.goal.create({
        data: {
          userId: user.id,
          dailyCalories: 2000,
          dailyProtein: 150,
          dailyCarbs: 225,
          dailyFat: 55,
          isActive: true,
          startDate: new Date()
        }
      });
      return NextResponse.json([defaultGoal]);
    }

    return NextResponse.json(user.goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        goals: {
          where: { isActive: true },
          take: 1
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const json = await request.json();
    const { dailyCalories, dailyProtein, dailyCarbs, dailyFat, updateExisting = false } = json;
    
    // Validate the input
    if (typeof dailyCalories !== 'number' || dailyCalories < 0) {
      return NextResponse.json({ error: "Invalid calorie value" }, { status: 400 });
    }
    if (typeof dailyProtein !== 'number' || dailyProtein < 0) {
      return NextResponse.json({ error: "Invalid protein value" }, { status: 400 });
    }
    if (typeof dailyCarbs !== 'number' || dailyCarbs < 0) {
      return NextResponse.json({ error: "Invalid carbs value" }, { status: 400 });
    }
    if (typeof dailyFat !== 'number' || dailyFat < 0) {
      return NextResponse.json({ error: "Invalid fat value" }, { status: 400 });
    }
    
    let goal;
    
    // Use a transaction to ensure database consistency
    await prisma.$transaction(async (tx) => {
      const activeGoal = user.goals[0];
      
      // If updateExisting is true and there's an active goal, update it
      if (updateExisting && activeGoal) {
        goal = await tx.goal.update({
          where: { id: activeGoal.id },
          data: {
            dailyCalories,
            dailyProtein,
            dailyCarbs,
            dailyFat,
            updatedAt: new Date()
          }
        });
      } else {
        // Otherwise, deactivate existing active goals and create a new one
        if (activeGoal) {
          await tx.goal.update({
            where: { id: activeGoal.id },
            data: {
              isActive: false,
              endDate: new Date()
            }
          });
        }
        
        // Create a new active goal
        goal = await tx.goal.create({
          data: {
            userId: user.id,
            dailyCalories,
            dailyProtein,
            dailyCarbs,
            dailyFat,
            isActive: true,
            startDate: new Date()
          }
        });
      }
    });
    
    // Fetch the newly created or updated goal
    const updatedGoals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { startDate: 'desc' }
    });
    
    return NextResponse.json(updatedGoals);
  } catch (error) {
    console.error("Error updating goals:", error);
    return NextResponse.json(
      { error: "Failed to update goals" },
      { status: 500 }
    );
  }
}
