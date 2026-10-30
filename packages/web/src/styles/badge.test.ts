/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type { Size } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  BADGE_FONT_CLASS,
  BADGE_GAP_CLASS,
  BADGE_HEIGHT_CLASS,
  BADGE_ICON_SIZE_CLASS,
  BADGE_PADDING_CLASS,
} from "./badge";

/** The densities a badge can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

describe("the web badge's class maps", () => {
  const maps: Record<string, string>[] = [
    BADGE_HEIGHT_CLASS,
    BADGE_PADDING_CLASS,
    BADGE_FONT_CLASS,
    BADGE_GAP_CLASS,
    BADGE_ICON_SIZE_CLASS,
  ];

  it("describe every density a badge can be", () => {
    for (const map of maps) {
      expect(Object.keys(map).sort()).toEqual([...DENSITIES].sort());
    }
  });

  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of maps) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }
  });
});
