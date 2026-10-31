/**
 * Tests for the palette reader.
 *
 * A device reads a theme as channels, so these tests state what a palette value has to be for
 * the platform to paint it, and what happens when it is not: a role that cannot be read is an
 * error naming the role and the accepted forms, never a surface that silently paints nothing.
 * They moved out of `@asheeui/core` in C1 with the conversion they test; `selectTheme` stayed
 * there and is tested beside it.
 */

import {
  defaultColorConfig,
  ON_SOLID_CHANNELS,
  PALETTE_ROLES,
} from "@asheeui/core";
import { colorChannels, paletteVariables } from "./palette";

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
  it("states one custom property per role, as channels, plus the shared on-solid token", () => {
    const variables = paletteVariables(defaultColorConfig.light);

    expect(Object.keys(variables).sort()).toEqual(
      [
        ...PALETTE_ROLES.map((role) => `--ashee-${role}`),
        "--ashee-on-solid",
      ].sort(),
    );
    expect(variables["--ashee-background"]).toBe("255 255 255");
    expect(variables["--ashee-primary"]).toBe("37 99 235");
    // The ninth token is the same in every theme, and it is the value core states.
    expect(variables["--ashee-on-solid"]).toBe(ON_SOLID_CHANNELS);
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
