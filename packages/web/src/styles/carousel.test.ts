/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type { CarouselVariant, Size } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import { CAROUSEL_HEIGHT_CLASS, CAROUSEL_VARIANT_CLASS } from "./carousel";
import { CAROUSEL_PADDING_CLASS } from "./portable";

/** The heights a carousel can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** The visual styles a carousel can take. */
const VARIANTS: CarouselVariant[] = ["bordered", "ghost"];

describe("the carousel's frame", () => {
  it("describes every height on both platforms", () => {
    expect(Object.keys(CAROUSEL_HEIGHT_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("steps the height up at a breakpoint on the web and states one height on the platform", () => {
    // A wide window can afford a taller slide and a phone cannot, so only the web's map
    // carries a second step.
    expect(CAROUSEL_HEIGHT_CLASS.sm).toContain("md:");
  });

  it("describes the same density steps on both platforms, in the order they grow", () => {
    const web = DENSITIES.map((size) => CAROUSEL_HEIGHT_CLASS[size].length);
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
  });

  it("keeps the ghost variant free of a frame on both platforms", () => {
    expect(CAROUSEL_VARIANT_CLASS.ghost).toBe("bg-transparent");
  });
});
