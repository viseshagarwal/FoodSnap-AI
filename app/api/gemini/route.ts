import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Create a unique filename
    const uniqueId = uuidv4();
    const extension = imageFile.name.split(".").pop();
    const filename = `${uniqueId}.${extension}`;

    // Save the image to public/uploads
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists in public folder
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);

    // Convert image to base64 for Gemini API
    const base64Image = buffer.toString("base64");

    // Initialize Gemini Vision model with the newer version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Analyze the image with Gemini
    const result = await model.generateContent([
      {
        text: "You are a nutritionist. Analyze this food image and provide the following information in a valid JSON format with these exact keys: name (string), description (string), calories (number), protein (number), carbs (number), fat (number). Ensure the response is strictly in JSON format.",
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

    // Parse the JSON response from Gemini
    let foodData;
    try {
      // Clean the response text to ensure it's valid JSON
      const jsonStr = analysisText.replace(/```json\n?|\n?```/g, "").trim();
      foodData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON parsing error:", e);
      // If parsing fails, provide structured data
      foodData = {
        name: "Unknown Food",
        description: "Could not analyze the food image properly.",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }

    const responseData = {
      name: foodData.name || "Unknown Food",
      description: foodData.description || "",
      imageUrl: `/uploads/${filename}`,
      calories: typeof foodData.calories === "number" ? foodData.calories : 0,
      protein: typeof foodData.protein === "number" ? foodData.protein : 0,
      carbs: typeof foodData.carbs === "number" ? foodData.carbs : 0,
      fat: typeof foodData.fat === "number" ? foodData.fat : 0,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
