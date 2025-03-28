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
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mealId = formData.get("mealId") as string | null;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: "No file provided" 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid file type" 
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: "File too large" 
      }, { status: 400 });
    }

    const result = await uploadImage(file, userId, mealId || undefined);
    return NextResponse.json({
      success: true,
      id: result.id,
      url: result.url
    });
  } catch (error: any) {
    console.error("Error handling image upload:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: error.status || 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json({ 
        success: false, 
        error: "Image ID required" 
      }, { status: 400 });
    }

    await deleteImage(imageId, userId);
    return NextResponse.json({ 
      success: true, 
      message: "Image deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error handling image deletion:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: error.status || 500 });
  }
}
