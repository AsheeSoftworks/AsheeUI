/**
 * The code field's rule, shared by both platforms.
 *
 * A code is a value that behaves the same way wherever it is typed: the characters are
 * packed left to right, so a character removed from the middle moves the ones after it left
 * rather than leaving a gap, and only the characters the mode accepts are kept. A consumer
 * therefore reads one dense value, and never has to reason about positions.
 *
 * The rule lives here rather than in a renderer because it is the component's meaning
 * rather than its presentation: a web field and a native field that filtered their input
 * differently would be two components wearing one name.
 */

import type { PinInputMode } from "./pin-input-config";

/**
 * Keep only the characters a mode accepts, and no more of them than the field collects.
 *
 * @param raw - The text to filter.
 * @param mode - The characters the field accepts.
 * @param length - How many characters the field collects, when the caller knows it.
 * @returns The filtered text.
 *
 * @example
 * ```ts
 * sanitizePinValue("12a3", "numeric"); // "123"
 * sanitizePinValue("123456", "numeric", 4); // "1234"
 * ```
 */
export function sanitizePinValue(
  raw: string,
  mode: PinInputMode,
  length?: number,
): string {
  const kept =
    mode === "numeric"
      ? raw.replace(/\D+/g, "")
      : mode === "alphanumeric"
        ? raw.replace(/[^0-9a-zA-Z]+/g, "")
        : raw.replace(/\s+/g, "");

  return length === undefined ? kept : kept.slice(0, length);
}
