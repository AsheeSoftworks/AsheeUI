import { describe, expect, it } from "vitest";
import type { Color, Variant } from "./variant";
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
});
