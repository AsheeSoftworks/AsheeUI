import { describe, expect, it } from "vitest";
import type { Size } from "../../shared/radius";
import type { ToastPlacement, ToastType } from "./toast-config";
import {
  NATIVE_TOAST_CONTAINER_CLASS,
  NATIVE_TOAST_PLACEMENT_CLASS,
  NATIVE_TOAST_TYPE_GLYPH,
  PLACEMENT_CLASSES,
  TOAST_ANIMATION_STATE,
  TOAST_FONT_CLASS,
  TOAST_PADDING_CLASS,
  TOAST_TITLE_FONT_CLASS,
  TOAST_TYPE_COLOR,
  TOAST_WIDTH_CLASS,
} from "./toast-styles";

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

  it("gives every type a glyph on the platform, so no message has an empty slot", () => {
    expect(Object.keys(NATIVE_TOAST_TYPE_GLYPH).sort()).toEqual(
      [...TYPES].sort(),
    );

    for (const glyph of Object.values(NATIVE_TOAST_TYPE_GLYPH)) {
      expect(glyph.length).toBeGreaterThan(0);
    }
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

  it("anchors every placement on the platform, at the edge its name states", () => {
    expect(Object.keys(NATIVE_TOAST_PLACEMENT_CLASS).sort()).toEqual(
      [...PLACEMENTS].sort(),
    );

    for (const placement of PLACEMENTS) {
      const classes = NATIVE_TOAST_PLACEMENT_CLASS[placement];

      if (placement.startsWith("top-")) {
        expect(classes).toContain("top-0");
        expect(classes).not.toContain("bottom-0");
      } else {
        expect(classes).toContain("bottom-0");
        expect(classes).not.toContain("top-0");
      }

      // The side a message stacks against follows the same name: a centred placement
      // is centred, and a named side is aligned to that side.
      if (placement.endsWith("-center")) {
        expect(classes).toContain("items-center");
      } else if (placement.endsWith("-right")) {
        expect(classes).toContain("items-end");
      } else {
        expect(classes).toContain("items-start");
      }
    }
  });

  it("stacks messages in one absolute layer on the platform, rather than fixing each message", () => {
    expect(NATIVE_TOAST_CONTAINER_CLASS).toContain("absolute");

    for (const placement of PLACEMENTS) {
      expect(NATIVE_TOAST_PLACEMENT_CLASS[placement]).not.toContain("absolute");
    }
  });
});
