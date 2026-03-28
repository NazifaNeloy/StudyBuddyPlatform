/**
 * Gemini API Helper
 * Extracts text and metadata from images using Google Generative AI
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const geminiActions = {
  scanNotes: async (base64Image, mimeType) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "You are a smart study assistant. Analyze this handwritten note image. Extract the text accurately. Then, generate a concise title and 3 keywords. Respond ONLY in JSON format: { \"text\": \"...\", \"title\": \"...\", \"keywords\": [\"...\", \"...\", \"...\"] }"
                },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const resultText = data.candidates[0].content.parts[0].text;
      
      // Clean up potential markdown formatting in JSON response
      const cleanJson = resultText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
};
