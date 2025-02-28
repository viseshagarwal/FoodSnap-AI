import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { validateMeal } from "@/utils/mealValidation";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const mealType = searchParams.get("type");
    const minCalories = searchParams.get("minCalories");
    const maxCalories = searchParams.get("maxCalories");
    const sortBy = searchParams.get("sortBy") || "mealTime";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {
      user: {
        email: session.user.email
      }
    };

    if (from) {
      where.mealTime = {
        ...where.mealTime,
        gte: new Date(from)
      };
    }

    if (to) {
      where.mealTime = {
        ...where.mealTime,
        lte: new Date(to)
      };
    }

    if (mealType) {
      where.mealType = mealType;
    }

    if (minCalories) {
      where.calories = {
        ...where.calories,
        gte: parseInt(minCalories)
      };
    }

    if (maxCalories) {
      where.calories = {
        ...where.calories,
        lte: parseInt(maxCalories)
      };
    }

    const total = await prisma.meal.count({ where });

    const meals = await prisma.meal.findMany({
      where,
      include: {
        images: true,
        ingredients: true
      },
      orderBy: {
        [sortBy]: order
      },
      skip: (page - 1) * limit,
      take: limit
    });

    return NextResponse.json({
      meals,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      calories, 
      protein, 
      carbs, 
      fat, 
      mealType = "SNACK",
      notes = "",
      images = [],
      ingredients = []
    } = body;

    // Validate meal data
    const validation = validateMeal({ name, calories, protein, carbs, fat });
    if (!validation.isValid) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      );
    }

    // Create meal with associated images and ingredients
    const meal = await prisma.meal.create({
      data: {
        name,
        description: description || "",
        calories,
        protein,
        carbs,
        fat,
        mealType,
        notes,
        userId: user.id,
        mealTime: new Date(),
        images: {
          create: images.map((img: any) => ({
            url: img.url,
            fileName: img.fileName || "meal-image.jpg",
            fileSize: img.fileSize || 0,
            fileType: img.fileType || "image/jpeg",
            userId: user.id
          }))
        },
        ingredients: {
          create: ingredients.map((ingredient: string) => ({
            name: ingredient,
            calories: 0,
            amount: 0,
            unit: "g"
          }))
        }
      },
      include: {
        images: true,
        ingredients: true
      }
    });

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Error creating meal:", error);
    return NextResponse.json(
      { error: "Failed to create meal" },
      { status: 500 }
    );
  }
}
