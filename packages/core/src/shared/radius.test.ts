import { describe, expect, it } from "vitest";
import type { Radius, Variant } from "./";
import { UnderlineRadius } from "./radius";

const _RADIUS_TOKENS: Radius[] = ["none", "xs", "sm", "md", "lg", "xl", "full"];

describe("RADIUS_CLASS", () => {
  it("forces no radius for the underlined variant", () => {
    expect(UnderlineRadius("underlined", "lg")).toBe("none");
    expect(UnderlineRadius("underlined", "full")).toBe("none");
  });

  it("preserves the requested radius for every other variant", () => {
    const variants: Variant[] = ["solid", "ghost", "bordered", "faded"];

    for (const variant of variants) {
      expect(UnderlineRadius(variant, "lg")).toBe("lg");
      expect(UnderlineRadius(variant, "none")).toBe("none");
    }
  });
});
