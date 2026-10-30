/**
 * Reading a typed date on the web.
 *
 * A consumer types `2026-03-04` into a text field, and the browser's `Date` parser is the one that
 * reads it. A device has no such field — its picker produces a date, not a string — so the parsing
 * is the web renderer's, and it moved out of core in C2 with the rest of web's layer.
 */

import { type CalendarMode, combineDateAndTime } from "@asheeui/core";

/**
 * Read a typed digit string as the date the field then holds.
 *
 * A reader types digits and the field supplies the rest, in the order the field writes them:
 * `dd`, `mm`, `yyyy`, then `hh`, `mm`, `ss`. A part that is missing is kept from the date the
 * field already held, so adding an hour to a chosen day does not move the day, and a part
 * that is out of range is clamped to the calendar's own answer rather than rejected — a
 * reader who types 31 in a 30-day month gets the 30th, which is a value they can correct
 * rather than a field that appears to ignore them.
 *
 * @param input - The text the reader typed, of which the digits are read.
 * @param mode - What the field collects.
 * @param fallbackDate - The date the missing parts come from. Defaults to now.
 * @returns The date the digits name, or null when they name nothing.
 *
 * @example
 * ```ts
 * parseDateString("15012024", "date"); // Date(2024, 0, 15)
 * parseDateString("1430", "time"); // Today at 14:30
 * ```
 */
export function parseDateString(
  input: string,
  mode: CalendarMode,
  fallbackDate?: Date,
): Date | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 0) return null;

  const now = fallbackDate ?? new Date();

  switch (mode) {
    case "date": {
      const d = parseInt(digits.slice(0, 2), 10) || 1;
      const m = parseInt(digits.slice(2, 4), 10) || 1;
      let y = parseInt(digits.slice(4, 8), 10) || now.getFullYear();
      if (digits.length === 4) y = 2000 + y;
      if (digits.length === 2) y = now.getFullYear();
      const monthIndex = Math.min(m - 1, 11);
      const daysInMonth = new Date(y, monthIndex + 1, 0).getDate();
      const dayNum = Math.min(d, daysInMonth);
      return new Date(y, monthIndex, dayNum);
    }
    case "time": {
      const h = parseInt(digits.slice(0, 2), 10) || 0;
      const mi = parseInt(digits.slice(2, 4), 10) || 0;
      const s = parseInt(digits.slice(4, 6), 10) || 0;
      return combineDateAndTime(
        now,
        Math.min(h, 23),
        Math.min(mi, 59),
        Math.min(s, 59),
      );
    }
    case "datetime": {
      const d = parseInt(digits.slice(0, 2), 10) || 1;
      const m = parseInt(digits.slice(2, 4), 10) || 1;
      let y = parseInt(digits.slice(4, 8), 10) || now.getFullYear();
      if (digits.length >= 4 && digits.length < 8) y = 2000 + y;
      if (digits.length < 4) y = now.getFullYear();
      const h = parseInt(digits.slice(8, 10), 10) || 0;
      const mi = parseInt(digits.slice(10, 12), 10) || 0;
      const s = parseInt(digits.slice(12, 14), 10) || 0;
      const monthIndex = Math.min(m - 1, 11);
      const daysInMonth = new Date(y, monthIndex + 1, 0).getDate();
      const dayNum = Math.min(d, daysInMonth);
      return combineDateAndTime(
        new Date(y, monthIndex, dayNum),
        Math.min(h, 23),
        Math.min(mi, 59),
        Math.min(s, 59),
      );
    }
  }
}
