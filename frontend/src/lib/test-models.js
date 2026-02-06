import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function listModels() {
    const apiKey = process.env.VITE_GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
        console.error("VITE_GOOGLE_GENAI_API_KEY not found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    console.log("Checking available models...");
    try {
        // There isn't a direct listModels in the simple SDK, but we can try a few common ones
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-pro"];

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                await model.generateContent("test");
                console.log(`✅ Model available: ${modelName}`);
            } catch (e) {
                console.log(`❌ Model NOT available: ${modelName} (${e.message.substring(0, 50)}...)`);
            }
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
