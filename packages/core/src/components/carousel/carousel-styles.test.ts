import { describe, expect, it } from "vitest";
import type { Size } from "../../shared/radius";
import type { CarouselVariant } from "./carousel-config";
import {
  CAROUSEL_HEIGHT_CLASS,
  CAROUSEL_PADDING_CLASS,
  CAROUSEL_VARIANT_CLASS,
  NATIVE_CAROUSEL_CONTROL_CLASS,
  NATIVE_CAROUSEL_HEIGHT_CLASS,
  NATIVE_CAROUSEL_INDICATOR_CLASS,
  NATIVE_CAROUSEL_INDICATOR_MARK_CLASS,
  NATIVE_CAROUSEL_NEXT_GLYPH,
  NATIVE_CAROUSEL_PREV_GLYPH,
  NATIVE_CAROUSEL_VARIANT_CLASS,
} from "./carousel-styles";

/** The heights a carousel can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** The visual styles a carousel can take. */
const VARIANTS: CarouselVariant[] = ["bordered", "ghost"];

describe("the carousel's frame", () => {
  it("describes every height on both platforms", () => {
    expect(Object.keys(CAROUSEL_HEIGHT_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
    expect(Object.keys(NATIVE_CAROUSEL_HEIGHT_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("steps the height up at a breakpoint on the web and states one height on the platform", () => {
    // A wide window can afford a taller slide and a phone cannot, so only the web's map
    // carries a second step.
    expect(CAROUSEL_HEIGHT_CLASS.sm).toContain("md:");
    expect(NATIVE_CAROUSEL_HEIGHT_CLASS.sm).not.toContain("md:");
  });

  it("describes the same density steps on both platforms, in the order they grow", () => {
    const web = DENSITIES.map((size) => CAROUSEL_HEIGHT_CLASS[size].length);
    const platform = DENSITIES.map(
      (size) => NATIVE_CAROUSEL_HEIGHT_CLASS[size],
    );

    expect(platform).toEqual(["h-60", "h-80", "h-[400px]"]);
    expect(web).toHaveLength(DENSITIES.length);
  });
});

describe("the carousel's slides and frame", () => {
  it("describes the inner padding of a slide at every density", () => {
    expect(Object.keys(CAROUSEL_PADDING_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("describes every variant on both platforms", () => {
    expect(Object.keys(CAROUSEL_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
    expect(Object.keys(NATIVE_CAROUSEL_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it("keeps the ghost variant free of a frame on both platforms", () => {
    expect(CAROUSEL_VARIANT_CLASS.ghost).toBe("bg-transparent");
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
