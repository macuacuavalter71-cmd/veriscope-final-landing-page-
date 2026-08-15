/**
 * Server-only Pine Script sources. The code never ships in the client bundle:
 * it is returned exclusively for products the order actually contains.
 */
import primePine from "@/content/prime.pine.txt?raw";
import intelligencePine from "@/content/intelligence.pine.txt?raw";

export const PINE_SOURCES: Record<string, string> = {
  prime: primePine,
  intelligence: intelligencePine,
};
