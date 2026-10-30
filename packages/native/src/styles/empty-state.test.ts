/**
 * The class dictionaries' tests, moved with them.
 *
 * These files state both renderers' maps side by side, which is how the two are kept in step.
 * The platform's half now lives in `@asheeui/native` (C1), and this is the only package that can
 * still read core's half, so the file came with it. C2 moves the web's half to `@asheeui/web`
 * and these assertions follow it there.
 */

import {
  NATIVE_EMPTY_STATE_ICON_CLASS,
  NATIVE_EMPTY_STATE_ICON_SIZE_CLASS,
  NATIVE_EMPTY_STATE_ICON_TEXT_CLASS,
  NATIVE_EMPTY_STATE_PANEL_CLASS,
  NATIVE_EMPTY_STATE_SIZE_CLASS,
} from "./empty-state";
import {
  type Size,
  type EmptyStateType,
  EMPTY_STATE_ICON_CLASS,
  EMPTY_STATE_ICON_SIZE_CLASS,
  EMPTY_STATE_PANEL_CLASS,
  EMPTY_STATE_SIZE_CLASS,
} from "@asheeui/core";
/** The densities a state can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** The tones a state can take. */
const TONES: EmptyStateType[] = ["info", "success", "warning", "error"];

describe("the empty state's density on both renderers", () => {
  it("describes every density on both platforms", () => {
    expect(Object.keys(EMPTY_STATE_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
    expect(Object.keys(EMPTY_STATE_ICON_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
    expect(Object.keys(NATIVE_EMPTY_STATE_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
    expect(Object.keys(NATIVE_EMPTY_STATE_ICON_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("leaves the room to the shared spacing scale rather than to a panel", () => {
    expect(EMPTY_STATE_PANEL_CLASS).not.toContain("p-");
    expect(NATIVE_EMPTY_STATE_PANEL_CLASS).not.toContain("p-");
  });

  it("states a width and a height on the platform where the web states a size", () => {
    for (const density of DENSITIES) {
      expect(NATIVE_EMPTY_STATE_ICON_SIZE_CLASS[density]).toMatch(
        /^w-\S+ h-\S+$/,
      );
    }
  });
});

describe("the empty state's tone on both renderers", () => {
  it("describes every tone", () => {
    expect(Object.keys(EMPTY_STATE_ICON_CLASS).sort()).toEqual(
      [...TONES].sort(),
    );
    expect(Object.keys(NATIVE_EMPTY_STATE_ICON_CLASS).sort()).toEqual(
      [...TONES].sort(),
    );
    expect(Object.keys(NATIVE_EMPTY_STATE_ICON_TEXT_CLASS).sort()).toEqual(
      [...TONES].sort(),
    );
  });

  it("colours the badge with the same tokens on both renderers, so the tone cannot drift", () => {
    for (const tone of TONES) {
      // The native badge is the web badge without the parts a view does not need,
      // so the shared half is present in both strings, character for character.
      expect(EMPTY_STATE_ICON_CLASS[tone]).toContain(
        NATIVE_EMPTY_STATE_ICON_CLASS[tone],
      );
      // The web badge carries the glyph's colour for the icon to inherit; the
      // platform states it separately, and it is the same token.
      expect(EMPTY_STATE_ICON_CLASS[tone]).toContain(
        NATIVE_EMPTY_STATE_ICON_TEXT_CLASS[tone],
      );
    }
  });

  it("separates the tones rather than tinting them all the same colour", () => {
    const colours = TONES.map(
      (tone) => NATIVE_EMPTY_STATE_ICON_TEXT_CLASS[tone],
    );

    expect(new Set(colours).size).toBe(TONES.length);
  });
});

describe("the empty state's classes", () => {
  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      EMPTY_STATE_SIZE_CLASS,
      EMPTY_STATE_ICON_SIZE_CLASS,
      EMPTY_STATE_ICON_CLASS,
      NATIVE_EMPTY_STATE_SIZE_CLASS,
      NATIVE_EMPTY_STATE_ICON_SIZE_CLASS,
      NATIVE_EMPTY_STATE_ICON_CLASS,
      NATIVE_EMPTY_STATE_ICON_TEXT_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }
  });
});
