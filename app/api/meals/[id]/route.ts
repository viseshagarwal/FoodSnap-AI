import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { validateMeal } from "@/utils/mealValidation";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const meal = await prisma.meal.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email
        }
      },
      include: {
        images: true
      }
    });

    if (!meal) {
      return new NextResponse("Meal not found", { status: 404 });
    }

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Error fetching meal:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const meal = await prisma.meal.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email
        }
      }
    });

    if (!meal) {
      return new NextResponse("Meal not found", { status: 404 });
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

    // Update meal with images and ingredients
    const updatedMeal = await prisma.meal.update({
      where: {
        id: params.id
      },
      data: {
        name,
        calories,
        protein,
        carbs,
        fat,
        mealType,
        ingredients: {
          deleteMany: {},
          create: ingredients.map((ingredient: string) => ({
            name: ingredient,
            calories: 0, // These will be updated later with actual values
            amount: 0,
            unit: "g"
          }))
        },
        images: {
          deleteMany: {},
          create: images.map((img: any) => ({
            url: img.url,
            fileName: img.fileName || "meal-image.jpg",
            fileSize: img.fileSize || 0,
            fileType: img.fileType || "image/jpeg",
            userId: meal.userId
          }))
        }
      },
      include: {
        images: true,
        ingredients: true
      }
    });

    return NextResponse.json(updatedMeal);
  } catch (error) {
    console.error("Error updating meal:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const meal = await prisma.meal.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email
        }
      }
    });

    if (!meal) {
      return new NextResponse("Meal not found", { status: 404 });
    }

    await prisma.meal.delete({
      where: {
        id: params.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting meal:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}