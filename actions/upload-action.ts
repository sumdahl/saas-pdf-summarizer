"use server";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { getDatabaseConnection } from "@/lib/neondb";
// import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/formatFile";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  PDFSummaryTypes,
  SavedSummary,
  UploadResponseItem,
  SummaryResult,
  StoreSummaryResult,
} from "@/types/summary-actions";

export async function generateSummarizedPdf(
  uploadResponse: UploadResponseItem[]
): Promise<SummaryResult> {
  if (!uploadResponse || uploadResponse.length === 0) {
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
    // Handle the fallback for GEMINI API

    try {
      const summary = await generateSummaryFromGemini(pdfText);
      const formattedFileName = formatFileNameAsTitle(pdfName);
      return {
        success: true,
        message: "PDF summarized successfully with Gemini.",
        data: {
          title: formattedFileName,
          summary,
        },
      };
    } catch (geminiError) {
      console.error("Error generating summary from Gemini", geminiError);
      throw new Error("Unable to generate summary with AI");
    }
  } catch (error) {
    return {
      success: false,
      message: "File upload failed.",
      data: null,
    };
  }
}

export async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PDFSummaryTypes): Promise<SavedSummary> {
  try {
    const sql = await getDatabaseConnection();
    const result = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      ) VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName}
      ) RETURNING id, summary_text`;

    // More explicit type assertion
    const resultArray = result as unknown as SavedSummary[];
    const savedSummary = resultArray[0];

    if (!savedSummary) {
      throw new Error("No data returned from the database");
    }

    return savedSummary;
  } catch (error) {
    console.error("Error saving PDF summary to database", error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: Omit<PDFSummaryTypes, "userId">): Promise<StoreSummaryResult> {
  let savedSummary: SavedSummary;
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary to database. Please try again.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to save PDF summary to database.",
    };
  }

  // Revalidate the cache
  revalidatePath(`/summaries/${savedSummary.id}`); //Individual summary page
  return {
    success: true,
    message: "PDF summary saved to database.",
    data: {
      id: savedSummary.id,
      summary: savedSummary.summary_text,
    },
  };
}
