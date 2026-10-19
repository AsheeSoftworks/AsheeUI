/**
 * Calendar helpers for the web renderer.
 *
 * What a calendar's value *means* — how it is written, how a month is laid out, what a typed
 * digit string names, which days a reader may reach — is shared, so those rules live in
 * `@asheeui/core` and are re-exported here: the web panel and the native surface answer them
 * the same way, and a consumer reads one date from either platform.
 *
 * What stays with the web is the caret. Rewriting a typed date moves the text under the
 * cursor, and only a renderer that owns an `<input>` has a cursor to move, so the arithmetic
 * that keeps it in place is this module's own.
 */

export {
  buildDayCells,
  canGoToNextMonth,
  combineDateAndTime,
  DAYS_OF_WEEK,
  formatDisplay,
  getDefaultPlaceholder,
  isFutureDay,
  MONTHS,
  pad2,
  parseDateString,
} from "@asheeui/core";

// ─── Cursor Management Functions ───────────────────────────────────────────

/**
 * Calculates the new cursor position after input formatting.
 * Ensures the cursor stays at the correct position when the
 * input value is automatically formatted.
 *
 * @param oldValue - The value before formatting.
 * @param newValue - The value after formatting.
 * @param oldSelectionStart - The cursor position before formatting.
 * @returns The new cursor position.
 *
 * @example
 * ```ts
 * // User typed "15" in a date input
 * getNewCursorPosition("", "15/01/2024", 0) // 2 (after "15")
 * ```
 */
export function getNewCursorPosition(
  oldValue: string,
  newValue: string,
  oldSelectionStart: number,
): number {
  if (oldSelectionStart >= oldValue.length) return newValue.length;

  const beforeCursor = oldValue.slice(0, oldSelectionStart);
  const digitCountBefore = (beforeCursor.match(/\d/g) || []).length;

  let digitCount = 0;
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) digitCount++;
    if (digitCount > digitCountBefore) {
      let dCount = 0;
      for (let j = 0; j < newValue.length; j++) {
        if (/\d/.test(newValue[j])) dCount++;
        if (dCount === digitCountBefore + 1) {
          return j + 1;
        }
      }
      return newValue.length;
    }
  }
  return newValue.length;
}
