"use server";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { getDatabaseConnection } from "@/lib/neondb";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/formatFile";
import { auth } from "@clerk/nextjs/server";

export interface PDFSummaryTypes {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

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
      const formattedFileName = formatFileNameAsTitle(pdfName);
      console.log(formattedFileName);
      return {
        success: true,
        message: "PDF summarized successfully.",
        data: {
          title: formattedFileName,
          summary,
        },
      };
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

export async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PDFSummaryTypes) {
  try {
    const sql = await getDatabaseConnection();
    await sql`INSERT INTO pdf_summaries (
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
   ${fileName},
);
`;
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
}: PDFSummaryTypes) {
  let savedSummary: any;
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

    return {
      success: true,
      message: "PDF summary saved to database.",
      data: {
        summary,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to save PDF summary to database.",
    };
  }
}
