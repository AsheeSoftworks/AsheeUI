/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import {
  CAROUSEL_PADDING_CLASS,
  type CarouselVariant,
  type Size,
} from "@asheeui/core";
import {
  NATIVE_CAROUSEL_CONTROL_CLASS,
  NATIVE_CAROUSEL_HEIGHT_CLASS,
  NATIVE_CAROUSEL_INDICATOR_CLASS,
  NATIVE_CAROUSEL_INDICATOR_MARK_CLASS,
  NATIVE_CAROUSEL_NEXT_GLYPH,
  NATIVE_CAROUSEL_PREV_GLYPH,
  NATIVE_CAROUSEL_VARIANT_CLASS,
} from "./carousel";

/** The heights a carousel can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** The visual styles a carousel can take. */
const VARIANTS: CarouselVariant[] = ["bordered", "ghost"];

describe("the carousel's frame", () => {
  it("describes every height on both platforms", () => {
    expect(Object.keys(NATIVE_CAROUSEL_HEIGHT_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("steps the height up at a breakpoint on the web and states one height on the platform", () => {
    expect(NATIVE_CAROUSEL_HEIGHT_CLASS.sm).not.toContain("md:");
  });

  it("describes the same density steps on both platforms, in the order they grow", () => {
    const platform = DENSITIES.map(
      (size) => NATIVE_CAROUSEL_HEIGHT_CLASS[size],
    );
    expect(platform).toEqual(["h-60", "h-80", "h-[400px]"]);
  });
});

describe("the carousel's slides and frame", () => {
  it("describes the inner padding of a slide at every density", () => {
    expect(Object.keys(CAROUSEL_PADDING_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("describes every variant on both platforms", () => {
    expect(Object.keys(NATIVE_CAROUSEL_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it("keeps the ghost variant free of a frame on both platforms", () => {
    expect(NATIVE_CAROUSEL_VARIANT_CLASS.ghost).toBe("bg-transparent");
  });
});

describe("the carousel's controls and dots on the platform", () => {
  it("gives every control and every dot a target a thumb can reach", () => {
    expect(NATIVE_CAROUSEL_CONTROL_CLASS).toContain("min-h-[44px]");
    expect(NATIVE_CAROUSEL_CONTROL_CLASS).toContain("min-w-[44px]");
    expect(NATIVE_CAROUSEL_INDICATOR_CLASS).toContain("min-h-[44px]");
    expect(NATIVE_CAROUSEL_INDICATOR_CLASS).toContain("min-w-[44px]");
  });

  it("shows the current slide's dot differently from the rest", () => {
    expect(Object.keys(NATIVE_CAROUSEL_INDICATOR_MARK_CLASS).sort()).toEqual([
      "active",
      "resting",
    ]);
    expect(NATIVE_CAROUSEL_INDICATOR_MARK_CLASS.active).not.toBe(
      NATIVE_CAROUSEL_INDICATOR_MARK_CLASS.resting,
    );
  });

  it("shows a character for each control, because the package ships no icon set", () => {
    expect(NATIVE_CAROUSEL_PREV_GLYPH.length).toBeGreaterThan(0);
    expect(NATIVE_CAROUSEL_NEXT_GLYPH.length).toBeGreaterThan(0);
    expect(NATIVE_CAROUSEL_PREV_GLYPH).not.toBe(NATIVE_CAROUSEL_NEXT_GLYPH);
  });
});
