
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeCarIssue = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As an expert car mechanic for 'Annai Varahi Car Care', analyze this customer problem: "${description}". 
    Suggest which services from this list they might need: General Service, Oil Change, Brake Service, Engine Check, AC Service, Wheel Alignment, Battery Check.
    Provide a short professional response.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          suggestedServiceIds: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["analysis", "suggestedServiceIds"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { 
      analysis: "We need to inspect your vehicle to be sure. Please book a diagnostic session.",
      suggestedServiceIds: ["general"]
    };
  }
};
