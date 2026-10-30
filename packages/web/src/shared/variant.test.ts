// @vitest-environment node

import type { Color, Variant } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import { resolveVariantClass } from "./variant";

const VARIANTS: Variant[] = [
  "solid",
  "ghost",
  "bordered",
  "faded",
  "underlined",
];

const COLORS: Color[] = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
];

/**
 * Raw Tailwind palette utilities, which the framework must never emit because
 * colours resolve through the AsheeUI colour engine (`REQ-047`, `REQ-070`).
 */
const RAW_PALETTE_CLASS =
  /\b(?:bg|text|border|ring|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|grey|zinc|neutral|stone|black|white)-\d{2,3}\b/;

describe("resolveVariantClass", () => {
  it("resolves a static class string for every variant and colour combination", () => {
    for (const variant of VARIANTS) {
      for (const color of COLORS) {
        const classes = resolveVariantClass(variant, color);

        expect(classes.length).toBeGreaterThan(0);
        expect(classes).not.toContain("${");
        expect(classes).not.toContain("undefined");
      }
    }
  });

  it("emits framework colour tokens instead of raw Tailwind palette colours", () => {
    for (const variant of VARIANTS) {
      for (const color of COLORS) {
        expect(resolveVariantClass(variant, color)).not.toMatch(
          RAW_PALETTE_CLASS,
        );
      }
    }
  });

  it("distinguishes variants of the same colour", () => {
    const resolved = VARIANTS.map((variant) =>
      resolveVariantClass(variant, "primary"),
    );

    expect(new Set(resolved).size).toBe(VARIANTS.length);
  });

  it("distinguishes colours within a variant", () => {
    const resolved = COLORS.map((color) => resolveVariantClass("solid", color));

    expect(new Set(resolved).size).toBe(COLORS.length);
  });

  it("falls back to the bordered secondary treatment for an unknown combination", () => {
    const fallback = resolveVariantClass("bordered", "secondary");

    expect(resolveVariantClass("unknown" as Variant, "primary")).toBe(fallback);
    expect(resolveVariantClass("solid", "unknown" as Color)).toBe(fallback);
  });

  it("keeps the underlined variant square", () => {
    expect(resolveVariantClass("underlined", "primary")).toContain(
      "rounded-none",
    );
  });

  // A filled treatment carries its label in the ink that reads against the fill, and the quieter treatments
  // carry their colour in the label itself. Stated here because it is what keeps a button-as-link legible on
  // a solid fill, and what keeps a ghost or bordered row from being painted white.
  it("paints the label white on a filled colour, and on nothing else", () => {
    for (const color of [
      "primary",
      "danger",
      "warning",
      "success",
    ] as Color[]) {
      expect(resolveVariantClass("solid", color)).toContain("text-on-solid");
    }

    for (const variant of VARIANTS.filter((other) => other !== "solid")) {
      for (const color of COLORS) {
        expect(resolveVariantClass(variant, color)).not.toContain(
          "text-on-solid",
        );
      }
    }
  });
});
