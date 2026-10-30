/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import { type Size, SPACE_MIN_HEIGHT_CLASS } from "@asheeui/core";
import {
  NATIVE_LOADING_STATE_CLASS,
  NATIVE_LOADING_STATE_PANEL_CLASS,
  NATIVE_LOADING_STATE_SIZE_CLASS,
} from "./loading-state";

/** The densities a loading region can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

describe("the loading region on both renderers", () => {
  it("describes every density on both platforms", () => {
    expect(Object.keys(NATIVE_LOADING_STATE_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("centres what it is loading on both platforms", () => {
    expect(NATIVE_LOADING_STATE_CLASS).toContain("items-center");
    expect(NATIVE_LOADING_STATE_CLASS).toContain("justify-center");
  });

  it("takes the room the state claims from the shared spacing scale", () => {
    // The state claims its room from the scale both renderers read, so a loading
    // region reserves the same space on a phone and on a wide screen.
    expect(Object.keys(SPACE_MIN_HEIGHT_CLASS)).toContain("sm");
    expect(NATIVE_LOADING_STATE_PANEL_CLASS).not.toContain("py-");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [NATIVE_LOADING_STATE_SIZE_CLASS]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }
  });
});
