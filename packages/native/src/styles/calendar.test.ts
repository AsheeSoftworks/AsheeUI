/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import {
  CALENDAR_COLOR_CLASSES,
  type Color,
  type FieldSizeKey,
} from "@asheeui/core";
import {
  NATIVE_CALENDAR_CELL_CLASS,
  NATIVE_CALENDAR_CELL_DISABLED_CLASS,
  NATIVE_CALENDAR_CELL_SIZE_CLASS,
  NATIVE_CALENDAR_CELL_TEXT_CLASS,
  NATIVE_CALENDAR_CLEAR_CLASS,
  NATIVE_CALENDAR_CLEAR_LABEL_CLASS,
  NATIVE_CALENDAR_COLOR_CLASS,
  NATIVE_CALENDAR_DONE_CLASS,
  NATIVE_CALENDAR_DONE_LABEL_CLASS,
  NATIVE_CALENDAR_FOOTER_CLASS,
  NATIVE_CALENDAR_HEADER_CLASS,
  NATIVE_CALENDAR_MONTH_CLASS,
  NATIVE_CALENDAR_MONTH_GRID_CLASS,
  NATIVE_CALENDAR_NAV_CLASS,
  NATIVE_CALENDAR_NAV_LABEL_CLASS,
  NATIVE_CALENDAR_ROW_CLASS,
  NATIVE_CALENDAR_SHEET_CLASS,
  NATIVE_CALENDAR_STEP_CLASS,
  NATIVE_CALENDAR_STEP_LABEL_CLASS,
  NATIVE_CALENDAR_TIME_COLUMN_CLASS,
  NATIVE_CALENDAR_TIME_LABEL_CLASS,
  NATIVE_CALENDAR_TIME_ROW_CLASS,
  NATIVE_CALENDAR_TIME_VALUE_CLASS,
  NATIVE_CALENDAR_TIME_VALUE_TEXT_CLASS,
  NATIVE_CALENDAR_TRIGGER_ACTIONS_CLASS,
  NATIVE_CALENDAR_TRIGGER_CLASS,
  NATIVE_CALENDAR_TRIGGER_CLEAR_CLASS,
  NATIVE_CALENDAR_TRIGGER_GLYPH_CLASS,
  NATIVE_CALENDAR_UNAVAILABLE_CLASS,
  NATIVE_CALENDAR_WEEKDAY_CLASS,
  NATIVE_CALENDAR_WEEKDAYS_CLASS,
} from "./calendar";

/** Every colour role the framework names. */
const COLORS: Color[] = [
  "none",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
];

/** Every density the field family names. */
const SIZES: FieldSizeKey[] = ["sm", "md", "lg"];

/** The native classes that are not part of a map. */
const NATIVE_CLASSES = [
  NATIVE_CALENDAR_TRIGGER_CLASS,
  NATIVE_CALENDAR_TRIGGER_ACTIONS_CLASS,
  NATIVE_CALENDAR_TRIGGER_CLEAR_CLASS,
  NATIVE_CALENDAR_TRIGGER_GLYPH_CLASS,
  NATIVE_CALENDAR_SHEET_CLASS,
  NATIVE_CALENDAR_MONTH_GRID_CLASS,
  NATIVE_CALENDAR_HEADER_CLASS,
  NATIVE_CALENDAR_MONTH_CLASS,
  NATIVE_CALENDAR_NAV_CLASS,
  NATIVE_CALENDAR_NAV_LABEL_CLASS,
  NATIVE_CALENDAR_UNAVAILABLE_CLASS,
  NATIVE_CALENDAR_WEEKDAYS_CLASS,
  NATIVE_CALENDAR_WEEKDAY_CLASS,
  NATIVE_CALENDAR_ROW_CLASS,
  NATIVE_CALENDAR_CELL_CLASS,
  NATIVE_CALENDAR_CELL_DISABLED_CLASS,
  NATIVE_CALENDAR_CELL_TEXT_CLASS,
  NATIVE_CALENDAR_TIME_ROW_CLASS,
  NATIVE_CALENDAR_TIME_COLUMN_CLASS,
  NATIVE_CALENDAR_STEP_CLASS,
  NATIVE_CALENDAR_STEP_LABEL_CLASS,
  NATIVE_CALENDAR_TIME_LABEL_CLASS,
  NATIVE_CALENDAR_TIME_VALUE_CLASS,
  NATIVE_CALENDAR_TIME_VALUE_TEXT_CLASS,
  NATIVE_CALENDAR_FOOTER_CLASS,
  NATIVE_CALENDAR_CLEAR_CLASS,
  NATIVE_CALENDAR_CLEAR_LABEL_CLASS,
  NATIVE_CALENDAR_DONE_CLASS,
  NATIVE_CALENDAR_DONE_LABEL_CLASS,
];

describe("the Calendar's class dictionaries", () => {
  it("treats every colour role, so a chosen day is never left without a fill", () => {
    expect(Object.keys(CALENDAR_COLOR_CLASSES).sort()).toEqual(
      [...COLORS].sort(),
    );
    expect(Object.keys(NATIVE_CALENDAR_COLOR_CLASS).sort()).toEqual(
      [...COLORS].sort(),
    );
  });

  it("sizes every density, so a day is never left without a cell", () => {
    for (const map of [NATIVE_CALENDAR_CELL_SIZE_CLASS]) {
      expect(Object.keys(map).sort()).toEqual([...SIZES].sort());
    }
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    const classes = [
      ...NATIVE_CLASSES,
      ...Object.values(NATIVE_CALENDAR_CELL_SIZE_CLASS),
      ...Object.values(NATIVE_CALENDAR_COLOR_CLASS).flatMap((entry) => [
        entry.bg,
        entry.on,
        entry.border,
        entry.text,
      ]),
    ];
    for (const value of classes) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });

  it("states the accent a chosen day wears, and the ink its number is written in", () => {
    expect(NATIVE_CALENDAR_COLOR_CLASS.primary.bg).toBe("bg-primary");
    expect(NATIVE_CALENDAR_COLOR_CLASS.primary.border).toBe("border-primary");
    expect(NATIVE_CALENDAR_COLOR_CLASS.primary.text).toBe("text-primary");
    // The platform's own convention for a filled accent, which the framework's controls
    // share: an accent fill carries the application's background as its ink.
    expect(NATIVE_CALENDAR_COLOR_CLASS.primary.on).toBe("text-background");
    expect(NATIVE_CALENDAR_COLOR_CLASS.secondary.on).toBe("text-foreground");
  });

  it("keeps the pointer treatments on the web and off the platform", () => {
    for (const colour of COLORS) {
      expect(CALENDAR_COLOR_CLASSES[colour].hover).toContain("hover:");
      expect(Object.keys(NATIVE_CALENDAR_COLOR_CLASS[colour]).sort()).toEqual([
        "bg",
        "border",
        "on",
        "text",
      ]);
    }
  });
});
