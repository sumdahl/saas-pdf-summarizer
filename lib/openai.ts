import { SUMMARY_SYSTEM_PROMPT } from "./prompts";
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

export async function generateSummaryFromOpenAI(pdfText: string) {
  try {
    const response = await client.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Transform this document into an engaging, easy-to-read summary with
          contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
        },
      ],
      temperature: 0.7,
      max_output_tokens: 1500,
    });
    console.log(response.output_text);
    return response.output_text;
  } catch (error: any) {
    if (error?.status === 429) {
      //move to GEMINI api
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
}
