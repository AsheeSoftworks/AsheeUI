/**
 * Tests that the shared class maps and the design-token scale agree.
 *
 * `src/tokens.ts` owns the scales (`SPACING_STEP`, `RADIUS_STEP`, `SIZE`) and
 * `src/shared/*` maps each step to a static Tailwind class. The shared unions
 * are derived from the token maps and the maps are `Record`-typed by those
 * unions, so adding a step to one side without the other is a compile error.
 * These checks pin the same invariant at runtime, where a mismatch would
 * otherwise resolve to a missing class instead of a type error. The platform's radius map moved
 * to `@asheeui/native` in C1 and its own test states the same invariant there.
 */

import { describe, expect, it } from "vitest";
import { SIZE, SPACING_STEP } from "../tokens";

import {
  SPACE_BLOCK_CLASS,
  SPACE_GAP_CLASS,
  SPACE_MIN_HEIGHT_CLASS,
  SPACE_PADDING_Y_CLASS,
} from "./spacing";

const SPACING_MAPS = {
  gap: SPACE_GAP_CLASS,
  block: SPACE_BLOCK_CLASS,
  paddingY: SPACE_PADDING_Y_CLASS,
  minHeight: SPACE_MIN_HEIGHT_CLASS,
};

describe("the shared scales", () => {
  it("maps exactly the spacing steps the token map declares", () => {
    const steps = Object.keys(SPACING_STEP).sort();

    for (const [name, map] of Object.entries(SPACING_MAPS)) {
      expect(Object.keys(map).sort(), name).toEqual(steps);
    }
  });

  it("states the size scale once, in the token map", () => {
    // `shared/radius.ts` re-exports `Size` from the `SIZE` map instead of
    // restating the union, so the map's keys are the whole size scale.
    expect(Object.keys(SIZE).sort()).toEqual(["lg", "md", "sm"]);
  });
});
