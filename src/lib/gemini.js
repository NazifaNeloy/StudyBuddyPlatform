/**
 * GEMINI API HELPER: NEURAL EXTRACTION MATRIX
 * 
 * ARCHITECTURAL MANDATE: 
 * Optimized for Gemini 1.5 Flash to handle handwritten digitisation and 
 * semantic analysis of academic artifacts.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Sanitizes and maps AI output to the internal StudyBuddy Neural Schema.
 */
const sanitizeGeminiResponse = (rawText) => {
  try {
    // Robust extraction: seek JSON block if Gemini adds conversational noise
    let cleanJson = rawText;
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    cleanJson = cleanJson.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return {
      fullText: typeof data.fullText === 'string' ? data.fullText : '',
      summary: typeof data.summary === 'string' ? data.summary : '',
      keyPoints: Array.isArray(data.keyPoints) 
        ? data.keyPoints.filter(kp => typeof kp === 'string')
        : [],
      title: typeof data.title === 'string' ? data.title : 'Neural Artifact'
    };
  } catch (error) {
    console.error('Gemini Decoding Error: Failed to parse neural response.', rawText);
    throw new Error('Neural synchronization failed. The AI response was malformed.');
  }
};

export const geminiActions = {
  analyzeStudyMaterial: async (file) => {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API Protocol Error: API Key missing from environment.');
      }

      // Convert file to base64 for vision processing
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
          contents: [
            {
              parts: [
                {
                  text: `ROLE: You are the StudyBuddy OCR & Analysis Engine. 
                  OBJECTIVE: Transcribe and analyze the uploaded image of study notes.
                  
                  INSTRUCTIONS:
                  1. Transcribe the handwriting exactly as it appears into the "fullText" field. 
                  2. Use semantic HTML for formatting the "fullText" (e.g., <h1>, <p>, <ul>, <li>, <strong>). 
                  3. Create a 2-3 sentence executive "summary" of the core concepts.
                  4. Identify up to 5 "keyPoints" as short 1-2 word tags.
                  5. Create a professional, context-aware "title" for this artifact.
                  
                  CRITICAL: 
                  - Return STRICT JSON only.
                  - Do not include conversational text or markdown code blocks around the JSON.
                  - If the image is blank or unreadable, return empty strings but valid JSON.

                  SCHEMA:
                  {
                    "fullText": "...",
                    "summary": "...",
                    "keyPoints": ["...", "..."],
                    "title": "..."
                  }`
                },
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64Data
                  }
                }
              ]
            }
          ]
        })
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(`Gemini API Error: ${result.error.message}`);
      }
      
      // Safety and Finish Reason Diagnostics
      const candidate = result.candidates?.[0];
      if (!candidate || !candidate.content) {
        console.error('Raw Gemini Response:', result);
        const finishReason = candidate?.finishReason;
        if (finishReason === 'SAFETY') {
          throw new Error('AI Protocol Blocked: The artifact content triggered safety filters.');
        } else if (finishReason === 'RECITATION') {
          throw new Error('AI Protocol Blocked: Content contains copyrighted material.');
        } else if (finishReason === 'OTHER') {
          throw new Error('AI Protocol Blocked: Internal neural processing failed.');
        }
        throw new Error('Neural response failed to materialize. Check network or image quality.');
      }
 
      const rawContent = candidate.content.parts?.[0]?.text;
      if (!rawContent) {
        throw new Error('Neural synchronization failed. The AI response contained no text part.');
      }
      return sanitizeGeminiResponse(rawContent);

    } catch (error) {
      console.error('NEURAL EXTRACTION ERROR:', error.message);
      throw error;
    }
  }
};
