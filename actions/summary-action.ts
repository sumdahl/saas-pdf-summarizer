"use server";

import { getDatabaseConnection } from "@/lib/neondb";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction(summaryId: string) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      throw new Error("User not found.");
    }

    const sql = await getDatabaseConnection();
    const result = await sql`
      DELETE FROM pdf_summaries 
      WHERE id = ${summaryId} AND user_id = ${userId}
      RETURNING id;
    `;

    // Check if result is an array and has at least one element
    if (Array.isArray(result) && result.length > 0) {
      revalidatePath("/dashboard");
      return {
        success: true,
        message: "Summary deleted successfully.",
      };
    }

    return {
      success: false,
      message: "No summary was deleted.",
    };
  } catch (error) {
    console.error("Error deleting summary:", error);
    return {
      success: false,
      message: "Internal server error.",
    };
  }
}
