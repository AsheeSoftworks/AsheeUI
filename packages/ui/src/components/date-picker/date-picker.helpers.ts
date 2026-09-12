/**
 * DatePicker helper functions for AsheeUI.
 * This file provides utility functions for date formatting, parsing,
 * calendar grid building, and input cursor management.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

/**
 * Array of abbreviated day names starting with Sunday.
 * Used for the calendar header.
 */
export const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/**
 * Array of full month names from January to December.
 * Used for the calendar month header.
 */
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

// ─── Types ──────────────────────────────────────────────────────────────────

/**
 * The selection mode of the date picker.
 * - `date`: Select only a date.
 * - `time`: Select only a time.
 * - `datetime`: Select both date and time.
 */
export type DatePickerMode = "date" | "time" | "datetime";

// ─── Formatting Functions ───────────────────────────────────────────────────

/**
 * Pads a number with leading zero to two digits.
 * Used for formatting hours, minutes, and seconds.
 *
 * @param n - The number to pad.
 * @returns The zero-padded string representation.
 *
 * @example
 * ```ts
 * pad2(5) // "05"
 * pad2(23) // "23"
 * ```
 */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Formats a date object as a string based on the mode.
 *
 * @param date - The date to format.
 * @param mode - The picker mode.
 * @returns A formatted date string.
 *
 * @example
 * ```ts
 * const date = new Date(2024, 0, 15, 14, 30, 45);
 * formatDisplay(date, "date") // "15/01/2024"
 * formatDisplay(date, "time") // "14:30:45"
 * formatDisplay(date, "datetime") // "15/01/2024 14:30:45"
 * ```
 */
export function formatDisplay(date: Date, mode: DatePickerMode): string {
  const d = pad2(date.getDate());
  const mo = pad2(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad2(date.getHours());
  const mi = pad2(date.getMinutes());
  const s = pad2(date.getSeconds());

  switch (mode) {
    case "date":
      return `${d}/${mo}/${y}`;
    case "time":
      return `${h}:${mi}:${s}`;
    case "datetime":
      return `${d}/${mo}/${y} ${h}:${mi}:${s}`;
  }
}

/**
 * Gets the default placeholder text for the input based on mode.
 *
 * @param mode - The picker mode.
 * @returns The placeholder text.
 */
export function getDefaultPlaceholder(mode: DatePickerMode): string {
  switch (mode) {
    case "date":
      return "Select date...";
    case "time":
      return "Select time...";
    case "datetime":
      return "Select date & time...";
  }
}

// ─── Calendar Grid Functions ────────────────────────────────────────────────

/**
 * Builds a 2D array of day numbers for the calendar grid.
 * Returns a flat array where null values represent empty slots
 * before the first day of the month.
 *
 * @param year - The year of the month to display.
 * @param month - The month (0-indexed) to display.
 * @returns A flat array of day numbers and null values.
 *
 * @example
 * ```ts
 * // For January 2024 (starts on Monday)
 * buildDayCells(2024, 0)
 * // [null, 1, 2, 3, 4, 5, 6, 7, ..., 31, null, null]
 * ```
 */
export function buildDayCells(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ─── Parsing Functions ──────────────────────────────────────────────────────

/**
 * Parses a digit string into a Date object based on the mode.
 * Supports partial input and auto-completes missing fields.
 *
 * @param input - The digit string to parse.
 * @param mode - The picker mode.
 * @param fallbackDate - Optional fallback date for missing values.
 * @returns The parsed date or null if no digits provided.
 *
 * @example
 * ```ts
 * parseDateString("15012024", "date") // Date(2024, 0, 15)
 * parseDateString("1430", "time") // Date with 14:30
 * parseDateString("150120241430", "datetime") // Date(2024, 0, 15, 14, 30)
 * ```
 */
export function parseDateString(
  input: string,
  mode: DatePickerMode,
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
      const base = now;
      return new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
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
      return new Date(
        y,
        monthIndex,
        dayNum,
        Math.min(h, 23),
        Math.min(mi, 59),
        Math.min(s, 59),
      );
    }
  }
}

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
