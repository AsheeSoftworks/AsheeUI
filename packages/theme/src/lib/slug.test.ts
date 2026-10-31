import { describe, expect, it } from "vitest";
import { isReservedThemeName, slugify } from "./slug";

describe("slugify", () => {
  it("turns a display name into a runtime slug", () => {
    expect(slugify("Coastal blue")).toBe("coastal-blue");
    expect(slugify("  Ocean  ")).toBe("ocean");
    expect(slugify("Brand / 2026")).toBe("brand-2026");
  });

  it("prefixes a digit and truncates", () => {
    expect(slugify("2026")).toBe("t-2026");
    expect(slugify("a".repeat(80))).toHaveLength(64);
  });

  it("returns empty when there is nothing usable", () => {
    expect(slugify("   ")).toBe("");
    expect(slugify("!!!")).toBe("");
  });
});

describe("isReservedThemeName", () => {
  it("reserves the built-ins and system", () => {
    expect(isReservedThemeName("light")).toBe(true);
    expect(isReservedThemeName("dark")).toBe(true);
    expect(isReservedThemeName("system")).toBe(true);
    expect(isReservedThemeName("ocean")).toBe(false);
  });
});
