"use server";

import { getDatabaseConnection } from "@/lib/neondb";

export async function deleteSummary(summaryId: string) {
  const sql = await getDatabaseConnection();
  await sql`DELETE FROM pdf_summaries WHERE id = ${summaryId}`;
}
