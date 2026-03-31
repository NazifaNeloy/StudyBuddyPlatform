/**
 * Gemini API Helper
 * Extracts text and metadata from images using Google Generative AI
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const geminiActions = {
  analyzeStudyMaterial: async (file) => {
    try {
      // 1. Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Analyze this study material. Respond ONLY with valid JSON: { \"title\": \"Descriptive Title\", \"summary\": \"Comprehensive summary\", \"keyPoints\": [\"point 1\", \"point 2\", \"point 3\"] }" },
              { inline_data: { mime_type: file.type, data: base64Data } }
            ]
          }]
        })
      });

      const data = await response.json();
      const resultText = data.candidates[0].content.parts[0].text;
      const cleanJson = resultText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Gemini Neural Failure:', error);
      throw error;
    }
  }
};
