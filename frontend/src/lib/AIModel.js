import { GoogleGenerativeAI } from "@google/generative-ai";

let ai = null;

function getAIClient() {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
      console.error("AI API Key is MISSING from import.meta.env. Check your frontend/.env file.");
      throw new Error("Google GenAI API key not configured. Please add VITE_GOOGLE_GENAI_API_KEY to your frontend/.env file and restart Vite.");
    }

    const trimmedKey = apiKey.trim();
    console.log("AI Client Initialization:", {
      length: trimmedKey.length,
      prefix: trimmedKey.substring(0, 7),
      suffix: trimmedKey.substring(trimmedKey.length - 4)
    });

    if (trimmedKey.length < 30 || !trimmedKey.startsWith("AIza")) {
      console.error("AI API Key looks invalid:", trimmedKey);
    }

    ai = new GoogleGenerativeAI(trimmedKey);
  }
  return ai;
}

const config = {
  responseMimeType: "text/plain",
};
const MODELS = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-pro"];

export async function getAIRecommendation(prompt) {
  const client = getAIClient();
  let lastError = null;

  for (const modelId of MODELS) {
    try {
      console.log(`Attempting AI recommendation with model: ${modelId}`);
      const model = client.getGenerativeModel({ model: modelId });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        console.log(`Successfully generated recommendation using ${modelId}`);
        return text;
      }
    } catch (error) {
      lastError = error;
      console.warn(`Model ${modelId} failed:`, error.message);
      // If it's a 404, we continue to the next model
      if (error.message.includes("404") || error.message.includes("not found")) {
        continue;
      }
      // For other errors (like 429 quota), we might want to stop or continue
      continue;
    }
  }

  console.error("All AI models failed. Last error:", lastError);
  return null;
}

