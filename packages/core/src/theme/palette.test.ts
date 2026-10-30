/**
 * Tests for the theme choice.
 *
 * A theme is chosen the same way on both renderers, so this module — one of the four pieces of
 * the palette model that stayed in core — is tested here. "system" is the platform's own
 * scheme, and a name no palette answers is a mistake rather than a fallback: a typo that
 * painted light would look like a theme that stopped working.
 */

import { describe, expect, it } from "vitest";
import { defaultColorConfig } from "./color";
import { selectTheme } from "./palette";

describe("selectTheme", () => {
  const palettes = {
    ...defaultColorConfig,
    midnight: { ...defaultColorConfig.dark, primary: "#7c3aed" },
  };

  it("follows the platform's scheme when the configuration says system or nothing", () => {
    expect(selectTheme(palettes, "system", "dark").name).toBe("dark");
    expect(selectTheme(palettes, undefined, "light").name).toBe("light");
    expect(selectTheme(palettes, "system", "light").palette).toBe(
      defaultColorConfig.light,
    );
  });

  it("paints a theme the configuration names", () => {
    const selected = selectTheme(palettes, "midnight", "light");

    expect(selected.name).toBe("midnight");
    expect(selected.palette.primary).toBe("#7c3aed");
  });

  it("refuses a name no palette answers, and says which exist", () => {
    expect(() => selectTheme(palettes, "midnite", "light")).toThrow(
      /"midnite".*light, dark, midnight/s,
    );
  });
});
