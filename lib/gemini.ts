import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

type ApiKey = string | undefined;

const apiKey: ApiKey = process.env.GEMINI_SECRET_KEY;
if (!apiKey) {
  throw new Error("GEMINI_SECRET_KEY is not set");
}
export async function generateSummaryFromGemini(pdfText: string) {
  const genAI = new GoogleGenerativeAI(apiKey as string);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });
    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: SUMMARY_SYSTEM_PROMPT,
            },
            {
              text: `Transofrm this document into an
              engaging, easy-to-read summary with contextually
              relevant emojis and proper
              markdown formatting:\n\n${pdfText}`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const response = result.response;
    if (!response.text()) {
      throw new Error("No response from Gemini");
    }
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error", error);
    throw error;
  }
}
