import { describe, expect, it } from "vitest";
import { defaultColorConfig, type ExternalColorConfig } from "../theme";
import { resolveColorConfig } from "./resolve-color";

/** A custom theme name is not in the colour registry, so the map is cast here. */
function external(value: unknown): ExternalColorConfig {
  return value as ExternalColorConfig;
}

describe("resolveColorConfig", () => {
  it("merges a consumer's override of a built-in theme over its defaults", () => {
    const result = resolveColorConfig(defaultColorConfig, {
      dark: { primary: "#123456" },
    });

    expect(result.dark.primary).toBe("#123456");
    expect(result.dark.background).toBe(defaultColorConfig.dark.background);
  });

  it("bases a custom theme on the theme it extends", () => {
    const result = resolveColorConfig(
      defaultColorConfig,
      external({ brand: { extends: "dark", primary: "#8b5cf6" } }),
    );

    expect(result.brand.primary).toBe("#8b5cf6");
    expect(result.brand.background).toBe(defaultColorConfig.dark.background);
  });

  it("inherits the consumer's overrides of the theme it extends", () => {
    const result = resolveColorConfig(
      defaultColorConfig,
      external({
        dark: { background: "#010101" },
        brand: { extends: "dark" },
      }),
    );

    expect(result.brand.background).toBe("#010101");
  });

  it("uses the given inheritance when a custom theme states no extends", () => {
    const result = resolveColorConfig(
      defaultColorConfig,
      external({ brand: { primary: "#8b5cf6" } }),
      "dark",
    );

    expect(result.brand.background).toBe(defaultColorConfig.dark.background);
  });

  it("falls back to light when neither extends nor an inheritance is given", () => {
    const result = resolveColorConfig(
      defaultColorConfig,
      external({ brand: { primary: "#8b5cf6" } }),
    );

    expect(result.brand.background).toBe(defaultColorConfig.light.background);
  });

  it("keeps the built-in themes when no configuration is given", () => {
    const result = resolveColorConfig(defaultColorConfig);

    expect(result.light).toEqual(defaultColorConfig.light);
    expect(result.dark).toEqual(defaultColorConfig.dark);
  });
});
