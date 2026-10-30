/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { type Size, type ToastPlacement, type ToastType, PLACEMENT_CLASSES, TOAST_ANIMATION_STATE, TOAST_FONT_CLASS, TOAST_PADDING_CLASS, TOAST_TITLE_FONT_CLASS, TOAST_TYPE_COLOR, TOAST_WIDTH_CLASS } from "@asheeui/core";

/** The types of message the system names. */
const TYPES: ToastType[] = ["success", "error", "info", "warning", "default"];

/** The placements a message can appear at. */
const PLACEMENTS: ToastPlacement[] = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
  "top-center",
  "bottom-center",
];

/** The densities a message can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

describe("what a type of message means", () => {
  it("presents every type in a colour role", () => {
    expect(Object.keys(TOAST_TYPE_COLOR).sort()).toEqual([...TYPES].sort());
  });

  it("presents a failure as the danger role, on both platforms", () => {
    expect(TOAST_TYPE_COLOR.error).toBe("danger");
    expect(TOAST_TYPE_COLOR.warning).toBe("warning");
    expect(TOAST_TYPE_COLOR.success).toBe("success");
    expect(TOAST_TYPE_COLOR.info).toBe("primary");
  });

});

describe("the scale a message is drawn at", () => {
  it("describes every density, on both platforms", () => {
    for (const map of [
          TOAST_WIDTH_CLASS,
          TOAST_PADDING_CLASS,
          TOAST_FONT_CLASS,
          TOAST_TITLE_FONT_CLASS,
        ]) {
          expect(Object.keys(map).sort()).toEqual([...DENSITIES].sort());
        }
  });

  it("fits a message inside the screen it is read on", () => {
    for (const density of DENSITIES) {
          expect(TOAST_WIDTH_CLASS[density]).toContain("max-w-full");
        }
  });

});

describe("where a message appears", () => {
  it("anchors every placement on the web, with an animation of its own", () => {
    expect(Object.keys(PLACEMENT_CLASSES).sort()).toEqual(
          [...PLACEMENTS].sort(),
        );
    for (const placement of PLACEMENTS) {
          expect(typeof TOAST_ANIMATION_STATE[placement].enter).toBe("string");
          expect(typeof TOAST_ANIMATION_STATE[placement].exit).toBe("string");
        }
  });

});
