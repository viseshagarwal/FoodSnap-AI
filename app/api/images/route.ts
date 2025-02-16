import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { uploadImage, deleteImage } from "@/lib/blob";

export async function POST(req: NextRequest) {
  try {
    // Get user token
    const token = await getToken({ req });
    if (!token?.sub) {
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

    // Handle the upload
    const result = await uploadImage(file, token.sub, mealId || undefined);

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
    // Get user token
    const token = await getToken({ req });
    if (!token?.sub) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return new NextResponse("Image ID required", { status: 400 });
    }

    await deleteImage(imageId, token.sub);

    return new NextResponse("Image deleted successfully", { status: 200 });
  } catch (error: any) {
    console.error("Error handling image deletion:", error);
    return new NextResponse(error.message || "Internal Server Error", {
      status: error.status || 500,
    });
  }
}
