import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize Gemini API with configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.8,
  maxOutputTokens: 1024,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

interface UserStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export async function GET(request: Request) {
  try {
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    let userEmail: string | undefined;
    
    if (session?.user?.email) {
      userEmail = session.user.email;
    } else {
      // Try JWT token from cookies as fallback
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;
      
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          include: {
            goals: {
              where: { isActive: true },
              orderBy: { startDate: 'desc' },
              take: 1,
            }
          }
        });
        
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        userEmail = user.email;
      } catch (e) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    // Get user with active goals and recent meals
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        goals: {
          where: { isActive: true },
          orderBy: { startDate: 'desc' },
          take: 1,
        },
        meals: {
          orderBy: { mealTime: 'desc' },
          take: 10,
        }
      }
    });

    if (!user || !user.goals.length) {
      return NextResponse.json({ error: "No active goals found" }, { status: 404 });
    }

    const activeGoal = user.goals[0];

    // Calculate remaining nutrients for the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysMeals = user.meals.filter(meal => {
      const mealDate = new Date(meal.mealTime);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === today.getTime();
    });

    const consumed: UserStats = todaysMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const remaining: UserStats = {
      calories: Math.max(0, activeGoal.dailyCalories - consumed.calories),
      protein: Math.max(0, activeGoal.dailyProtein - consumed.protein),
      carbs: Math.max(0, activeGoal.dailyCarbs - consumed.carbs),
      fat: Math.max(0, activeGoal.dailyFat - consumed.fat)
    };

    // Generate meal suggestions using Gemini
    const prompt = `As a nutrition expert, suggest 3 healthy meal options for a person with the following remaining daily nutritional goals:
    - Calories: ${remaining.calories} kcal
    - Protein: ${remaining.protein}g
    - Carbs: ${remaining.carbs}g
    - Fat: ${remaining.fat}g

    Consider their recent meals history and suggest a diverse mix of breakfast, lunch, and dinner options.
    Each suggestion should include:
    - Meal type (breakfast/lunch/dinner/snack)
    - Meal name
    - Approximate calories
    - Brief description highlighting nutritional benefits
    - List of main ingredients
    - Approximate macros (protein, carbs, fat)

    Format your response as JSON like this example:
    {
      "suggestions": [
        {
          "type": "breakfast",
          "name": "Protein Oatmeal Bowl",
          "calories": 350,
          "description": "High-fiber breakfast with protein boost",
          "ingredients": ["oats", "protein powder", "banana", "almond milk"],
          "macros": {
            "protein": 25,
            "carbs": 45,
            "fat": 8
          }
        }
      ]
    }

    Important: Return only the JSON data without any markdown formatting or code blocks.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro-exp-03-25",
      generationConfig,
      safetySettings,
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean up the response text by removing markdown code blocks
      const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
      const suggestions = JSON.parse(cleanJson);
      return NextResponse.json(suggestions);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", text);
      return NextResponse.json(
        { error: "Failed to parse meal suggestions", details: text },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating meal suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate meal suggestions" },
      { status: 500 }
    );
  }
}