import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Converts a File object to a GoogleGenerativeAI.Part object.
 */
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

/**
 * Analyzes a study artifact image or document using Gemini AI.
 * Returns structured metadata: { title, keywords, summary }
 */
export async function analyzeStudyArtifact(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Analyze this study note or image. 
    1. Provide a concise, professional title (max 6 words).
    2. Extract 3-5 key topics/keywords from the text.
    3. Provide a 1-sentence summary.
    Return the result strictly in this JSON format: {"title": "...", "keywords": ["...", "..."], "summary": "..."}`;

    const imagePart = await fileToGenerativePart(file);
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response (sometimes Gemini adds ```json blocks)
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    throw new Error("Failed to scan artifact. Please try manual entry.");
  }
}
