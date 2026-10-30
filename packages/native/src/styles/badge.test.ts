/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type { BadgeVariant, ColorRole, Size } from "@asheeui/core";
import {
  NATIVE_BADGE_FONT_CLASS,
  NATIVE_BADGE_TEXT_CLASS,
  NATIVE_BADGE_VARIANT_CLASS,
} from "./badge";

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
