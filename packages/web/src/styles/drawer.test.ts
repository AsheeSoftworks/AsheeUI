/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { DRAWER_HEIGHT_CLASS, DRAWER_WIDTH_CLASS } from "./drawer";
import { type DrawerSize } from "@asheeui/core";

/** The amounts of screen a drawer can take. */
const SIZES: DrawerSize[] = ["sm", "md", "lg", "full"];

describe("how much of the screen a drawer takes", () => {
  it("describes every size on both platforms", () => {
    expect(Object.keys(DRAWER_WIDTH_CLASS).sort()).toEqual([...SIZES].sort());
    expect(Object.keys(DRAWER_HEIGHT_CLASS).sort()).toEqual([...SIZES].sort());
  });

  it("lets the largest size take the whole screen on both platforms", () => {
    expect(DRAWER_WIDTH_CLASS.full).toBe("w-screen");
    expect(DRAWER_HEIGHT_CLASS.full).toBe("h-screen");
  });

});
