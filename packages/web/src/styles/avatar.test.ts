/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { AVATAR_BASE_CLASS, AVATAR_FALLBACK_CLASS, AVATAR_FONT_CLASS, AVATAR_SIZE_CLASS } from "./avatar";
import { type Size, AVATAR_FALLBACK_VARIANT } from "@asheeui/core";

/** The three diameters. */
const SIZES: Size[] = ["sm", "md", "lg"];

describe("the avatar's diameter", () => {
  it("describes every size on both platforms", () => {
    expect(Object.keys(AVATAR_SIZE_CLASS).sort()).toEqual([...SIZES].sort());
  });

  it("states the same three diameters, each in its own spelling", () => {
    // The web states one `size-*` utility, which is a width and a height at once; the
        // platform states the pair, because that is the form its compiler reads. 8, 10 and
        // 12 steps are 32, 40 and 48 points on both sides.
        expect(AVATAR_SIZE_CLASS.md).toBe("size-10");
    expect(AVATAR_SIZE_CLASS.sm).toBe("size-8");
    expect(AVATAR_SIZE_CLASS.lg).toBe("size-12");
  });

  it("steps the initials' scale with the diameter on both platforms", () => {
    expect(AVATAR_FONT_CLASS.sm).toBe("text-xs");
    expect(AVATAR_FONT_CLASS.lg).toBe("text-base");
  });

});

describe("the avatar's frame", () => {
  it("clips what it holds on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("overflow-hidden");
  });

  it("centres what it holds on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("items-center");
    expect(AVATAR_BASE_CLASS).toContain("justify-center");
  });

  it("fills the frame with the fallback on both platforms", () => {
    expect(AVATAR_FALLBACK_CLASS).toContain("size-full");
  });

  it("weights and uppercases the initials on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("font-medium");
    expect(AVATAR_BASE_CLASS).toContain("uppercase");
  });

});

describe("the avatar's fallback surface", () => {
  it("is one treatment on the web, and the same treatment on the platform", () => {
    expect(AVATAR_FALLBACK_VARIANT).toBe("solid");
  });

});
