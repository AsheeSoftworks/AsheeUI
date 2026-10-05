/**
 * The calendar's rules, shared by both platforms.
 *
 * A date field is the family member whose value is not text, and almost everything that
 * makes one behave predictably is a rule rather than a preference: how a chosen date is
 * written into the field, which cells a month shows and in what order, what a typed digit
 * string means, and which days a reader may not reach at all. Those live here, so the web
 * panel and the native surface answer them the same way and a consumer reads one date from
 * either platform.
 *
 * What is not here is presentation: the grid these helpers describe is drawn with each
 * renderer's own classes, and the cursor arithmetic the web needs when it rewrites a typed
 * date is the DOM's problem rather than the calendar's, so it stays with the renderer that
 * has a caret to move.
 */

import type { CalendarMode } from "./calendar-config";

// ─── Vocabulary ──────────────────────────────────────────────────────────────

/**
 * Abbreviated day names, starting with Sunday.
 *
 * One letter shorter than the usual three, because a week of seven columns has to fit a
 * phone's width before it fits anything else, and a reader scans the column, not the word.
 */
export const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/**
 * Full month names, January to December.
 *
 * Spelled out rather than abbreviated because the month is the surface's heading, and a
 * heading is read rather than scanned.
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

// ─── Writing and reading a date ───────────────────────────────────────────────

/**
 * Pad a number to two digits.
 *
 * @param n - The number to pad.
 * @returns The padded string.
 *
 * @example
 * ```ts
 * pad2(5); // "05"
 * ```
 */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Write a date the way the field shows it.
 *
 * The format is the field's rather than the reader's locale, and deliberately: a value that
 * is re-read, typed over and compared with what a native field shows has to be written one
 * way on both platforms, and the digits are the ones a reader of any locale recognises.
 *
 * @param date - The date to write.
 * @param mode - What the field collects.
 * @returns The written date.
 *
 * @example
 * ```ts
 * formatDisplay(new Date(2024, 0, 15, 14, 30, 5), "date"); // "15/01/2024"
 * ```
 */
export function formatDisplay(date: Date, mode: CalendarMode): string {
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
 * What the field says while it holds nothing, for each mode.
 *
 * @param mode - What the field collects.
 * @returns The placeholder.
 */
export function getDefaultPlaceholder(mode: CalendarMode): string {
  switch (mode) {
    case "date":
      return "Dropmenu date...";
    case "time":
      return "Dropmenu time...";
    case "datetime":
      return "Dropmenu date & time...";
  }
}

// ─── The month grid ──────────────────────────────────────────────────────────

/**
 * The cells of one month, as the reader sees them.
 *
 * The month is laid out in weeks of seven cells that begin on Sunday, so the days before
 * the first of the month and after the last are empty slots rather than days borrowed from
 * a neighbouring month: a cell that showed the 31st of the previous month would be a day
 * the reader could press while believing they were in this month. The list is therefore
 * always a whole number of weeks, which is what lets a renderer draw it as rows.
 *
 * @param year - The year of the month.
 * @param month - The month, zero-based.
 * @returns The month's cells, in reading order, with `null` where a week has a gap.
 *
 * @example
 * ```ts
 * // January 2024 begins on a Monday, so Sunday is empty:
 * buildDayCells(2024, 0).slice(0, 8); // [null, 1, 2, 3, 4, 5, 6, 7]
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

// ─── The two rules a reader cannot see ───────────────────────────────────────

/**
 * Put a time of day onto a day.
 *
 * A calendar that collects both a day and a time holds one value, and every control on its
 * surface writes to that value: turning the hour forward has to keep the chosen day, and
 * choosing a day has to keep the time the reader has already set. Both renderers therefore
 * compose a value the same way, and a day is never lost to a time nor a time to a day.
 *
 * @param date - The day the value keeps.
 * @param hours - The hours to set, 0 to 23.
 * @param minutes - The minutes to set, 0 to 59.
 * @param seconds - The seconds to set, 0 to 59.
 * @returns A new date on that day at that time.
 *
 * @example
 * ```ts
 * combineDateAndTime(new Date(2024, 0, 15), 14, 30, 0); // 15 January 2024, 14:30
 * ```
 */
export function combineDateAndTime(
  date: Date,
  hours: number,
  minutes: number,
  seconds: number,
): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    seconds,
    0,
  );
}

/**
 * Whether a day is after the caller's today.
 *
 * The comparison is by day rather than by instant, because that is the question the field
 * asks: a field that refuses future dates accepts today until the day is over, including
 * the hours that have not happened yet, since "not after today" is the promise it made.
 *
 * @param year - The year of the day.
 * @param month - The month of the day, zero-based.
 * @param day - The day of the month.
 * @param today - The day to compare against. Defaults to now.
 * @returns Whether the day is after today.
 *
 * @example
 * ```ts
 * isFutureDay(2024, 0, 20, new Date(2024, 0, 15)); // true
 * ```
 */
export function isFutureDay(
  year: number,
  month: number,
  day: number,
  today: Date = new Date(),
): boolean {
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return new Date(year, month, day) > todayMidnight;
}

/**
 * Whether a reader may move forward from the month they are reading.
 *
 * A field that refuses future dates refuses the month after today's as well, since every day
 * in it is refused and a surface that opened it would be showing a month of dead cells. The
 * reader can still look back as far as they like, and can return to the month that holds
 * today, which is the edge this states.
 *
 * @param viewYear - The year the reader is reading.
 * @param viewMonth - The month the reader is reading, zero-based.
 * @param today - The day to compare against. Defaults to now.
 * @returns Whether the next month may be reached.
 *
 * @example
 * ```ts
 * canGoToNextMonth(2024, 0, new Date(2024, 0, 15)); // true
 * canGoToNextMonth(2024, 1, new Date(2024, 0, 15)); // false
 * ```
 */
export function canGoToNextMonth(
  viewYear: number,
  viewMonth: number,
  today: Date = new Date(),
): boolean {
  return (
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth < today.getMonth())
  );
}
