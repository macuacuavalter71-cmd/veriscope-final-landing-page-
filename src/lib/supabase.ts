/**
 * Supabase connection (external project).
 *
 * The publishable/anon key is safe in client code: every table is protected by
 * Row Level Security. Nothing here decides whether something was paid — the
 * database is always the source of truth.
 */
import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://zmljwmyfqhpdookvegtr.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptbGp3bXlmcWhwZG9va3ZlZ3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1Njc0NTUsImV4cCI6MjEwMjE0MzQ1NX0.wmEjh9foLAfLVQhO-aDg0Y-jJfk-6VPyCn7_iH9eED8";

/** Exact product_id values stored in the `orders` table. */
export type OrderProductId =
  | "edge"
  | "prime"
  | "bundle"
  | "intelligence"
  | "intelligence_aiprompt";

export function createSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export const supabase = createSupabase();
