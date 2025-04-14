/**
 * Converts a letter score (A–E) to a numeric value (1–5).
 *
 * Scores are mapped as follows:
 * - 'A' → 1 (best)
 * - 'B' → 2
 * - 'C' → 3
 * - 'D' → 4
 * - 'E' or any invalid/null/undefined → 5 (worst)
 *
 * @param {string | null | undefined} score - The letter score to convert.
 * @returns {number} The corresponding numeric score.
 */
export default function scoreLetterToNumber(score: string | null | undefined): number {
  if (!score) return 5; // Default to worst score if null/undefined
  switch (score) {
    case 'A':
      return 1;
    case 'B':
      return 2;
    case 'C':
      return 3;
    case 'D':
      return 4;
    case 'E':
      return 5;
    default:
      return 5; // Default to worst score for invalid values
  }
}
