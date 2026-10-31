/**
 * Tests for the native configuration resolution.
 *
 * Three properties matter. The platform defaults resolve a consumer's configuration
 * into what components read, and they say the same thing the web's global defaults say,
 * which is the rule both platforms share. The registered defaults of the components this
 * package ships are merged in, which is what makes a component work out of the box rather
 * than only once a consumer configures it. And the merge is deep, so a consumer who states
 * one nested key keeps the sibling keys the component registered beside it.
 */

import {
  assertValidConfig,
  type Config,
  defaultConfig,
  type ExternalConfig,
  resolveConfig,
} from "@asheeui/core";
import { getNativeComponentDefaults } from "./registry";
import {
  NATIVE_FALLBACK_CONFIG,
  type NativeExternalConfig,
  resolveNativeConfig,
} from "./resolve-config";
// Importing the package's surface is what registers every component's defaults.
import "..";

/**
 * The one invalid configuration both renderers are tested against.
 *
 * It is a shared object in the sense that matters: the same key, the same wrong value, and the same
 * expected rejection — because both providers call the same `assertValidConfig`.
 */
const INVALID_CONFIG = {
  defaultVariant: "primry",
} as unknown as ExternalConfig;

describe("native configuration resolution", () => {
  it("resolves the platform defaults when a consumer provides none", () => {
    const config = resolveNativeConfig();

    expect(config.defaultVariant).toBe(NATIVE_FALLBACK_CONFIG.defaultVariant);
    expect(config.defaultColor).toBe(NATIVE_FALLBACK_CONFIG.defaultColor);
    expect(config.defaultSize).toBe(NATIVE_FALLBACK_CONFIG.defaultSize);
    expect(config.defaultRadius).toBe(NATIVE_FALLBACK_CONFIG.defaultRadius);
  });

  // `F-89`: native shipped `solid` while the web shipped `faded`, so every component that
  // honours the global tier rendered a different treatment on a device. The global default
  // is one rule for both platforms, and the web's `faded` is the one the docs describe.
  it("states the web's default treatment as its own, so the cascade agrees across platforms", () => {
    expect(NATIVE_FALLBACK_CONFIG.defaultVariant).toBe("faded");
    expect(NATIVE_FALLBACK_CONFIG.defaultVariant).toBe(
      defaultConfig.defaultVariant,
    );
    expect(resolveNativeConfig().defaultVariant).toBe(
      defaultConfig.defaultVariant,
    );
  });

  it("lets a consumer override a platform default", () => {
    const config = resolveNativeConfig({ defaultRadius: "lg" });

    expect(config.defaultRadius).toBe("lg");
    expect(config.defaultColor).toBe(NATIVE_FALLBACK_CONFIG.defaultColor);
  });

  it("registers the defaults of every component the package ships", () => {
    const registered = getNativeComponentDefaults();

    for (const name of ["button", "badge", "card", "text"]) {
      expect(registered).toHaveProperty(name);
    }
  });

  it("merges the registered defaults into what a component reads", () => {
    const config = resolveNativeConfig();

    expect(config.components.card).toMatchObject({ size: "md" });
    expect(config.components.badge).toMatchObject({ variant: "faded" });
  });

  it("lets a consumer's configuration win over a registered default", () => {
    const config = resolveNativeConfig({
      components: { card: { size: "lg" } },
    });

    expect(config.components.card).toMatchObject({ size: "lg" });
  });

  it("resolves a component the registry does not know", () => {
    const config = resolveNativeConfig({
      components: { card: { size: "sm" } },
    });

    expect(config.components.card).toMatchObject({ size: "sm" });
  });

  // `F-188`: the section used to be merged with a shallow spread, so one nested key
  // replaced the registered object it belonged to. `components.sidebar` is the clearest
  // case: the contract says it means the same thing on every platform, and the web
  // deep-merges it.
  it("deep-merges a nested section instead of replacing it", () => {
    const config = resolveNativeConfig({
      components: { sidebar: { options: { active: { variant: "bordered" } } } },
    });
    const sidebar = config.components.sidebar;

    // The stated key wins...
    expect(sidebar?.options?.active?.variant).toBe("bordered");
    // ...and the sibling keys inside the same registered object survive.
    expect(sidebar?.options?.active?.color).toBe("primary");
    expect(sidebar?.options?.inactive).toEqual({ variant: "ghost" });
    // A section beside the one that was partially stated is untouched.
    expect(sidebar?.tooltip).toEqual({ show: true, placement: "right" });
  });

  it("deep-merges without mutating the registered defaults", () => {
    resolveNativeConfig({
      components: { sidebar: { options: { active: { variant: "bordered" } } } },
    });

    const registered = getNativeComponentDefaults().sidebar;

    expect(registered?.options?.active?.variant).toBe("solid");
    expect(registered?.tooltip).toEqual({ show: true, placement: "right" });
  });
});

