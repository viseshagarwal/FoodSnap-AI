import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  // Add response caching
  const cacheResponse = await caches.open("goals-cache");
  const cachedResponse = await cacheResponse.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        goals: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const response = new Response(JSON.stringify(user.goals), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=60, stale-while-revalidate=600",
      },
    });

    // Cache the response
    await cacheResponse.put(request, response.clone());

    return response;
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const json = await request.json();
    const { dailyCalories, dailyProtein, dailyCarbs, dailyFat } = json;

    // First, deactivate any existing active goals
    await prisma.goal.updateMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      data: {
        isActive: false,
        endDate: new Date(),
      },
    });

    // Then create a new active goal
    const goals = await prisma.goal.create({
      data: {
        userId: user.id,
        dailyCalories,
        dailyProtein,
        dailyCarbs,
        dailyFat,
        isActive: true,
        startDate: new Date(),
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error updating goals:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
