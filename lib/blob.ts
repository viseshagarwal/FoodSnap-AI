import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export async function uploadImage(
  file: File,
  userId: string,
  mealId?: string
): Promise<{ id: string; url: string }> {
  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;

    // Upload to Vercel Blob
    const { url } = await put(uniqueFilename, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    // Create record in database
    const image = await prisma.foodImage.create({
      data: {
        url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId,
        mealId,
        isProcessed: false,
      },
    });

    return { id: image.id, url };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to upload image");
  }
}

export async function deleteImage(
  imageId: string,
  userId: string
): Promise<void> {
  try {
    // Find the image and verify ownership
    const image = await prisma.foodImage.findFirst({
      where: {
        id: imageId,
        userId,
      },
    });

    if (!image) {
      throw new Error("Image not found or unauthorized");
    }

    // Delete from Vercel Blob
    try {
      await del(image.url);
    } catch (error) {
      console.error("Error deleting from blob storage:", error);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await prisma.foodImage.delete({
      where: {
        id: imageId,
      },
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to delete image");
  }
}

export async function processImage(imageId: string): Promise<void> {
  try {
    const image = await prisma.foodImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new Error("Image not found");
    }

    await prisma.foodImage.update({
      where: { id: imageId },
      data: { isProcessed: true },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to process image");
  }
}
