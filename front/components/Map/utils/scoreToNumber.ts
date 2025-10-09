import { TransparencyScore } from '../../TransparencyScore/constants';

/**
 * Converts a letter score (A–E) to a numeric value (1–5), or 0 for UNKNOWN.
 *
 * @param {TransparencyScore | string | null | undefined} score - The letter score to convert.
 * @returns {number} The corresponding numeric score (1-5) or 0 for UNKNOWN/null.
 */
export default function scoreLetterToNumber(
  score: TransparencyScore | string | null | undefined,
): number {
  if (!score) return 0; // Return 0 for UNKNOWN/missing data
  switch (score) {
    case TransparencyScore.A:
      return 1;
    case TransparencyScore.B:
      return 2;
    case TransparencyScore.C:
      return 3;
    case TransparencyScore.D:
      return 4;
    case TransparencyScore.E:
      return 5;
    case TransparencyScore.UNKNOWN:
      return 0; // UNKNOWN is represented by 0
    default:
      return 0; // Default to UNKNOWN for invalid values
  }
}
