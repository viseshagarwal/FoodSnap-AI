import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { validateMeal } from "@/utils/mealValidation";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    // Build where clause
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

    // Get total count for pagination
    const total = await prisma.meal.count({ where });

    // Get meals with pagination
    const meals = await prisma.meal.findMany({
      where,
      include: {
        images: true
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
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await request.json();
    const { name, calories, protein, carbs, fat, mealType, images = [], ingredients = [] } = body;

    // Validate meal data
    const validation = validateMeal({ name, calories, protein, carbs, fat });
    if (!validation.isValid) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      );
    }

    // Create meal with associated images
    const meal = await prisma.meal.create({
      data: {
        name,
        calories,
        protein,
        carbs,
        fat,
        mealType: mealType || "SNACK",
        ingredients: {
          create: ingredients.map((ingredient: string) => ({
            name: ingredient,
            calories: 0, // These will be updated later with actual values
            amount: 0,
            unit: "g"
          }))
        },
        userId: user.id,
        images: {
          create: images.map((img: any) => ({
            url: img.url,
            fileName: img.fileName || "meal-image.jpg",
            fileSize: img.fileSize || 0,
            fileType: img.fileType || "image/jpeg",
            userId: user.id
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
    return new NextResponse("Internal Error", { status: 500 });
  }
}
