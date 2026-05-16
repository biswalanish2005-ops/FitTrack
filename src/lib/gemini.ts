import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getDietRecommendation(userData: any) {
  const prompt = `Based on the following user data:
    Weight: ${userData.weight}kg
    Height: ${userData.height}cm
    Age: ${userData.age}
    Activity Level: ${userData.activityLevel}
    Goal: ${userData.goal}
    Preferences: ${userData.preferences}

    Generate a personalized daily meal plan (Breakfast, Lunch, Dinner, Snack) with calorie and protein targets.
    Return the response in a structured format suitable for displaying in cards.
    Mention specific Indian dishes if appropriate (since requested).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Could not generate recommendations at this time.";
  }
}

export { ai };
