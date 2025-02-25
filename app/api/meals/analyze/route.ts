import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

interface FoodAnalysis {
  name: string;
  description: string;
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
    typeof data.description === 'string' &&
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
    // Get session and verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: "Not authenticated" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get and validate form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    
    if (!imageFile) {
      return new NextResponse(JSON.stringify({ error: "No image provided" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!imageFile.type.startsWith('image/')) {
      return new NextResponse(JSON.stringify({ error: "Invalid file type. Please provide an image." }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return new NextResponse(JSON.stringify({ error: "Image size too large. Maximum size is 5MB." }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert image to base64
    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    // Analyze with Gemini
    const result = await model.generateContent([
      {
        text: "You are a nutritionist. Analyze this food image and provide the following information in a valid JSON format with these exact keys: name (string), description (string), calories (number), protein (number), carbs (number), fat (number), ingredients (array of strings). Ensure the response is strictly in JSON format with numeric values for nutritional information. Round decimals to one place.",
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

      if (!validateAnalysis(foodData)) {
        throw new Error("Invalid analysis format");
      }

      // Round numeric values
      foodData.calories = Math.round(foodData.calories);
      foodData.protein = Number(foodData.protein.toFixed(1));
      foodData.carbs = Number(foodData.carbs.toFixed(1));
      foodData.fat = Number(foodData.fat.toFixed(1));

      return NextResponse.json(foodData);
    } catch (e) {
      console.error("Analysis validation error:", e);
      return new NextResponse(JSON.stringify({ error: "Failed to analyze the image. Please try again." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    return new NextResponse(JSON.stringify({ error: "An unexpected error occurred. Please try again." }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}