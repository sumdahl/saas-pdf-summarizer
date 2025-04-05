// import { getDatabaseConnection } from "./neondb";

// export async function getSummaries(userId: string) {
//   const sql = await getDatabaseConnection();
//   const summaries =
//     await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;
//   return summaries;
// }

import { getDatabaseConnection } from "./neondb";
import { Summary } from "@/types/summary";
export async function getSummaries(userId: string): Promise<Summary[]> {
  const sql = await getDatabaseConnection();
  const summaries =
    await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return summaries as Summary[];
}
