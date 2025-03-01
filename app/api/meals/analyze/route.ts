import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Update to use gemini-2.0-pro-vision model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface FoodAnalysis {
  name: string;
  // Removing description field since it's not in Prisma schema
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

const validateAnalysis = (data: any): data is FoodAnalysis => {
  return (
    typeof data === 'object' &&
    typeof data.name === 'string' &&
    // Removed description validation
    typeof data.calories === 'number' &&
    typeof data.protein === 'number' &&
    typeof data.carbs === 'number' &&
    typeof data.fat === 'number' &&
    Array.isArray(data.ingredients) &&
    data.ingredients.every((i: unknown) => typeof i === 'string')
  );
};

export async function POST(request: Request) {
  try {
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    let userId: string;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      userId = user.id;
    } else {
      // Try JWT token from cookies as fallback
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;
      
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
      } catch (e) {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }
    }

    // Get and validate form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Invalid file type. Please provide an image." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: "Image size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Save image to public/uploads
    const uniqueId = uuidv4();
    const extension = imageFile.name.split(".").pop();
    const filename = `${uniqueId}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);

    // Convert to base64 for Gemini
    const base64Image = buffer.toString('base64');

    // Updated prompt for new model - Removed description request
    const result = await model.generateContent([
      {
        text: "You are a nutritionist. Please analyze this food image to identify its nutritional content. Provide all values in grams (g) and calories (kcal). Output only a valid JSON object with exactly these keys and types:\n\n{\"name\": \"string\", \"calories\": number, \"protein\": number, \"carbs\": number, \"fat\": number, \"ingredients\": [\"string\"]}\n\nEnsure all numerical values are realistic for a single serving and round to 1 decimal place.",
      },
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const analysisText = response.text();

    try {
      const jsonStr = analysisText.replace(/```json\n?|\n?```/g, "").trim();
      const foodData = JSON.parse(jsonStr);
      
      // Handle old format responses that might include description
      if (foodData.description) {
        delete foodData.description; // Remove description if present
      }
      
      if (!validateAnalysis(foodData)) {
        throw new Error("Invalid analysis format");
      }

      // Round numeric values
      foodData.calories = Math.round(foodData.calories);
      foodData.protein = Number(foodData.protein.toFixed(1));
      foodData.carbs = Number(foodData.carbs.toFixed(1));
      foodData.fat = Number(foodData.fat.toFixed(1));

      // Add the image URL to the response
      

      return NextResponse.json(foodData);
    } catch (e) {
      console.error("Analysis validation error:", e);
      return NextResponse.json(
        { error: "Failed to analyze the image. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}