/**
 * Turning a shared length into the platform's own, for the native package.
 *
 * The framework states measures in one vocabulary — the CSS lengths a stylesheet
 * understands — because a configuration that names a gap or a size states it once for both
 * platforms. The web passes such a value to its stylesheet as written. The platform has no
 * stylesheet, so it has to read the value: the framework's `rem` is sixteen
 * density-independent pixels, a `px` is one, and a unit the platform cannot state falls
 * back to the framework's own value rather than to a number nobody chose.
 */

/**
 * The number of density-independent pixels one of the framework's `rem` units is worth.
 * It is the browser default the web renderer is styled against, stated once here so a
 * configuration written for one platform lands on the same measure on the other.
 */
export const LENGTH_UNITS_PER_REM = 16;

/**
 * Read a CSS length as a number of density-independent pixels.
 *
 * @param value - The length, as a number or as a CSS length with a `px` or `rem` unit.
 * @param fallback - The value to use when the length states a unit the platform cannot
 * resolve.
 * @returns The length in density-independent pixels.
 *
 * @example
 * ```ts
 * resolveLength("1.5rem", 24); // 24
 * resolveLength("24px", 24);   // 24
 * resolveLength("50%", 24);    // 24, because a share of the parent is not a length
 * ```
 */
export function resolveLength(
  value: string | number,
  fallback: number,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  const match = /^\s*(-?\d*\.?\d+)\s*(px|rem)?\s*$/.exec(value);

  if (!match) {
    return fallback;
  }

  const amount = Number(match[1]);

  if (!Number.isFinite(amount)) {
    return fallback;
  }

  // A bare number is a length in the framework's own units, which is what the web's
  // stylesheet assumes as well.
  return match[2] === "rem" ? amount * LENGTH_UNITS_PER_REM : amount;
}
