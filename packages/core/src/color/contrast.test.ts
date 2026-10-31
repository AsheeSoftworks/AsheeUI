import { describe, expect, it } from "vitest";
import {
  CONTRAST_AA,
  CONTRAST_AAA,
  contrastLevel,
  contrastRatio,
  relativeLuminance,
} from "./contrast";

describe("contrastRatio", () => {
  it("is 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 5);
  });

  it("is 1 for a colour on itself", () => {
    expect(contrastRatio("#047857", "#047857")).toBeCloseTo(1, 5);
  });

  it("uses luminance rather than channel order", () => {
    expect(contrastRatio("#ffffff", "#777777")).toBeLessThan(
      contrastRatio("#ffffff", "#000000") ?? 0,
    );
  });

  it("returns undefined for a non-portable value", () => {
    expect(contrastRatio("oklch(0.7 0.1 150)", "#ffffff")).toBeUndefined();
  });
});

describe("relativeLuminance", () => {
  it("maps black to 0 and white to 1", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
  });
});

describe("contrastLevel", () => {
  it("classifies at the AA and AAA thresholds", () => {
    expect(contrastLevel(CONTRAST_AA)).toBe("AA");
    expect(contrastLevel(CONTRAST_AAA)).toBe("AAA");
    expect(contrastLevel(CONTRAST_AA - 0.01)).toBe("fail");
  });
});
