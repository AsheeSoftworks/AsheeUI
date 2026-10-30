/**
 * The class dictionaries' tests, moved with them.
 *
 * These files state both renderers' maps side by side, which is how the two are kept in step.
 * The platform's half now lives in `@asheeui/native` (C1), and this is the only package that can
 * still read core's half, so the file came with it. C2 moves the web's half to `@asheeui/web`
 * and these assertions follow it there.
 */

import {
  NATIVE_LOADING_STATE_CLASS,
  NATIVE_LOADING_STATE_PANEL_CLASS,
  NATIVE_LOADING_STATE_SIZE_CLASS,
} from "./loading-state";
import {
  type Size,
  SPACE_MIN_HEIGHT_CLASS,
  LOADING_STATE_CLASS,
  LOADING_STATE_PANEL_CLASS,
  LOADING_STATE_SIZE_CLASS,
} from "@asheeui/core";
/** The densities a loading region can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

describe("the loading region on both renderers", () => {
  it("describes every density on both platforms", () => {
    expect(Object.keys(LOADING_STATE_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
    expect(Object.keys(NATIVE_LOADING_STATE_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("centres what it is loading on both platforms", () => {
    expect(LOADING_STATE_CLASS).toContain("items-center");
    expect(LOADING_STATE_CLASS).toContain("justify-center");
    expect(NATIVE_LOADING_STATE_CLASS).toContain("items-center");
    expect(NATIVE_LOADING_STATE_CLASS).toContain("justify-center");
  });

  it("pads the same axis at the same step on both platforms", () => {
    for (const density of DENSITIES) {
      expect(LOADING_STATE_SIZE_CLASS[density]).toMatch(/^py-/);
      expect(NATIVE_LOADING_STATE_SIZE_CLASS[density]).toBe(
        LOADING_STATE_SIZE_CLASS[density],
      );
    }
  });

  it("takes the room the state claims from the shared spacing scale", () => {
    // The state claims its room from the scale both renderers read, so a loading
    // region reserves the same space on a phone and on a wide screen.
    expect(Object.keys(SPACE_MIN_HEIGHT_CLASS)).toContain("sm");
    expect(LOADING_STATE_PANEL_CLASS).not.toContain("py-");
    expect(NATIVE_LOADING_STATE_PANEL_CLASS).not.toContain("py-");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      LOADING_STATE_SIZE_CLASS,
      NATIVE_LOADING_STATE_SIZE_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }

    expect(LOADING_STATE_CLASS.length).toBeGreaterThan(0);
    expect(NATIVE_LOADING_STATE_CLASS.length).toBeGreaterThan(0);
  });
});
