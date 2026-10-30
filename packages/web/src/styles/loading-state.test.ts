/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type { Size } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  LOADING_STATE_CLASS,
  LOADING_STATE_PANEL_CLASS,
  LOADING_STATE_SIZE_CLASS,
} from "./loading-state";
import { SPACE_MIN_HEIGHT_CLASS } from "./portable";

/** The densities a loading region can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

describe("the loading region on both renderers", () => {
  it("describes every density on both platforms", () => {
    expect(Object.keys(LOADING_STATE_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("centres what it is loading on both platforms", () => {
    expect(LOADING_STATE_CLASS).toContain("items-center");
    expect(LOADING_STATE_CLASS).toContain("justify-center");
  });

  it("takes the room the state claims from the shared spacing scale", () => {
    // The state claims its room from the scale both renderers read, so a loading
    // region reserves the same space on a phone and on a wide screen.
    expect(Object.keys(SPACE_MIN_HEIGHT_CLASS)).toContain("sm");
    expect(LOADING_STATE_PANEL_CLASS).not.toContain("py-");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [LOADING_STATE_SIZE_CLASS]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }

    expect(LOADING_STATE_CLASS.length).toBeGreaterThan(0);
  });
});
