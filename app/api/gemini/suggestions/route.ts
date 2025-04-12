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

    // Create Gemini model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig,
      safetySettings,
    });
    
    // Fallback suggestions to use when API fails
    const fallbackSuggestions = {
      suggestions: [
        {
          type: "breakfast",
          name: "Greek Yogurt Bowl",
          calories: 350,
          description: "High-protein breakfast with probiotics and antioxidants",
          ingredients: ["Greek yogurt", "honey", "berries", "granola"],
          macros: { protein: 20, carbs: 40, fat: 10 }
        },
        {
          type: "lunch",
          name: "Quinoa Salad",
          calories: 420,
          description: "Complete protein with fiber-rich vegetables",
          ingredients: ["quinoa", "cucumber", "tomatoes", "feta cheese", "olive oil"],
          macros: { protein: 15, carbs: 50, fat: 18 }
        },
        {
          type: "dinner",
          name: "Baked Salmon with Vegetables",
          calories: 480,
          description: "Omega-3 rich protein with nutrient-dense vegetables",
          ingredients: ["salmon", "broccoli", "sweet potato", "olive oil", "lemon"],
          macros: { protein: 30, carbs: 35, fat: 22 }
        }
      ]
    };
    
    try {
      console.log("Sending prompt to Gemini API...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Enhanced debugging
      console.log("Raw Gemini response length:", text.length);
      console.log("Raw Gemini response first 100 chars:", text.substring(0, 100));
      console.log("Raw Gemini response type:", typeof text);
      
      // Check if response is empty
      if (!text || text.trim() === "") {
        console.log("Empty response received from Gemini API");
        return NextResponse.json(fallbackSuggestions);
      }
      
      try {
        // Enhanced JSON extraction and cleaning
        console.log("Attempting to clean and parse JSON...");
        
        // Remove any markdown code blocks
        let cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
        console.log("After markdown removal:", cleanJson.substring(0, 100));
        
        // Find JSON boundaries more aggressively
        let jsonStart = cleanJson.indexOf("{");
        let jsonEnd = cleanJson.lastIndexOf("}");
        
        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
          console.log("Invalid JSON structure detected, returning fallback");
          return NextResponse.json(fallbackSuggestions);
        }
        
        cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
        console.log("Extracted JSON bounds:", jsonStart, jsonEnd);
        console.log("Final JSON to parse:", cleanJson.substring(0, Math.min(100, cleanJson.length)));
        
        // Try to parse the JSON with error handling
        let suggestions;
        try {
          suggestions = JSON.parse(cleanJson);
          console.log("Successfully parsed JSON");
        } catch (jsonError) {
          console.error("Error parsing cleaned JSON:", jsonError);
          
          // Last attempt - try a more aggressive approach with regex
          try {
            console.log("Trying regex approach to extract JSON...");
            const jsonRegex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g;
            const matches = cleanJson.match(jsonRegex);
            
            if (matches && matches.length > 0) {
              console.log("Found potential JSON with regex");
              suggestions = JSON.parse(matches[0]);
            } else {
              console.log("No valid JSON found with regex either");
              return NextResponse.json(fallbackSuggestions);
            }
          } catch (regexError) {
            console.error("Regex JSON extraction failed:", regexError);
            return NextResponse.json(fallbackSuggestions);
          }
        }
        
        // Validate the suggestions structure
        if (!suggestions || !suggestions.suggestions || !Array.isArray(suggestions.suggestions) || suggestions.suggestions.length === 0) {
          console.log("Invalid suggestions structure, using fallback");
          return NextResponse.json(fallbackSuggestions);
        }
        
        // Additional validation for each suggestion
        interface SuggestionMacros {
          protein: number;
          carbs: number;
          fat: number;
        }

        interface MealSuggestion {
          type: string;
          name: string;
          calories: number;
          description: string;
          ingredients: string[];
          macros: SuggestionMacros;
        }

        interface SuggestionsResponse {
          suggestions: MealSuggestion[];
        }

            const validSuggestions = suggestions.suggestions.filter((suggestion: MealSuggestion): boolean => {
              return suggestion && 
                 typeof suggestion.type === 'string' &&
                 typeof suggestion.name === 'string' &&
                 typeof suggestion.calories === 'number' &&
                 typeof suggestion.description === 'string' &&
                 Array.isArray(suggestion.ingredients) &&
                 suggestion.macros &&
                 typeof suggestion.macros.protein === 'number' &&
                 typeof suggestion.macros.carbs === 'number' &&
                 typeof suggestion.macros.fat === 'number';
            });
        
        if (validSuggestions.length === 0) {
          console.log("No valid suggestions after filtering, using fallback");
          return NextResponse.json(fallbackSuggestions);
        }
        
        // Return the validated suggestions
        return NextResponse.json({ suggestions: validSuggestions });
      } catch (parseError) {
        console.error("Error in JSON processing:", parseError);
        return NextResponse.json(fallbackSuggestions);
      }
    } catch (aiError: any) {
      // Special handling for rate limit errors
      if (aiError?.status === 429 || 
          (aiError.message && aiError.message.includes("quota")) || 
          (aiError.message && aiError.message.includes("Too Many Requests"))) {
        
        console.error("Gemini API rate limit exceeded:", aiError.message);
        
        // Calculate retry time from error if available
        let retryAfter = 30; // Default 30 seconds
        if (aiError.errorDetails) {
          const retryInfo = aiError.errorDetails.find(
            (detail: any) => detail['@type']?.includes('RetryInfo')
          );
          if (retryInfo?.retryDelay) {
            // Parse retry delay if it's in the format "30s"
            const match = retryInfo.retryDelay.match(/(\d+)s/);
            if (match && match[1]) {
              retryAfter = parseInt(match[1], 10);
            }
          }
        }
        
        return NextResponse.json(
          { 
            error: "AI quota limit exceeded", 
            details: "The Gemini API rate limit has been reached. Please try again later.",
            retryAfter
          },
          { 
            status: 429,
            headers: {
              'Retry-After': String(retryAfter)
            }
          }
        );
      }
      
      // For other AI errors, use fallback
      console.error("Error generating AI content:", aiError);
      return NextResponse.json(fallbackSuggestions);
    }
  } catch (error: any) {
    console.error("Error generating meal suggestions:", error);
    // Always return fallback suggestions rather than errors
    return NextResponse.json({
      suggestions: [
        {
          type: "breakfast",
          name: "Greek Yogurt Bowl",
          calories: 350,
          description: "High-protein breakfast with probiotics and antioxidants",
          ingredients: ["Greek yogurt", "honey", "berries", "granola"],
          macros: { protein: 20, carbs: 40, fat: 10 }
        },
        {
          type: "lunch",
          name: "Quinoa Salad",
          calories: 420,
          description: "Complete protein with fiber-rich vegetables",
          ingredients: ["quinoa", "cucumber", "tomatoes", "feta cheese", "olive oil"],
          macros: { protein: 15, carbs: 50, fat: 18 }
        },
        {
          type: "dinner",
          name: "Baked Salmon with Vegetables",
          calories: 480,
          description: "Omega-3 rich protein with nutrient-dense vegetables",
          ingredients: ["salmon", "broccoli", "sweet potato", "olive oil", "lemon"],
          macros: { protein: 30, carbs: 35, fat: 22 }
        }
      ]
    });
  }
}