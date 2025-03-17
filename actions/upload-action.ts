"use server";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";

export async function generateSummarizedPdf(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File upload failed.",
      data: null,
    };
  }
  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: pdfName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File upload failed.",
      data: null,
    };
  }
  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    try {
      const summary = await generateSummaryFromOpenAI(pdfText);
      if (!summary) {
        return {
          success: false,
          message: "Unable to summarize pdf text.",
          data: null,
        };
      }
      console.log(summary);
    } catch (error) {
      console.error(error);
      //move to GEMINI api

      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        try {
          const summary = await generateSummaryFromGemini(pdfText);
          console.log(summary);
        } catch (error) {
          console.error("Error generating summary from Gemini", error);
        }
        throw new Error("Unable to generate summary with AI");
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "File upload failed.",
      data: null,
    };
  }
}
