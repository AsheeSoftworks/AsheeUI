/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import { NATIVE_SKELETON_BASE_CLASS } from "./skeleton";

describe("the native skeleton's classes", () => {
  it("paint the surface with the same token the web paints, so a placeholder reads the same on both platforms", () => {
    const surface = "bg-secondary/60";
    expect(NATIVE_SKELETON_BASE_CLASS).toContain(surface);
  });

  it("leave the pulse to the platform's animator rather than to a class nothing runs", () => {
    expect(NATIVE_SKELETON_BASE_CLASS).not.toContain("animate-");
  });
});
