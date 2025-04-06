import { getDatabaseConnection } from "./neondb";
import { SummaryInterface, SummaryIdInterface } from "@/types/summary";

export async function getSummaries(
  userId: string
): Promise<SummaryInterface[]> {
  const sql = await getDatabaseConnection();
  const summaries =
    await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return summaries as SummaryInterface[];
}

export async function getSummaryById(
  id: string
): Promise<SummaryInterface | null> {
  try {
    const sql = await getDatabaseConnection();

    const result = await sql`SELECT 
        id,
        user_id,
        title,
        original_file_url,
        summary_text,
        status,
        created_at,
        updated_at,
        file_name,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text , ' ', '')) + 1 as word_count
        FROM pdf_summaries WHERE id = ${id}`;
    // Cast the result to PdfSummary[] since we know the shape of the data
    if (Array.isArray(result)) {
      const summaries = result.map((summary: any) => ({
        ...summary,
        createdAt: summary.created_at,
        updatedAt: summary.updated_at,
      })) as SummaryInterface[];
      console.log(summaries);
      const summary = summaries[0];

      return summary ?? null;
    }
    return null;
  } catch (error) {
    console.error("Error while getting summary id:", error);
    return null;
  }
}
