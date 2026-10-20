import { describe, expect, it } from "vitest";
import { defaultColorConfig, type ExternalColorConfig } from "../theme";
import { resolveColorConfig } from "./resolve-color";

describe("resolveColorConfig", () => {
  it("merges a consumer's override of a built-in theme over its defaults", () => {
    const result = resolveColorConfig(defaultColorConfig, {
      dark: { primary: "#123456" },
    });

    expect(result.dark.primary).toBe("#123456");
    expect(result.dark.background).toBe(defaultColorConfig.dark.background);
  });

  it("bases a custom theme on the theme it extends", () => {
    const result = resolveColorConfig(defaultColorConfig, {
      brand: { extends: "dark", primary: "#8b5cf6" },
    });

    expect(result.brand?.primary).toBe("#8b5cf6");
    expect(result.brand?.background).toBe(defaultColorConfig.dark.background);
  });

  it("inherits the consumer's overrides of the theme it extends", () => {
    const result = resolveColorConfig(defaultColorConfig, {
      dark: { background: "#010101" },
      brand: { extends: "dark" },
    });

    expect(result.brand?.background).toBe("#010101");
  });

  it("uses the given inheritance when a custom theme states no extends", () => {
    const result = resolveColorConfig(
      defaultColorConfig,
      { brand: { primary: "#8b5cf6" } },
      "dark",
    );

    expect(result.brand?.background).toBe(defaultColorConfig.dark.background);
  });

  it("falls back to light when neither extends nor an inheritance is given", () => {
    const result = resolveColorConfig(defaultColorConfig, {
      brand: { primary: "#8b5cf6" },
    });

    expect(result.brand?.background).toBe(defaultColorConfig.light.background);
  });

  it("keeps the built-in themes when no configuration is given", () => {
    const result = resolveColorConfig(defaultColorConfig);

    expect(result.light).toEqual(defaultColorConfig.light);
    expect(result.dark).toEqual(defaultColorConfig.dark);
  });

  describe("a custom theme that extends another custom theme", () => {
    it("accepts a typed configuration that names another declared custom theme", () => {
      // `extends` is typed as `ThemeName`, so this literal compiles without a cast. That
      // `midnight` is declared is a runtime fact the validator checks and the resolver uses.
      const config: ExternalColorConfig = {
        brand: { extends: "midnight", primary: "#8b5cf6" },
        midnight: { extends: "dark", background: "#0b0b12" },
      };

      const result = resolveColorConfig(defaultColorConfig, config);

      expect(result.brand?.background).toBe("#0b0b12");
      expect(result.brand?.primary).toBe("#8b5cf6");
      expect(result.brand?.success).toBe(defaultColorConfig.dark.success);
    });

    it("inherits a base declared later in the same colour object", () => {
      // `brand` names `midnight` before `midnight` is declared. Resolving in insertion
      // order read a partly filled result and fell through to the library's light palette,
      // so the forward reference is resolved rather than skipped.
      const result = resolveColorConfig(defaultColorConfig, {
        brand: { extends: "midnight", primary: "#8b5cf6" },
        midnight: { extends: "dark", background: "#0b0b12" },
      });

      expect(result.brand?.background).toBe("#0b0b12");
      expect(result.brand?.primary).toBe("#8b5cf6");
      // Inherited through the chain: `brand` → `midnight` → `dark`.
      expect(result.brand?.success).toBe(defaultColorConfig.dark.success);
    });

    it("reaches the consumer's override of the built-in theme at the end of the chain", () => {
      const result = resolveColorConfig(defaultColorConfig, {
        brand: { extends: "midnight" },
        midnight: { extends: "dark" },
        dark: { success: "#00ff00" },
      });

      expect(result.brand?.success).toBe("#00ff00");
    });

    it("resolves a forward reference in a chain three themes long", () => {
      const result = resolveColorConfig(defaultColorConfig, {
        a: { extends: "b", primary: "#000001" },
        b: { extends: "c", secondary: "#000002" },
        c: { extends: "dark", background: "#000003" },
      });

      expect(result.a?.background).toBe("#000003");
      expect(result.a?.secondary).toBe("#000002");
      expect(result.a?.primary).toBe("#000001");
    });

    it("keeps custom themes in the order they were declared", () => {
      const result = resolveColorConfig(defaultColorConfig, {
        brand: { extends: "midnight" },
        midnight: { extends: "dark" },
        accent: { extends: "light" },
      });

      expect(Object.keys(result)).toEqual([
        "light",
        "dark",
        "brand",
        "midnight",
        "accent",
      ]);
    });

    it("terminates when two themes extend each other", () => {
      // There is no base under a circle, so each theme in it starts from the application's
      // default family rather than the resolver recursing until the stack runs out.
      const result = resolveColorConfig(defaultColorConfig, {
        a: { extends: "b", primary: "#000001" },
        b: { extends: "a", secondary: "#000002" },
      });

      expect(result.a?.primary).toBe("#000001");
      expect(result.a?.background).toBe(defaultColorConfig.light.background);
      expect(result.b?.secondary).toBe("#000002");
    });

    it("terminates when a theme extends itself", () => {
      const result = resolveColorConfig(defaultColorConfig, {
        brand: { extends: "brand", primary: "#8b5cf6" },
      });

      expect(result.brand?.primary).toBe("#8b5cf6");
      expect(result.brand?.background).toBe(
        defaultColorConfig.light.background,
      );
    });
  });
});
