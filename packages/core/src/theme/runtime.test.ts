/**
 * The runtime-theme merge: the one place a provider's extra palettes are folded into the
 * configuration before resolution.
 *
 * The merge is deliberately trivial, so the tests are about the precedence it promises rather
 * than about the implementation: runtime overrides configured, the configured defaults survive,
 * and a native configuration keeps its platform-only fields.
 */

import { describe, expect, it } from "vitest";
import type { ExternalConfig } from "../config/config";
import { resolveConfig } from "../config/resolve-config";
import { mergeRuntimeThemes } from "./runtime";

describe("mergeRuntimeThemes", () => {
  it("returns the configuration unchanged when no runtime themes are given", () => {
    const config = { defaultTheme: "dark" as const };
    expect(mergeRuntimeThemes(config, undefined)).toBe(config);
  });

  it("merges runtime themes over the configured ones", () => {
    const merged = mergeRuntimeThemes(
      {
        color: {
          midnight: { extends: "dark", primary: "#111111" },
        },
      },
      {
        midnight: { extends: "dark", primary: "#222222" },
        ocean: { extends: "dark", primary: "#0ea5e9" },
      },
    );

    expect(merged.color?.midnight).toEqual({ extends: "dark", primary: "#222222" });
    expect(merged.color?.ocean).toEqual({ extends: "dark", primary: "#0ea5e9" });
  });

  it("keeps a native configuration's platform-only fields", () => {
    interface NativeLike extends ExternalConfig {
      defaultSize?: "lg";
    }

    const merged = mergeRuntimeThemes<NativeLike>(
      { defaultSize: "lg" },
      { ocean: { extends: "dark" } },
    );

    expect(merged.defaultSize).toBe("lg");
  });

  it("resolves a runtime theme that extends another runtime theme", () => {
    const merged = mergeRuntimeThemes(undefined, {
      base: { extends: "dark", background: "#0b0b12" },
      accent: { extends: "base", primary: "#8b5cf6" },
    });

    const resolved = resolveConfig(merged);

    expect(resolved.color.accent).toMatchObject({
      background: "#0b0b12",
      primary: "#8b5cf6",
    });
  });

  it("resolves a runtime theme over a configured theme it extends", () => {
    const merged = mergeRuntimeThemes(
      { color: { midnight: { extends: "dark", background: "#101010" } } },
      { ocean: { extends: "midnight", primary: "#0ea5e9" } },
    );

    const resolved = resolveConfig(merged);

    expect(resolved.color.ocean).toMatchObject({
      background: "#101010",
      primary: "#0ea5e9",
    });
  });

  it("rejects a name that is not safe as a CSS class", () => {
    expect(() =>
      mergeRuntimeThemes(undefined, {
        "my theme": { extends: "dark" },
      } as never),
    ).toThrow(/not a valid name/);
  });

  it("rejects a colour a device cannot apply", () => {
    expect(() =>
      mergeRuntimeThemes(undefined, {
        ocean: { extends: "dark", primary: "oklch(0.7 0.2 240)" } as never,
      }),
    ).toThrow(/a device cannot apply/);
  });

  it("rejects an extends target nothing declares", () => {
    expect(() =>
      mergeRuntimeThemes(undefined, {
        ocean: { extends: "missing" },
      }),
    ).toThrow(/extends "missing"/);
  });

  it("rejects a runtime definition of a built-in theme", () => {
    expect(() =>
      mergeRuntimeThemes(undefined, {
        light: { primary: "#000000" },
      } as never),
    ).toThrow(/built-in theme/);
  });

  it("rejects the reserved system name", () => {
    expect(() =>
      mergeRuntimeThemes(undefined, {
        system: { extends: "dark" },
      } as never),
    ).toThrow(/follows the platform/);
  });
});
