/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { TABS_HEIGHT_CLASS } from "./tabs";
import { type Size, TABS_FONT_CLASS, TABS_PADDING_X_CLASS } from "@asheeui/core";

/** The densities a tab bar can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

describe("the tabs' scale", () => {
  it("describes the height, the padding and the type size at every density", () => {
    for (const map of [
          TABS_HEIGHT_CLASS,
          TABS_PADDING_X_CLASS,
          TABS_FONT_CLASS,
        ]) {
          expect(Object.keys(map).sort()).toEqual([...DENSITIES].sort());
        }
  });

  it("grows a trigger with its density on the web", () => {
    expect(TABS_HEIGHT_CLASS.sm).toBe("h-8");
    expect(TABS_HEIGHT_CLASS.md).toBe("h-10");
    expect(TABS_HEIGHT_CLASS.lg).toBe("h-12");
  });

});
