import { describe, expect, it } from "vitest";
import type { Size } from "../../shared/radius";
import {
  AVATAR_BASE_CLASS,
  AVATAR_FALLBACK_CLASS,
  AVATAR_FALLBACK_VARIANT,
  AVATAR_FONT_CLASS,
  AVATAR_SIZE_CLASS,
  NATIVE_AVATAR_BASE_CLASS,
  NATIVE_AVATAR_FALLBACK_CLASS,
  NATIVE_AVATAR_FALLBACK_TEXT_CLASS,
  NATIVE_AVATAR_FONT_CLASS,
  NATIVE_AVATAR_INITIALS_CLASS,
  NATIVE_AVATAR_SIZE_CLASS,
  NATIVE_AVATAR_TEXT_BLOCK_CLASS,
} from "./avatar-styles";

/** The three diameters. */
const SIZES: Size[] = ["sm", "md", "lg"];

/** The six colour roles a fallback surface can wear. */
const ROLES = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
] as const;

describe("the avatar's diameter", () => {
  it("describes every size on both platforms", () => {
    expect(Object.keys(AVATAR_SIZE_CLASS).sort()).toEqual([...SIZES].sort());
    expect(Object.keys(NATIVE_AVATAR_SIZE_CLASS).sort()).toEqual(
      [...SIZES].sort(),
    );
  });

  it("states the same three diameters, each in its own spelling", () => {
    // The web states one `size-*` utility, which is a width and a height at once; the
    // platform states the pair, because that is the form its compiler reads. 8, 10 and
    // 12 steps are 32, 40 and 48 points on both sides.
    expect(AVATAR_SIZE_CLASS.md).toBe("size-10");
    expect(NATIVE_AVATAR_SIZE_CLASS.md).toBe("h-10 w-10");
    expect(AVATAR_SIZE_CLASS.sm).toBe("size-8");
    expect(NATIVE_AVATAR_SIZE_CLASS.sm).toBe("h-8 w-8");
    expect(AVATAR_SIZE_CLASS.lg).toBe("size-12");
    expect(NATIVE_AVATAR_SIZE_CLASS.lg).toBe("h-12 w-12");
  });

  it("steps the initials' scale with the diameter on both platforms", () => {
    expect(AVATAR_FONT_CLASS.sm).toBe("text-xs");
    expect(AVATAR_FONT_CLASS.lg).toBe("text-base");
    // A native label starts one step higher: it is read at arm's length.
    expect(NATIVE_AVATAR_FONT_CLASS.sm).toBe("text-sm");
    expect(NATIVE_AVATAR_FONT_CLASS.lg).toBe("text-lg");
  });
});

describe("the avatar's frame", () => {
  it("clips what it holds on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("overflow-hidden");
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("overflow-hidden");
  });

  it("centres what it holds on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("items-center");
    expect(AVATAR_BASE_CLASS).toContain("justify-center");
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("items-center");
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("justify-center");
  });

  it("fills the frame with the fallback on both platforms", () => {
    expect(AVATAR_FALLBACK_CLASS).toContain("size-full");
    expect(NATIVE_AVATAR_TEXT_BLOCK_CLASS).toContain("h-full w-full");
  });

  it("weights and uppercases the initials on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("font-medium");
    expect(AVATAR_BASE_CLASS).toContain("uppercase");
    expect(NATIVE_AVATAR_INITIALS_CLASS).toContain("font-medium");
    expect(NATIVE_AVATAR_INITIALS_CLASS).toContain("uppercase");
  });
});

describe("the avatar's fallback surface", () => {
  it("is one treatment on the web, and the same treatment on the platform", () => {
    expect(AVATAR_FALLBACK_VARIANT).toBe("solid");
  });

  it("wears the accent of every colour role on the platform", () => {
    expect(Object.keys(NATIVE_AVATAR_FALLBACK_CLASS).sort()).toEqual(
      [...ROLES].sort(),
    );
    expect(NATIVE_AVATAR_FALLBACK_CLASS.primary).toBe("bg-primary");
    expect(NATIVE_AVATAR_FALLBACK_CLASS.danger).toBe("bg-danger");
  });

  it("carries the framework's foreground on every accent, as the web's solid treatment does", () => {
    expect(NATIVE_AVATAR_FALLBACK_TEXT_CLASS).toBe("text-foreground");
  });
});
