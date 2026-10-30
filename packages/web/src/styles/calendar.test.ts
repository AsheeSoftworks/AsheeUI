/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import {
  CALENDAR_COLOR_CLASSES,
  type Color,
  type FieldSizeKey,
} from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  DATE_PICKER_CELL_SIZE_CLASS,
  DATE_PICKER_SIZE_CLASS,
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

describe("the Calendar's class dictionaries", () => {
  it("treats every colour role, so a chosen day is never left without a fill", () => {
    expect(Object.keys(CALENDAR_COLOR_CLASSES).sort()).toEqual(
      [...COLORS].sort(),
    );
  });

  it("sizes every density, so a day is never left without a cell", () => {
    for (const map of [DATE_PICKER_SIZE_CLASS, DATE_PICKER_CELL_SIZE_CLASS]) {
      expect(Object.keys(map).sort()).toEqual([...SIZES].sort());
    }
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const value of [
      ...Object.values(DATE_PICKER_SIZE_CLASS),
      ...Object.values(DATE_PICKER_CELL_SIZE_CLASS),
    ]) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });
});
