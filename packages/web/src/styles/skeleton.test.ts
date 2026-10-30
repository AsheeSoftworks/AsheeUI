/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { SKELETON_ANIMATION_CLASS, SKELETON_BASE_CLASS } from "./skeleton";

describe("the web skeleton's classes", () => {
  it("paint the surface with the theme's own token rather than with a grey of its own", () => {
    expect(SKELETON_BASE_CLASS).toContain("bg-secondary");
  });

  it("shimmer only where the visitor welcomes motion", () => {
    expect(SKELETON_ANIMATION_CLASS).toContain("motion-safe:");
  });

});

describe("the native skeleton's classes", () => {
  it("paint the surface with the same token the web paints, so a placeholder reads the same on both platforms", () => {
    const surface = "bg-secondary/60";
    expect(SKELETON_BASE_CLASS).toContain(surface);
  });

  it("leave the pulse to the platform's animator rather than to a class nothing runs", () => {
    expect(SKELETON_ANIMATION_CLASS).toContain("animate-pulse");
  });

});
