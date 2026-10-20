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

import { defaultConfig } from "@asheeui/core";
import { getNativeComponentDefaults } from "./registry";
import { NATIVE_FALLBACK_CONFIG, resolveNativeConfig } from "./resolve-config";
// Importing the package's surface is what registers every component's defaults.
import "..";

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
