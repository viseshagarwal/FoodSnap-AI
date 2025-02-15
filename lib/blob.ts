import { put, del } from '@vercel/blob';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import prisma from './prisma';

export async function uploadImage(
  file: File,
  userId: string,
  mealId?: string
): Promise<{ id: string; url: string }> {
  try {
    // Upload to Vercel Blob
    const { url } = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
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
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(imageId: string, userId: string): Promise<void> {
  try {
    // Get image details from database
    const image = await prisma.foodImage.findFirst({
      where: {
        id: imageId,
        userId,
      },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    // Delete from Vercel Blob
    await del(image.url);

    // Delete from database
    await prisma.foodImage.delete({
      where: {
        id: imageId,
      },
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

export async function processImage(imageId: string): Promise<void> {
  try {
    // Update image processing status
    await prisma.foodImage.update({
      where: {
        id: imageId,
      },
      data: {
        isProcessed: true,
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
} 