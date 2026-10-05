import { describe, expect, it } from "vitest";
import type { Size } from "../../shared/radius";
import type { Variant } from "../../shared/variant";
import type { ColorRole } from "../../tokens";
import { FIELD_STATUS_BORDER_CLASS } from "../field/field-styles";
import {
  INPUT_SIZE_CLASS,
  NATIVE_INPUT_BASE_CLASS,
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_INVALID_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_MULTILINE_CLASS,
  NATIVE_INPUT_SIZE_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
} from "./input-styles";

/** The densities a field can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** Every treatment a field can wear, including the one with no surface. */
const TREATMENTS: Variant[] = [
  "solid",
  "faded",
  "bordered",
  "ghost",
  "underlined",
];

/** The colour roles both platforms name. */
const COLOURS: ColorRole[] = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
];

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

describe("the native input's class maps", () => {
  it("describe every density an input can be", () => {
    expect(Object.keys(NATIVE_INPUT_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("describe every treatment a field can wear", () => {
    for (const map of [
      NATIVE_INPUT_VARIANT_CLASS,
      NATIVE_INPUT_EDGE_WIDTH_CLASS,
      NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
    ]) {
      expect(Object.keys(map).sort()).toEqual([...TREATMENTS].sort());
    }
  });

  it("describe every colour role a field can be focused with", () => {
    expect(Object.keys(NATIVE_INPUT_EDGE_ACCENT_CLASS).sort()).toEqual(
      [...COLOURS].sort(),
    );
  });

  it("answer for every treatment and density the cascade can hand them", () => {
    for (const treatment of TREATMENTS) {
      expect(NATIVE_INPUT_VARIANT_CLASS[treatment].length).toBeGreaterThan(0);
      expect(NATIVE_INPUT_EDGE_WIDTH_CLASS[treatment].length).toBeGreaterThan(
        0,
      );
    }

    for (const colour of COLOURS) {
      expect(NATIVE_INPUT_EDGE_ACCENT_CLASS[colour].length).toBeGreaterThan(0);
    }

    for (const density of DENSITIES) {
      expect(NATIVE_INPUT_SIZE_CLASS[density].length).toBeGreaterThan(0);
    }
  });

  it("states a touch-sized minimum rather than a height, whichever density it is", () => {
    for (const density of DENSITIES) {
      expect(NATIVE_INPUT_SIZE_CLASS[density]).toContain("min-h-[");
    }
  });

  it("draws the one edge an underlined field has", () => {
    expect(NATIVE_INPUT_EDGE_WIDTH_CLASS.underlined).toBe("border-b");

    for (const treatment of TREATMENTS) {
      if (treatment !== "underlined") {
        expect(NATIVE_INPUT_EDGE_WIDTH_CLASS[treatment]).toBe("border");
      }
    }
  });

  it("leaves the treatments with no edge at rest without one", () => {
    for (const treatment of ["solid", "faded", "ghost"] as Variant[]) {
      expect(NATIVE_INPUT_EDGE_NEUTRAL_CLASS[treatment]).toBe("");
    }

    for (const treatment of ["bordered", "underlined"] as Variant[]) {
      expect(NATIVE_INPUT_EDGE_NEUTRAL_CLASS[treatment]).toContain("border-");
    }
  });

  it("states the same danger edge the field family's failed status states", () => {
    expect(FIELD_STATUS_BORDER_CLASS.error).toContain(
      NATIVE_INPUT_EDGE_INVALID_CLASS,
    );
  });

  it("holds the classes the field shows for its own states", () => {
    for (const value of [
      NATIVE_INPUT_BASE_CLASS,
      NATIVE_INPUT_DISABLED_CLASS,
      NATIVE_INPUT_EDGE_INVALID_CLASS,
      NATIVE_INPUT_MULTILINE_CLASS,
    ]) {
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
