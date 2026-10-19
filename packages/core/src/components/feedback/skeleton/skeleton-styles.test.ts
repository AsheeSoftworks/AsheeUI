import { describe, expect, it } from "vitest";
import {
  NATIVE_SKELETON_BASE_CLASS,
  SKELETON_ANIMATION_CLASS,
  SKELETON_BASE_CLASS,
} from "./skeleton-styles";

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
    expect(NATIVE_SKELETON_BASE_CLASS).toContain(surface);
  });

  it("leave the pulse to the platform's animator rather than to a class nothing runs", () => {
    expect(NATIVE_SKELETON_BASE_CLASS).not.toContain("animate-");
    expect(SKELETON_ANIMATION_CLASS).toContain("animate-pulse");
  });
});
