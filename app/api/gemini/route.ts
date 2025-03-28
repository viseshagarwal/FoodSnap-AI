import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    // Check authentication - try NextAuth session first
    const session = await getServerSession(authOptions);
    let userId: string | undefined;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Try JWT token from cookies as fallback
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;
      
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
      } catch (e) {
        console.error("JWT verification error:", e);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    console.log("Authentication passed, user ID:", userId);

    // If we get here, the user is authenticated
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      console.error("No image provided in request");
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    console.log("Image received:", {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    // Create a unique filename
    const uniqueId = uuidv4();
    const extension = imageFile.name.split(".").pop();
    const filename = `${uniqueId}.${extension}`;

    // Save the image to public/uploads
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists in public folder
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Create the uploads directory if it doesn't exist
    try {
      await fs.promises.access(uploadDir);
    } catch (error) {
      console.log("Creating uploads directory...");
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    console.log("Saving image to:", filePath);
    await writeFile(filePath, buffer);
    console.log("Image saved successfully");

    // Convert image to base64 for Gemini API
    const base64Image = buffer.toString("base64");
    console.log("Image converted to base64, length:", base64Image.length);
    
    // Initialize Gemini Vision model with a valid model name
    console.log("Initializing Gemini model: gemini-2.5-pro-exp-03-25");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });
    
    // Analyze the image with Gemini
    console.log("Sending request to Gemini API...");
    try {
      const result = await model.generateContent([
        {
          text: "You are a professional nutritionist. Analyze this food image in detail and provide the following information in a valid JSON format with these exact keys: name (string), calories (number), protein (number), carbs (number), fat (number), ingredients (array of strings). Be precise with nutritional values and ensure the response is strictly in JSON format.",
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
      console.log("Raw Gemini API response:", analysisText);

      // Parse the JSON response from Gemini
      let foodData;
      try {
        // Clean the response text to ensure it's valid JSON
        const jsonStr = analysisText.replace(/```json\n?|\n?```/g, "").trim();
        console.log("JSON string after cleanup:", jsonStr);
        foodData = JSON.parse(jsonStr);
        console.log("Successfully parsed JSON data:", foodData);
      } catch (e) {
        console.error("JSON parsing error:", e);
        console.error("Raw text that failed to parse:", analysisText);
        // If parsing fails, provide structured data
        foodData = {
          name: "Unknown Food",
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          ingredients: []
        };
      }

      const responseData = {
        name: foodData.name || "Unknown Food",
        imageUrl: `/uploads/${filename}`,
        calories: typeof foodData.calories === "number" ? foodData.calories : 0,
        protein: typeof foodData.protein === "number" ? foodData.protein : 0,
        carbs: typeof foodData.carbs === "number" ? foodData.carbs : 0,
        fat: typeof foodData.fat === "number" ? foodData.fat : 0,
        ingredients: Array.isArray(foodData.ingredients) ? foodData.ingredients : []
      };

      console.log("Sending final response to client:", responseData);
      return NextResponse.json(responseData);
    } catch (geminiError) {
      console.error("Gemini API call error:", geminiError);
      if (geminiError instanceof Error) {
        console.error("Gemini error stack:", geminiError.stack);
      }
      return NextResponse.json(
        {
          error: "Failed to analyze image with Gemini",
          details: geminiError instanceof Error ? geminiError.message : "Unknown Gemini error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
