/**
 * The class dictionaries' tests, moved with them.
 *
 * These files state both renderers' maps side by side, which is how the two are kept in step.
 * The platform's half now lives in `@asheeui/native` (C1), and this is the only package that can
 * still read core's half, so the file came with it. C2 moves the web's half to `@asheeui/web`
 * and these assertions follow it there.
 */

import { NATIVE_TOOLTIP_ALIGN_CLASS, NATIVE_TOOLTIP_ANCHOR } from "./tooltip";
import {
  type TooltipPlacement,
  type TooltipSizeKey,
  TOOLTIP_FONT_CLASS,
  TOOLTIP_PADDING_X_CLASS,
  TOOLTIP_PADDING_Y_CLASS,
} from "@asheeui/core";
/** The sizes a hint can be. */
const SIZES: TooltipSizeKey[] = ["sm", "md", "lg"];

/** The placements a hint can take. */
const PLACEMENTS: TooltipPlacement[] = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
];

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

describe("where the platform puts a hint", () => {
  it("describes every placement", () => {
    expect(Object.keys(NATIVE_TOOLTIP_ANCHOR).sort()).toEqual(
      [...PLACEMENTS].sort(),
    );
  });

  it("puts a placement that names a side above or below, in the order a reader reads", () => {
    // A hint beside a control has nowhere to be on a screen a thumb is holding, so a side
    // resolves to the direction it reads from: what comes before the control is above it and
    // what comes after it is below.
    expect(NATIVE_TOOLTIP_ANCHOR.top.direction).toBe("above");
    expect(NATIVE_TOOLTIP_ANCHOR.bottom.direction).toBe("below");
    expect(NATIVE_TOOLTIP_ANCHOR.left.direction).toBe("above");
    expect(NATIVE_TOOLTIP_ANCHOR.right.direction).toBe("below");
  });

  it("keeps the side a placement asked for and the alignment it asked for", () => {
    for (const placement of PLACEMENTS) {
      const expected =
        placement.startsWith("top") || placement.startsWith("left")
          ? "above"
          : "below";

      expect(NATIVE_TOOLTIP_ANCHOR[placement].direction).toBe(expected);
    }

    expect(NATIVE_TOOLTIP_ANCHOR["top-start"].align).toBe("start");
    expect(NATIVE_TOOLTIP_ANCHOR["top-end"].align).toBe("end");
    expect(NATIVE_TOOLTIP_ANCHOR.top.align).toBe("center");
  });

  it("describes every alignment the anchor map names", () => {
    expect(Object.keys(NATIVE_TOOLTIP_ALIGN_CLASS).sort()).toEqual([
      "center",
      "end",
      "start",
    ]);

    for (const placement of PLACEMENTS) {
      expect(Object.keys(NATIVE_TOOLTIP_ALIGN_CLASS)).toContain(
        NATIVE_TOOLTIP_ANCHOR[placement].align,
      );
    }
  });
});
