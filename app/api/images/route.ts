import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/blob";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function getUserId(req: NextRequest) {
  // Try NextAuth session first
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  // Try JWT token
  const token = cookies().get("token")?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mealId = formData.get("mealId") as string | null;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return new NextResponse("Invalid file type", { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new NextResponse("File too large", { status: 400 });
    }

    const result = await uploadImage(file, userId, mealId || undefined);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error handling image upload:", error);
    return new NextResponse(error.message || "Internal Server Error", {
      status: error.status || 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return new NextResponse("Image ID required", { status: 400 });
    }

    await deleteImage(imageId, userId);
    return new NextResponse("Image deleted successfully", { status: 200 });
  } catch (error: any) {
    console.error("Error handling image deletion:", error);
    return new NextResponse(error.message || "Internal Server Error", {
      status: error.status || 500 },
    );
  }
}
