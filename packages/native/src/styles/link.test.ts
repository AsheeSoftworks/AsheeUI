/**
 * The class dictionaries' tests, moved with them.
 *
 * These files state both renderers' maps side by side, which is how the two are kept in step.
 * The platform's half now lives in `@asheeui/native` (C1), and this is the only package that can
 * still read core's half, so the file came with it. C2 moves the web's half to `@asheeui/web`
 * and these assertions follow it there.
 */

import {
  NATIVE_LINK_COLOR_CLASS,
  NATIVE_LINK_EXTERNAL_GLYPH,
  NATIVE_LINK_ICON_SIZE_CLASS,
  NATIVE_LINK_UNDERLINE_CLASS,
  NATIVE_LINK_VARIANT_CLASS,
} from "./link";
import {
  type Size,
  type ColorRole,
  type LinkUnderline,
  type LinkVariant,
  LINK_COLOR_CLASS,
  LINK_ICON_SIZE_CLASS,
  LINK_SIZE_CLASS,
  LINK_UNDERLINE_CLASS,
  LINK_VARIANT_CLASS,
} from "@asheeui/core";
/** The densities a link can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** The colour roles both platforms name. */
const COLOURS: ColorRole[] = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
];

/** The emphasis levels a link can carry. */
const VARIANTS: LinkVariant[] = ["default", "muted", "subtle"];

/** When a link shows its underline. */
const UNDERLINES: LinkUnderline[] = ["always", "hover", "never"];

describe("the link's scale", () => {
  it("describes every density on both platforms", () => {
    expect(Object.keys(LINK_SIZE_CLASS).sort()).toEqual([...DENSITIES].sort());
    expect(Object.keys(LINK_ICON_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
    expect(Object.keys(NATIVE_LINK_ICON_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("sizes a drawn icon with a box on the web and a character on the platform", () => {
    for (const density of DENSITIES) {
      expect(LINK_ICON_SIZE_CLASS[density]).toMatch(/^size-/);
      expect(NATIVE_LINK_ICON_SIZE_CLASS[density]).toMatch(/^text-/);
    }
  });
});

describe("the link's emphasis and colour", () => {
  it("describes every variant on both platforms", () => {
    expect(Object.keys(LINK_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
    expect(Object.keys(NATIVE_LINK_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it("describes every colour role on both platforms", () => {
    expect(Object.keys(LINK_COLOR_CLASS).sort()).toEqual([...COLOURS].sort());
    expect(Object.keys(NATIVE_LINK_COLOR_CLASS).sort()).toEqual(
      [...COLOURS].sort(),
    );
  });

  // The two maps are exhaustive over the same vocabulary. A key that no colour role
  // names — the old `default` entry was one — resolves no class and hides a role the
  // other renderer does describe, so the maps must say exactly the same thing.
  it("names the same colours on the web as on the platform", () => {
    expect(Object.keys(LINK_COLOR_CLASS).sort()).toEqual(
      Object.keys(NATIVE_LINK_COLOR_CLASS).sort(),
    );
  });

  it("gives the role's own colour to the text on both platforms", () => {
    for (const colour of COLOURS) {
      const hue = colour === "none" ? "foreground" : colour;

      expect(LINK_COLOR_CLASS[colour]).toContain(hue);
      expect(NATIVE_LINK_COLOR_CLASS[colour]).toContain(hue);
    }
  });
});

describe("the link's underline", () => {
  it("describes every behaviour on both platforms", () => {
    expect(Object.keys(LINK_UNDERLINE_CLASS).sort()).toEqual(
      [...UNDERLINES].sort(),
    );
    expect(Object.keys(NATIVE_LINK_UNDERLINE_CLASS).sort()).toEqual(
      [...UNDERLINES].sort(),
    );
  });

  it("reveals the underline on hover on the web and on press on the platform", () => {
    // The platform has no pointer to hover with, so the intent is carried by the
    // platform's own interaction: the link underlines itself while it is pressed.
    expect(LINK_UNDERLINE_CLASS.hover).toContain("hover:underline");
    expect(NATIVE_LINK_UNDERLINE_CLASS.hover).toBe("active:underline");
  });

  it("states the two extremes the same way on both platforms", () => {
    for (const underline of ["always", "never"] as LinkUnderline[]) {
      const web = LINK_UNDERLINE_CLASS[underline];
      const native = NATIVE_LINK_UNDERLINE_CLASS[underline];

      expect(web.includes("underline")).toBe(native.includes("underline"));
      expect(web.startsWith("no-underline")).toBe(
        native.startsWith("no-underline"),
      );
    }
  });
});

describe("the link's external affordance", () => {
  it("shows a character on the platform, because the package ships no icon set", () => {
    expect(NATIVE_LINK_EXTERNAL_GLYPH.length).toBeGreaterThan(0);
  });
});
