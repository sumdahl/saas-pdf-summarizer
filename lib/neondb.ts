"use server";
import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

export async function getDatabaseConnection() {
  if (!process.env.NEON_DB_URL) {
    throw new Error("NEON_DB_URL is not set in .env");
  }
  if (!sql) {
    console.log("Connecting to database...");
    sql = neon(process.env.NEON_DB_URL!);
  }
  return sql;
}
