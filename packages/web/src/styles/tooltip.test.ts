/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { type TooltipSizeKey, TOOLTIP_FONT_CLASS, TOOLTIP_PADDING_X_CLASS, TOOLTIP_PADDING_Y_CLASS } from "@asheeui/core";

/** The sizes a hint can be. */
const SIZES: TooltipSizeKey[] = ["sm", "md", "lg"];

describe("the tooltip's scale", () => {
  it("describes the padding and the type size at every size", () => {
    for (const map of [
          TOOLTIP_PADDING_X_CLASS,
          TOOLTIP_PADDING_Y_CLASS,
          TOOLTIP_FONT_CLASS,
        ]) {
          expect(Object.keys(map).sort()).toEqual([...SIZES].sort());
        }
  });

  it("grows the hint with its size", () => {
    expect(TOOLTIP_FONT_CLASS.sm).toBe("text-xs");
    expect(TOOLTIP_FONT_CLASS.md).toBe("text-sm");
    expect(TOOLTIP_FONT_CLASS.lg).toBe("text-base");
  });

});
