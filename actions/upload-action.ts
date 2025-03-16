"use server";
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
    }
  } catch (error) {
    return {
      success: false,
      message: "File upload failed.",
      data: null,
    };
  }
}
