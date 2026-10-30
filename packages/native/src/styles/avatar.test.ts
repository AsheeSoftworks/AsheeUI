/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import { AVATAR_FALLBACK_VARIANT, type Size } from "@asheeui/core";
import {
  NATIVE_AVATAR_BASE_CLASS,
  NATIVE_AVATAR_FALLBACK_CLASS,
  NATIVE_AVATAR_FALLBACK_TEXT_CLASS,
  NATIVE_AVATAR_FONT_CLASS,
  NATIVE_AVATAR_INITIALS_CLASS,
  NATIVE_AVATAR_SIZE_CLASS,
  NATIVE_AVATAR_TEXT_BLOCK_CLASS,
} from "./avatar";

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
    expect(Object.keys(NATIVE_AVATAR_SIZE_CLASS).sort()).toEqual(
      [...SIZES].sort(),
    );
  });

  it("states the same three diameters, each in its own spelling", () => {
    expect(NATIVE_AVATAR_SIZE_CLASS.md).toBe("h-10 w-10");
    expect(NATIVE_AVATAR_SIZE_CLASS.sm).toBe("h-8 w-8");
    expect(NATIVE_AVATAR_SIZE_CLASS.lg).toBe("h-12 w-12");
  });

  it("steps the initials' scale with the diameter on both platforms", () => {
    // A native label starts one step higher: it is read at arm's length.
    expect(NATIVE_AVATAR_FONT_CLASS.sm).toBe("text-sm");
    expect(NATIVE_AVATAR_FONT_CLASS.lg).toBe("text-lg");
  });
});

describe("the avatar's frame", () => {
  it("clips what it holds on both platforms", () => {
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("overflow-hidden");
  });

  it("centres what it holds on both platforms", () => {
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("items-center");
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("justify-center");
  });

  it("fills the frame with the fallback on both platforms", () => {
    expect(NATIVE_AVATAR_TEXT_BLOCK_CLASS).toContain("h-full w-full");
  });

  it("weights and uppercases the initials on both platforms", () => {
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
