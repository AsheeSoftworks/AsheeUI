import { validateRuntimeThemes } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import { THEME_PRESETS } from "./presets";

describe("THEME_PRESETS", () => {
  it("has a unique slug for every preset", () => {
    const slugs = THEME_PRESETS.map((preset) => preset.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("is valid runtime input without further work", () => {
    for (const preset of THEME_PRESETS) {
      const issues = validateRuntimeThemes({
        [preset.slug]: preset.definition,
      });
      expect(issues, preset.name).toEqual([]);
    }
  });
});
