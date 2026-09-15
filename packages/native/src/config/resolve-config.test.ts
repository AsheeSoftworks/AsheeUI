/**
 * Tests for the native configuration resolution.
 *
 * Two properties matter. The platform defaults resolve a consumer's configuration
 * into what components read, which is the rule both platforms share. And the
 * registered defaults of the components this package ships are merged in, which is
 * what makes a component work out of the box rather than only once a consumer
 * configures it.
 */

import { getNativeComponentDefaults } from "./registry";
import { NATIVE_FALLBACK_CONFIG, resolveNativeConfig } from "./resolve-config";
// Importing the package's surface is what registers every component's defaults.
import "../index";

describe("native configuration resolution", () => {
  it("resolves the platform defaults when a consumer provides none", () => {
    const config = resolveNativeConfig();

    expect(config.defaultVariant).toBe(NATIVE_FALLBACK_CONFIG.defaultVariant);
    expect(config.defaultColor).toBe(NATIVE_FALLBACK_CONFIG.defaultColor);
    expect(config.defaultSize).toBe(NATIVE_FALLBACK_CONFIG.defaultSize);
    expect(config.defaultRadius).toBe(NATIVE_FALLBACK_CONFIG.defaultRadius);
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
});
