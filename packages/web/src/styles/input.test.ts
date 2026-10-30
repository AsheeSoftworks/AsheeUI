/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { INPUT_SIZE_CLASS } from "./input";
import { type Size } from "@asheeui/core";

/** The densities a field can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

describe("the web input's class maps", () => {
  it("describe every density an input can be", () => {
    expect(Object.keys(INPUT_SIZE_CLASS).sort()).toEqual([...DENSITIES].sort());
  });

  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const value of Object.values(INPUT_SIZE_CLASS)) {
          expect(value.length).toBeGreaterThan(0);
          expect(value).not.toContain("undefined");
        }
  });

});
