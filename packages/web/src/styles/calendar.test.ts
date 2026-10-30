/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type { Color, FieldSizeKey } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  CALENDAR_COLOR_CLASSES,
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

  it("keeps the pointer treatment on the web, which the platform cannot paint", () => {
    // This assertion lived in native's suite while core held the map, because that was the only
    // package that could read both. It is a web truth — a device has no pointer resting on a cell
    // — so it moved here with the map in C3.
    for (const colour of COLORS) {
      expect(CALENDAR_COLOR_CLASSES[colour].hover).toContain("hover:");
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
