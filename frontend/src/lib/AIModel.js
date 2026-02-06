import { GoogleGenAI } from "@google/genai";

let ai = null;

function getAIClient() {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Google GenAI API key not configured. Please add VITE_GOOGLE_GENAI_API_KEY to your .env file.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

const config = {
  responseMimeType: "text/plain",
};
const model = "gemini-2.0-flash";

export async function getAIRecommendation(prompt) {
  try {
    const client = getAIClient();
    const response = await client.models.generateContent({
      model,
      config,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("Error sending message: ", error);
    return null;
  }
}

