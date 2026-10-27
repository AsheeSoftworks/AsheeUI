/**
 * Tests for the palette reader.
 *
 * A device reads a theme as channels, so these tests state what a palette value has to be
 * for the platform to paint it, and what happens when it is not: a role that cannot be read
 * is an error naming the role and the accepted forms, never a surface that silently paints
 * nothing. The theme selection is tested with the same intent — "system" is the platform's
 * scheme, and a name no palette answers is a mistake rather than a fallback.
 */

import { describe, expect, it } from "vitest";
import { defaultColorConfig } from "./color";
import {
  colorChannels,
  PALETTE_ROLES,
  paletteVariables,
  selectTheme,
} from "./palette";

describe("colorChannels", () => {
  it("reads the hex forms a palette states", () => {
    expect(colorChannels("#047857")).toBe("4 120 87");
    expect(colorChannels("#ffffff")).toBe("255 255 255");
    expect(colorChannels("#FFF")).toBe("255 255 255");
  });

  it("drops the alpha, because the class carries its own", () => {
    expect(colorChannels("#04785780")).toBe("4 120 87");
    expect(colorChannels("#f008")).toBe("255 0 0");
  });

  it("reads rgb() and rgba() in either separator style", () => {
    expect(colorChannels("rgb(4, 120, 87)")).toBe("4 120 87");
    expect(colorChannels("rgb(4 120 87)")).toBe("4 120 87");
    expect(colorChannels("rgba(4, 120, 87, 0.5)")).toBe("4 120 87");
  });

  it("reads percentages as channels", () => {
    expect(colorChannels("rgb(0%, 50%, 100%)")).toBe("0 128 255");
  });

  it("refuses a value it cannot express", () => {
    expect(colorChannels("var(--brand)")).toBeUndefined();
    expect(colorChannels("oklch(0.7 0.1 150)")).toBeUndefined();
    expect(colorChannels("currentColor")).toBeUndefined();
    expect(colorChannels("")).toBeUndefined();
  });

  it("clamps a channel into range, the way CSS does", () => {
    expect(colorChannels("rgb(4 120 87)")).toBe("4 120 87");
    expect(colorChannels("rgb(300 120 87)")).toBe("255 120 87");
    expect(colorChannels("rgb(-10 0 0)")).toBe("0 0 0");
  });
});

describe("paletteVariables", () => {
  it("states one custom property per role, as channels", () => {
    const variables = paletteVariables(defaultColorConfig.light);

    expect(Object.keys(variables).sort()).toEqual(
      PALETTE_ROLES.map((role) => `--ashee-${role}`).sort(),
    );
    expect(variables["--ashee-background"]).toBe("255 255 255");
    expect(variables["--ashee-primary"]).toBe("37 99 235");
  });

  it("paints a custom palette", () => {
    const variables = paletteVariables({
      ...defaultColorConfig.light,
      background: "#0A1410",
      primary: "#047857",
    });

    expect(variables["--ashee-background"]).toBe("10 20 16");
    expect(variables["--ashee-primary"]).toBe("4 120 87");
  });

  it("names the role it cannot read instead of painting nothing", () => {
    expect(() =>
      paletteVariables({
        ...defaultColorConfig.light,
        primary: "var(--brand)",
      }),
    ).toThrow(/"primary".*var\(--brand\)/s);
  });
});

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
