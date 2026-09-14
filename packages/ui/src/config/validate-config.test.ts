import { describe, expect, it, vi } from "vitest";
import {
  TYPOGRAPHY_ROLE_TOKEN,
  TYPOGRAPHY_SIZE_CLASS,
  TYPOGRAPHY_TONE_CLASS,
  type TypographySize,
  type TypographyTone,
} from "../shared";
import type { ExternalConfig } from "./config";
import { assertValidConfig, validateConfig } from "./validate-config";

/** Options are typed, so invalid values need an escape hatch in tests. */
function asConfig(value: unknown): ExternalConfig {
  return value as ExternalConfig;
}

const errorPaths = (config: unknown): string[] =>
  validateConfig(asConfig(config))
    .filter((issue) => issue.severity === "error")
    .map((issue) => issue.path);

const warningPaths = (config: unknown): string[] =>
  validateConfig(asConfig(config))
    .filter((issue) => issue.severity === "warning")
    .map((issue) => issue.path);

type TypographyRole = keyof typeof TYPOGRAPHY_ROLE_TOKEN;

const ROLE = Object.keys(TYPOGRAPHY_ROLE_TOKEN)[0] as TypographyRole;
const TONE = Object.keys(TYPOGRAPHY_TONE_CLASS)[0] as TypographyTone;
const SIZE = Object.keys(TYPOGRAPHY_SIZE_CLASS)[0] as TypographySize;

describe("validateConfig", () => {
  it("accepts an empty configuration", () => {
    expect(validateConfig({})).toEqual([]);
  });

  it("accepts valid global values and typography overrides", () => {
    expect(
      validateConfig({
        defaultTheme: "dark",
        defaultVariant: "ghost",
        defaultColor: "primary",
        defaultRadius: "lg",
        components: {
          typography: {
            role: ROLE,
            tone: TONE,
            align: "center",
            truncate: true,
            roles: { [ROLE]: { size: SIZE, weight: "medium" } },
          },
        },
      }),
    ).toEqual([]);
  });

  it("accepts a custom theme and the themes it adds", () => {
    expect(
      validateConfig(
        asConfig({
          defaultTheme: "brand",
          color: { brand: { background: "#ffffff" } },
        }),
      ),
    ).toEqual([]);
  });

  it("warns about unknown keys instead of failing", () => {
    expect(warningPaths({ bogus: true })).toEqual(["bogus"]);
    expect(
      warningPaths({ components: { typography: { nonsense: 1 } } }),
    ).toEqual(["components.typography.nonsense"]);
    expect(warningPaths({ color: { light: { brandy: "#fff" } } })).toEqual([
      "color.light.brandy",
    ]);
  });

  it("errors on invalid global values", () => {
    expect(
      errorPaths({
        defaultTheme: "nope",
        defaultVariant: "primry",
        defaultColor: "royal",
        defaultRadius: "round",
      }),
    ).toEqual([
      "defaultTheme",
      "defaultVariant",
      "defaultColor",
      "defaultRadius",
    ]);
  });

  it("errors on invalid component values", () => {
    expect(
      errorPaths({
        components: {
          button: { className: 7 },
          typography: { role: "nope", truncate: "yes" },
        },
      }),
    ).toEqual([
      "components.button.className",
      "components.typography.role",
      "components.typography.truncate",
    ]);
  });

  it("accepts per-component option values the framework cannot enumerate", () => {
    // The accordion's `separated` variant is valid for that component even
    // though it is not part of the shared `Variant` union.
    expect(
      validateConfig({
        components: { accordion: { variant: "separated", size: "md" } },
      }),
    ).toEqual([]);
  });

  it("errors on invalid typography role overrides and warns on unknown roles", () => {
    expect(
      errorPaths({
        components: {
          typography: { roles: { [ROLE]: { size: "huge" } } },
        },
      }),
    ).toEqual([`components.typography.roles.${ROLE}.size`]);

    expect(
      warningPaths({
        components: {
          typography: { roles: { nonsense: { size: SIZE } } },
        },
      }),
    ).toEqual(["components.typography.roles.nonsense"]);
  });

  it("errors when a section has the wrong shape", () => {
    expect(errorPaths(asConfig({ color: "dark" }))).toEqual(["color"]);
    expect(errorPaths(asConfig({ components: [] }))).toEqual(["components"]);
    expect(errorPaths({ color: { light: { background: 5 } } })).toEqual([
      "color.light.background",
    ]);
  });
});

describe("assertValidConfig", () => {
  it("throws one error listing every invalid value", () => {
    expect(() =>
      assertValidConfig(
        asConfig({ defaultVariant: "primry", defaultRadius: "round" }),
      ),
    ).toThrowError(
      /defaultVariant: "primry" is not a valid value[\s\S]*defaultRadius: "round" is not a valid value/,
    );
  });

  it("warns in development for unknown keys", () => {
    const warn = vi.fn();

    assertValidConfig(asConfig({ bogus: true }), { warn });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("[asheeui] bogus: unknown key");
  });

  it("stays silent about warnings in production and still throws for errors", () => {
    vi.stubEnv("NODE_ENV", "production");
    try {
      const warn = vi.fn();

      assertValidConfig(asConfig({ bogus: true }), { warn });
      expect(warn).not.toHaveBeenCalled();

      expect(() => assertValidConfig(asConfig({ defaultColor: "royal" }))).toThrow(
        Error,
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
