/**
 * The class dictionaries' tests, moved with them.
 *
 * These files state both renderers' maps side by side, which is how the two are kept in step.
 * The platform's half now lives in `@asheeui/native` (C1), and this is the only package that can
 * still read core's half, so the file came with it. C2 moves the web's half to `@asheeui/web`
 * and these assertions follow it there.
 */

import {
  NATIVE_BADGE_FONT_CLASS,
  NATIVE_BADGE_TEXT_CLASS,
  NATIVE_BADGE_VARIANT_CLASS,
} from "./badge";
import {
  type Size,
  type ColorRole,
  type BadgeVariant,
  BADGE_FONT_CLASS,
  BADGE_GAP_CLASS,
  BADGE_HEIGHT_CLASS,
  BADGE_ICON_SIZE_CLASS,
  BADGE_PADDING_CLASS,
} from "@asheeui/core";
/** The densities a badge can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** The treatments a badge can express. */
const TREATMENTS: BadgeVariant[] = ["solid", "faded", "bordered", "ghost"];

/** The colour roles both platforms name. */
const COLOURS: ColorRole[] = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
];

describe("the web badge's class maps", () => {
  const maps = [
    BADGE_HEIGHT_CLASS,
    BADGE_PADDING_CLASS,
    BADGE_FONT_CLASS,
    BADGE_GAP_CLASS,
    BADGE_ICON_SIZE_CLASS,
  ];

  it("describe every density a badge can be", () => {
    for (const map of maps) {
      expect(Object.keys(map).sort()).toEqual([...DENSITIES].sort());
    }
  });

  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of maps) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }
  });
});

describe("the native badge's class maps", () => {
  it("describe every treatment and every colour role", () => {
    for (const map of [NATIVE_BADGE_VARIANT_CLASS, NATIVE_BADGE_TEXT_CLASS]) {
      expect(Object.keys(map).sort()).toEqual([...TREATMENTS].sort());

      for (const treatment of TREATMENTS) {
        expect(Object.keys(map[treatment]).sort()).toEqual([...COLOURS].sort());
      }
    }
  });

  it("answer for every treatment and colour the cascade can hand them", () => {
    for (const treatment of TREATMENTS) {
      for (const colour of COLOURS) {
        const surface = NATIVE_BADGE_VARIANT_CLASS[treatment][colour];
        const text = NATIVE_BADGE_TEXT_CLASS[treatment][colour];

        expect(surface.length).toBeGreaterThan(0);
        expect(text.length).toBeGreaterThan(0);
      }
    }
  });

  it("describe every density a badge can be", () => {
    expect(Object.keys(NATIVE_BADGE_FONT_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });
});
