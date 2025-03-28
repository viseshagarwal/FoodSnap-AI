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

// Update to use the current Gemini Pro Vision model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });

interface FoodAnalysis {
  name: string;
  // Removing description field since it's not in Prisma schema
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  imageUrl?: string;
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
    console.log("Starting meal analysis request...");
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    let userId: string;

    if (session?.user?.email) {
      console.log("User authenticated via NextAuth session:", session.user.email);
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (!user) {
        console.error("User not found in database:", session.user.email);
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      userId = user.id;
    } else {
      // Try JWT token from cookies as fallback
      console.log("No NextAuth session, checking for JWT token");
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;
      
      if (!token) {
        console.error("No authentication token found");
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
        console.log("User authenticated via JWT token, userId:", userId);
      } catch (e) {
        console.error("JWT verification failed:", e);
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
      console.error("No image provided in request");
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    console.log("Image received:", {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    if (!imageFile.type.startsWith('image/')) {
      console.error("Invalid file type:", imageFile.type);
      return NextResponse.json(
        { error: "Invalid file type. Please provide an image." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      console.error("Image too large:", imageFile.size);
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
    
    console.log("Processing image for upload:", filename);
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    try {
      await writeFile(path.join(uploadDir, filename), buffer);
      console.log("Image saved to:", path.join(uploadDir, filename));
    } catch (saveError) {
      console.error("Error saving image file:", saveError);
      return NextResponse.json(
        { error: "Failed to save image" },
        { status: 500 }
      );
    }

    // Convert to base64 for Gemini
    const base64Image = buffer.toString('base64');
    console.log("Base64 image length:", base64Image.length);

    // Generate content with Gemini
    console.log("Sending request to Gemini API...");
    try {
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

      console.log("Received response from Gemini API");
      const response = await result.response;
      const analysisText = response.text();
      console.log("Raw Gemini response:", analysisText);

      try {
        const jsonStr = analysisText.replace(/```json\n?|\n?```/g, "").trim();
        console.log("Cleaned JSON string:", jsonStr);
        
        const foodData = JSON.parse(jsonStr);
        console.log("Parsed food data:", foodData);
        
        // Handle old format responses that might include description
        if (foodData.description) {
          console.log("Removing description field from response");
          delete foodData.description; // Remove description if present
        }
        
        if (!validateAnalysis(foodData)) {
          console.error("Invalid analysis format:", foodData);
          throw new Error("Invalid analysis format");
        }

        // Round numeric values
        foodData.calories = Math.round(foodData.calories);
        foodData.protein = Number(foodData.protein.toFixed(1));
        foodData.carbs = Number(foodData.carbs.toFixed(1));
        foodData.fat = Number(foodData.fat.toFixed(1));

        // Add the image URL to the response
        foodData.imageUrl = `/uploads/${filename}`;
        console.log("Final processed food data:", foodData);

        return NextResponse.json(foodData);
      } catch (parseError) {
        console.error("Error parsing or validating Gemini response:", parseError);
        console.error("Raw text that failed to parse:", analysisText);
        return NextResponse.json(
          { 
            error: "Failed to analyze the image. Please try again.",
            details: parseError instanceof Error ? parseError.message : "Unknown error" 
          },
          { status: 500 }
        );
      }
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      return NextResponse.json(
        { 
          error: "Failed to analyze image with AI",
          details: geminiError instanceof Error ? geminiError.message : "Unknown Gemini error" 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { 
        error: "An unexpected error occurred. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}