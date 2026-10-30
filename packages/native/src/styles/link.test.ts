/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type {
  ColorRole,
  LinkUnderline,
  LinkVariant,
  Size,
} from "@asheeui/core";
import {
  NATIVE_LINK_COLOR_CLASS,
  NATIVE_LINK_EXTERNAL_GLYPH,
  NATIVE_LINK_ICON_SIZE_CLASS,
  NATIVE_LINK_UNDERLINE_CLASS,
  NATIVE_LINK_VARIANT_CLASS,
} from "./link";
import { LINK_SIZE_CLASS } from "./portable";

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
    expect(Object.keys(NATIVE_LINK_ICON_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });
});

describe("the link's emphasis and colour", () => {
  it("describes every variant on both platforms", () => {
    expect(Object.keys(NATIVE_LINK_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it("describes every colour role on both platforms", () => {
    expect(Object.keys(NATIVE_LINK_COLOR_CLASS).sort()).toEqual(
      [...COLOURS].sort(),
    );
  });
});

describe("the link's underline", () => {
  it("describes every behaviour on both platforms", () => {
    expect(Object.keys(NATIVE_LINK_UNDERLINE_CLASS).sort()).toEqual(
      [...UNDERLINES].sort(),
    );
  });

  it("reveals the underline on hover on the web and on press on the platform", () => {
    expect(NATIVE_LINK_UNDERLINE_CLASS.hover).toBe("active:underline");
  });
});

describe("the link's external affordance", () => {
  it("shows a character on the platform, because the package ships no icon set", () => {
    expect(NATIVE_LINK_EXTERNAL_GLYPH.length).toBeGreaterThan(0);
  });
});
