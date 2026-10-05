/**
 * Tests for the shared spacing scale.
 *
 * The scale is a contract between the layout components, so the checks are
 * about completeness and about the property the whole framework depends on:
 * every entry is a complete class string, never a fragment that would have to be
 * assembled at render time.
 */

import { describe, expect, it } from "vitest";
import {
  SPACE_BLOCK_CLASS,
  SPACE_GAP_CLASS,
  SPACE_PADDING_X_CLASS,
  SPACE_PADDING_Y_CLASS,
  type Space,
} from "./spacing";

const TOKENS: Space[] = ["none", "xs", "sm", "md", "lg", "xl", "2xl"];

const MAPS = {
  gap: SPACE_GAP_CLASS,
  block: SPACE_BLOCK_CLASS,
  paddingY: SPACE_PADDING_Y_CLASS,
  paddingX: SPACE_PADDING_X_CLASS,
};

describe("the spacing scale", () => {
  it("defines every token in every map", () => {
    for (const [name, map] of Object.entries(MAPS)) {
      expect(Object.keys(map).sort(), name).toEqual([...TOKENS].sort());
    }
  });

  it("maps every token to a complete class string", () => {
    for (const [name, map] of Object.entries(MAPS)) {
      for (const token of TOKENS) {
        const value = map[token];

        expect(value, `${name}.${token}`).toBeTruthy();
        expect(value, `${name}.${token}`).not.toContain("${");
      }
    }
  });

  it("increases with the token, so the scale reads in one direction", () => {
    const gapOrder = TOKENS.map((token) => SPACE_GAP_CLASS[token]);

    expect(gapOrder).toEqual([
      "gap-0",
      "gap-1",
      "gap-2",
      "gap-4",
      "gap-6",
      "gap-8",
      "gap-12",
    ]);
  });

  it("gives a section a wider step on a wider screen", () => {
    expect(SPACE_PADDING_Y_CLASS.lg).toContain("md:");
    expect(SPACE_PADDING_X_CLASS.lg).toContain("lg:");
  });
});
