/**
 * WCAG contrast, computed from the portable colour forms.
 *
 * The theme editor needs to say whether a palette is readable, and a browser-only colour parser
 * would make that answer unavailable on a device. This module uses the same intersection the
 * renderers paint, so the number is the same everywhere.
 *
 * The formula is WCAG 2.1: linearise each sRGB channel, apply the 0.2126/0.7152/0.0722 weights,
 * then use `(L1 + 0.05) / (L2 + 0.05)` with the lighter colour first.
 */

import { parseColor } from "./parse";

/** The minimum ratio for normal text at WCAG AA. */
export const CONTRAST_AA = 4.5;

/** The minimum ratio for normal text at WCAG AAA. */
export const CONTRAST_AAA = 7;

/** A contrast verdict for normal text. */
type ContrastLevel = "fail" | "AA" | "AAA";

/**
 * The relative luminance of a colour.
 *
 * @param value - A portable colour.
 * @returns A luminance from 0 to 1, or `undefined` when the colour is not portable.
 */
export function relativeLuminance(value: string): number | undefined {
  const colour = parseColor(value);
  if (!colour) return undefined;

  const linear = (channel: number): number => {
    const share = channel / 255;
    return share <= 0.04045
      ? share / 12.92
      : ((share + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * linear(colour.r) +
    0.7152 * linear(colour.g) +
    0.0722 * linear(colour.b)
  );
}

/**
 * The contrast ratio between two colours.
 *
 * @param foreground - The text or foreground colour.
 * @param background - The surface colour.
 * @returns A ratio from 1 to 21, or `undefined` when either colour is not portable.
 *
 * @example
 * ```ts
 * contrastRatio("#000000", "#ffffff"); // 21
 * ```
 */
export function contrastRatio(
  foreground: string,
  background: string,
): number | undefined {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  if (first === undefined || second === undefined) return undefined;

  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * The WCAG level a ratio reaches for normal text.
 *
 * @param ratio - A contrast ratio.
 * @returns `"AAA"`, `"AA"` or `"fail"`.
 */
export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= CONTRAST_AAA) return "AAA";
  if (ratio >= CONTRAST_AA) return "AA";
  return "fail";
}
