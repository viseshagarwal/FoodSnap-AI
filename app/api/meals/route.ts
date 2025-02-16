import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
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

    const meals = await prisma.meal.findMany({
      where: { userId: user.id },
      include: {
        ingredients: true,
        images: true,
      },
      orderBy: {
        mealTime: "desc",
      },
    });

    return NextResponse.json(meals);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const {
      name,
      description,
      imageUrl,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      mealType = "SNACK", // Default to SNACK if not provided
      servingSize,
      servingUnit,
      mealTime = new Date(), // Default to current time if not provided
    } = json;

    // Validate required fields
    if (!name || !calories || typeof calories !== "number") {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create base meal data
    const mealData = {
      name,
      description: description || null,
      calories,
      protein: protein || null,
      carbs: carbs || null,
      fat: fat || null,
      mealType,
      servingSize: servingSize || null,
      servingUnit: servingUnit || null,
      mealTime,
      userId: user.id,
    };

    // Create the meal with all its relations
    const meal = await prisma.meal.create({
      data: {
        ...mealData,
        ingredients:
          ingredients?.length > 0
            ? {
                create: ingredients.map((ingredient: any) => ({
                  name: ingredient.name,
                  calories: ingredient.calories,
                  protein: ingredient.protein || null,
                  carbs: ingredient.carbs || null,
                  fat: ingredient.fat || null,
                  amount: ingredient.amount,
                  unit: ingredient.unit,
                  isVerified: false,
                })),
              }
            : undefined,
        images: imageUrl
          ? {
              create: {
                url: imageUrl,
                fileName: `meal-${Date.now()}.jpg`,
                fileSize: 0,
                fileType: "image/jpeg",
                userId: user.id,
                isProcessed: true,
              },
            }
          : undefined,
      },
      include: {
        ingredients: true,
        images: true,
      },
    });

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Error creating meal:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
