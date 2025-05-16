import { TransparencyScore } from '../../TransparencyScore/constants';

/**
 * Converts a letter score (A–E) to a numeric value (1–5).
 *
 * @param {TransparencyScore | string | null | undefined} score - The letter score to convert.
 * @returns {number} The corresponding numeric score.
 */
export default function scoreLetterToNumber(score: TransparencyScore | string | null | undefined): number {
  if (!score) return 5; // Default to worst score if null/undefined
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
    default:
      return 5; // Default to worst score for invalid values
  }
}