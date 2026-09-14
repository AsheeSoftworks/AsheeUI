import { describe, expect, it } from "vitest";
import { defaultButtonConfig } from "../components/button/button-config";
import { defaultScrollbarConfig } from "../components/scrollbar/scrollbar-config";
import { registerComponentDefaults } from "../libs/registry";
import { defaultConfig } from "./default-config";
import { resolveConfig } from "./resolve-config";

describe("resolveConfig", () => {
  it("applies framework defaults when no configuration is supplied", () => {
    const resolved = resolveConfig({});

    expect(resolved.defaultTheme).toBe(defaultConfig.defaultTheme);
    expect(resolved.defaultVariant).toBe(defaultConfig.defaultVariant);
    expect(resolved.defaultColor).toBe(defaultConfig.defaultColor);
    expect(resolved.defaultRadius).toBe(defaultConfig.defaultRadius);
    expect(resolved.color).toBeDefined();
  });

  it("lets explicit configuration override the global defaults", () => {
    const resolved = resolveConfig({
      defaultTheme: "dark",
      defaultVariant: "ghost",
      defaultColor: "danger",
      defaultRadius: "full",
    });

    expect(resolved.defaultTheme).toBe("dark");
    expect(resolved.defaultVariant).toBe("ghost");
    expect(resolved.defaultColor).toBe("danger");
    expect(resolved.defaultRadius).toBe("full");
  });

  it("merges component defaults registered by component config modules", () => {
    const resolved = resolveConfig({});

    expect(resolved.components?.button).toEqual(defaultButtonConfig);
    expect(resolved.components?.scrollbar).toEqual(defaultScrollbarConfig);
  });

  it("lets explicit component configuration win over registered defaults", () => {
    const resolved = resolveConfig({
      components: { button: { radius: "full" } },
    });

    expect(resolved.components?.button).toMatchObject({ radius: "full" });
    expect(resolved.components?.button).toEqual({
      ...defaultButtonConfig,
      radius: "full",
    });
  });

  it("resolves component defaults at access time so late registration is honoured", () => {
    const resolved = resolveConfig({});

    registerComponentDefaults("scrollbar", {
      ...defaultScrollbarConfig,
      width: "8px",
    });

    expect(resolved.components?.scrollbar?.width).toBe("8px");

    registerComponentDefaults("scrollbar", defaultScrollbarConfig);

    expect(resolved.components?.scrollbar).toEqual(defaultScrollbarConfig);
  });

  it("resolves deterministically for the same input", () => {
    const config = {
      defaultVariant: "ghost" as const,
      components: { button: { radius: "lg" as const } },
    };

    const first = resolveConfig(config);
    const second = resolveConfig(config);

    expect(first.defaultVariant).toBe(second.defaultVariant);
    expect(first.color).toEqual(second.color);
    expect(first.components?.button).toEqual(second.components?.button);
  });

  it("does not mutate the caller's configuration", () => {
    const external = {
      defaultRadius: "lg" as const,
      components: { button: { radius: "full" as const } },
    };

    resolveConfig(external);

    expect(external).toEqual({
      defaultRadius: "lg",
      components: { button: { radius: "full" } },
    });
  });

  it("resolves the confirmed default baseline", () => {
    // Design section 4.2 (`DES-041`) and `REQ-057` confirm the baseline: boxy
    // corners and faded fills, with the built-in colour themes.
    const resolved = resolveConfig({});

    expect(resolved.defaultRadius).toBe("xs");
    expect(resolved.defaultVariant).toBe("faded");
    expect(resolved.defaultColor).toBe("primary");
    expect(resolved.defaultTheme).toBe("system");
  });

  it("lets a global value override the built-in baseline", () => {
    expect(resolveConfig({ defaultRadius: "lg" }).defaultRadius).toBe("lg");
    expect(resolveConfig({ defaultVariant: "solid" }).defaultVariant).toBe(
      "solid",
    );
  });

  it("lets a component key override a global value for that component only", () => {
    const resolved = resolveConfig({
      defaultRadius: "lg",
      components: { button: { radius: "full" } },
    });

    expect(resolved.defaultRadius).toBe("lg");
    expect(resolved.components?.button?.radius).toBe("full");
  });
});
