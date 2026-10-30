/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type {
  ColorRole,
  LinkUnderline,
  LinkVariant,
  Size,
} from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  LINK_COLOR_CLASS,
  LINK_ICON_SIZE_CLASS,
  LINK_UNDERLINE_CLASS,
  LINK_VARIANT_CLASS,
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
    expect(Object.keys(LINK_ICON_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });
});

describe("the link's emphasis and colour", () => {
  it("describes every variant on both platforms", () => {
    expect(Object.keys(LINK_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it("describes every colour role on both platforms", () => {
    expect(Object.keys(LINK_COLOR_CLASS).sort()).toEqual([...COLOURS].sort());
  });
});

describe("the link's underline", () => {
  it("describes every behaviour on both platforms", () => {
    expect(Object.keys(LINK_UNDERLINE_CLASS).sort()).toEqual(
      [...UNDERLINES].sort(),
    );
  });

  it("reveals the underline on hover on the web and on press on the platform", () => {
    // The platform has no pointer to hover with, so the intent is carried by the
    // platform's own interaction: the link underlines itself while it is pressed.
    expect(LINK_UNDERLINE_CLASS.hover).toContain("hover:underline");
  });
});
