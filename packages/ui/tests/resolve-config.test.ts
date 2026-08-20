import { describe, expect, it, vi } from "vitest";

async function loadResolver() {
  vi.resetModules();
  // Side-effect: self-registers the button component defaults
  await import("../src/components/button/button-config.js");
  const { resolveConfig } = await import("../src/config/resolve-config.js");
  return { resolveConfig };
}

describe("resolveConfig", () => {
  it("includes registered default component configs when given an empty config", async () => {
    const { resolveConfig } = await loadResolver();

    const resolved = resolveConfig({});

    expect(resolved.components?.button).toBeDefined();
    expect(resolved.components?.button).toMatchObject({ size: "md" });
    expect(resolved.theme.defaultColor).toBe("primary");
  });

  it("user overrides win while non-overridden properties are retained", async () => {
    const { resolveConfig } = await loadResolver();

    const resolved = resolveConfig({
      components: { button: { size: "lg" } },
    } as never);

    const button = resolved.components?.button as {
      size?: string;
      radius?: string;
    };
    expect(button?.size).toBe("lg"); // overridden
    expect(button?.radius).toBe("md"); // retained from registration
  });

  it("merges theme tokens (colors, spacing, radius) with defaults", async () => {
    const { resolveConfig } = await loadResolver();

    const resolved = resolveConfig({
      theme: {
        color: { primary: "#123456" },
        radius: { default: "rounded-full" },
        spacing: { sm: "0.75rem" },
      },
    } as never);

    // The merged runtime tokens are not declared on the concrete config types,
    // so inspect them through a permissive view.
    const theme = resolved.theme as unknown as {
      color: Record<string, string | undefined>;
      radius: Record<string, string | undefined>;
      spacing: Record<string, string | undefined>;
      defaultVariant: string;
    };

    expect(theme.color["primary"]).toBe("#123456");
    expect(theme.radius["default"]).toBe("rounded-full");
    expect(theme.spacing["sm"]).toBe("0.75rem");
    // Unrelated tokens untouched
    expect(theme.defaultVariant).toBe("solid");
  });
});
