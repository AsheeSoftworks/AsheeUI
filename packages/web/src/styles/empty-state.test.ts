/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { EMPTY_STATE_ICON_CLASS, EMPTY_STATE_ICON_SIZE_CLASS, EMPTY_STATE_PANEL_CLASS, EMPTY_STATE_SIZE_CLASS } from "./empty-state";
import { type Size, type EmptyStateType } from "@asheeui/core";

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
  });

  it("leaves the room to the shared spacing scale rather than to a panel", () => {
    expect(EMPTY_STATE_PANEL_CLASS).not.toContain("p-");
  });

});

describe("the empty state's tone on both renderers", () => {
  it("describes every tone", () => {
    expect(Object.keys(EMPTY_STATE_ICON_CLASS).sort()).toEqual(
          [...TONES].sort(),
        );
  });

  it("separates the tones rather than tinting them all the same colour", () => {
  });

});

describe("the empty state's classes", () => {
  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
          EMPTY_STATE_SIZE_CLASS,
          EMPTY_STATE_ICON_SIZE_CLASS,
          EMPTY_STATE_ICON_CLASS,
        ]) {
          for (const value of Object.values(map)) {
            expect(value.length).toBeGreaterThan(0);
            expect(value).not.toContain("undefined");
          }
        }
  });

});