describe("the shape a shared component reads", () => {
  it("is core's configuration plus the platform's density", () => {
    const config = resolveNativeConfig();

    // Every field the web renderer's resolved configuration carries...
    expect(config).toHaveProperty("color");
    expect(config).toHaveProperty("defaultTheme");
    expect(config.defaultTheme).toBe("system");
    expect(Object.keys(config.color)).toEqual(
      expect.arrayContaining(["light", "dark"]),
    );

    // ...and it is assignable to core's `Config` by construction. The assertion is the compiler's:
    // `asCore` is a type error the day a field is missing or has the wrong type.
    const asCore: Config = config;
    expect(asCore.defaultVariant).toBe(NATIVE_FALLBACK_CONFIG.defaultVariant);
  });

  it("resolves a custom theme's palette, so a component reads filled-in colours", () => {
    const config = resolveNativeConfig({
      color: { midnight: { extends: "dark", primary: "#8b5cf6" } },
    });

    // The declared colour, and the ones it inherits from the theme it extends.
    expect(config.color.midnight?.primary).toBe("#8b5cf6");
    expect(config.color.midnight?.background).toBe(
      config.color.dark.background,
    );
  });

  it("resolves the same palettes as the web renderer, because both call one function", () => {
    // `CORE-MIGRATION-REPORT.md` §5 row 5: the colour resolution is one rule. The web
    // renderer's `resolveConfig` and this package's `resolveNativeConfig` both call core's
    // `resolveColorConfig` with `defaultColorConfig` and the configuration's own theme
    // family, so the palettes a shared component reads are identical — including the base a
    // custom theme with no `extends` inherits, which was the divergence the row recorded.
    const partial = {
      light: { primary: "#047857" },
      midnight: { extends: "dark", primary: "#7c3aed" },
    } as const;

    for (const defaultTheme of [
      "light",
      "dark",
      "system",
      "midnight",
    ] as const) {
      const web = resolveConfig({
        color: partial,
        defaultTheme,
      } as ExternalConfig);
      const native = resolveNativeConfig({ color: partial, defaultTheme });

      expect([defaultTheme, native.color]).toEqual([
        defaultTheme,
        web.color,
      ]);
    }

    // The reference is the same call, so the assertion holding is not a coincidence of two
    // implementations agreeing today.
    expect(resolveConfig({ color: partial }).color).toEqual(
      resolveNativeConfig({ color: partial }).color,
    );
  });
});

describe("configuration validation", () => {
  it("rejects the configuration the web provider rejects, with core's message", () => {
    // Core's `assertValidConfig` is the one validation both providers run; the assertion is that the
    // device raises exactly what it says, so an invalid shared config fails the same way on both.
    let expected = "";
    try {
      assertValidConfig(INVALID_CONFIG);
    } catch (error) {
      expected = (error as Error).message;
    }

    expect(() =>
      resolveNativeConfig(INVALID_CONFIG as NativeExternalConfig),
    ).toThrow(expected);
    expect(expected).toContain("defaultVariant");
  });

  it("does not call the platform's own density an unknown key", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    resolveNativeConfig({ defaultSize: "lg" });

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
