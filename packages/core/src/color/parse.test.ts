import { describe, expect, it } from "vitest";
import { isPortableColor, normalizeColor, parseColor } from "./parse";

describe("parseColor", () => {
  it("reads the hex forms a palette states", () => {
    expect(parseColor("#047857")).toEqual({ r: 4, g: 120, b: 87 });
    expect(parseColor("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseColor("#FFF")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("drops alpha, because a role is opaque", () => {
    expect(parseColor("#04785780")).toEqual({ r: 4, g: 120, b: 87 });
    expect(parseColor("#f008")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("reads rgb() and rgba() in either separator style", () => {
    expect(parseColor("rgb(4, 120, 87)")).toEqual({ r: 4, g: 120, b: 87 });
    expect(parseColor("rgb(4 120 87)")).toEqual({ r: 4, g: 120, b: 87 });
    expect(parseColor("rgba(4, 120, 87, 0.5)")).toEqual({
      r: 4,
      g: 120,
      b: 87,
    });
  });

  it("reads percentages as channels", () => {
    expect(parseColor("rgb(0%, 50%, 100%)")).toEqual({
      r: 0,
      g: 128,
      b: 255,
    });
  });

  it("clamps a channel into range, the way CSS does", () => {
    expect(parseColor("rgb(300 120 87)")).toEqual({ r: 255, g: 120, b: 87 });
    expect(parseColor("rgb(-10 0 0)")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("refuses a value outside the portable set", () => {
    expect(parseColor("var(--brand)")).toBeUndefined();
    expect(parseColor("oklch(0.7 0.1 150)")).toBeUndefined();
    expect(parseColor("currentColor")).toBeUndefined();
    expect(parseColor("")).toBeUndefined();
    expect(parseColor("rgb(4 120)")).toBeUndefined();
  });
});

describe("isPortableColor", () => {
  it("accepts the forms both renderers apply", () => {
    expect(isPortableColor("#047857")).toBe(true);
    expect(isPortableColor("rgb(4 120 87)")).toBe(true);
  });

  it("rejects a browser-only value", () => {
    expect(isPortableColor("oklch(0.7 0.1 150)")).toBe(false);
    expect(isPortableColor(null)).toBe(false);
  });
});

describe("normalizeColor", () => {
  it("canonicalises a portable colour to lowercase #rrggbb", () => {
    expect(normalizeColor("#FFF")).toBe("#ffffff");
    expect(normalizeColor("rgb(4, 120, 87)")).toBe("#047857");
    expect(normalizeColor("rgba(4, 120, 87, 0.5)")).toBe("#047857");
  });

  it("returns undefined for a non-portable value", () => {
    expect(normalizeColor("red")).toBeUndefined();
  });
});
