/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type { ColorRole, Size } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  SPINNER_BASE_CLASS,
  SPINNER_COLOR_CLASS,
  SPINNER_SIZE_CLASS,
} from "./spinner";

/** The densities a spinner can be. */
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

describe("the web spinner's class maps", () => {
  it("describe every density a spinner can be", () => {
    expect(Object.keys(SPINNER_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("describe every colour role", () => {
    expect(Object.keys(SPINNER_COLOR_CLASS).sort()).toEqual(
      [...COLOURS].sort(),
    );
  });

  it("colour the ring through the current colour, so a role is a text colour here", () => {
    for (const value of Object.values(SPINNER_COLOR_CLASS)) {
      expect(value.startsWith("text-")).toBe(true);
    }
  });

  it("draws `none` as the ink of a filled surface, not as an inherited colour", () => {
    // `none` is what a spinner over a solid surface wants: the same colour the
    // surface paints its content in. Nothing in the map inherits; a spinner that
    // should take the surrounding text colour is given `text-current` explicitly.
    expect(SPINNER_COLOR_CLASS.none).toBe("text-background");
    expect(SPINNER_COLOR_CLASS.none).not.toBe("text-current");
  });

  it("rotates inside `motion-safe`, as the skeleton's shimmer does", () => {
    // A reader who asked for reduced motion gets a still ring; the status region's
    // label, not the movement, carries the wait.
    expect(SPINNER_BASE_CLASS.split(" ")).toContain("motion-safe:animate-spin");
    expect(SPINNER_BASE_CLASS).not.toMatch(/(?:^|\s)animate-spin(?:\s|$)/);
  });
});
