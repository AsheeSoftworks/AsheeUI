import { describe, expect, it } from "vitest";
import { resolveConfigCascade } from "./resolve-token";

/**
 * Tests for {@link resolveConfigCascade}, the helper the layout and pattern
 * components resolve their whole configuration with.
 */
describe("resolveConfigCascade", () => {
  type Options = {
    align?: string;
    spacing?: string;
    contained?: boolean;
  };

  const fallback: Required<Options> = {
    align: "start",
    spacing: "md",
    contained: true,
  };

  it("prefers the instance value over every other tier", () => {
    const resolved = resolveConfigCascade<Options, Required<Options>>(
      { align: "center" },
      { align: "start", spacing: "lg" },
      fallback,
    );

    expect(resolved).toEqual({
      align: "center",
      spacing: "lg",
      contained: true,
    });
  });

  it("falls back to the component section, then to the hard fallback", () => {
    const resolved = resolveConfigCascade<Options, Required<Options>>(
      {},
      undefined,
      fallback,
    );

    expect(resolved).toEqual(fallback);
  });

  it("keeps an explicit false, which is a decision rather than an absence", () => {
    const resolved = resolveConfigCascade<Options, Required<Options>>(
      { contained: false },
      { contained: true },
      fallback,
    );

    expect(resolved.contained).toBe(false);
  });

  it("resolves only the keys the fallback declares", () => {
    // A stray key, which is what a typo in configuration looks like, never
    // reaches the resolved options: the fallback defines the shape.
    const misconfigured = { containd: true } as Partial<Options>;
    const resolved = resolveConfigCascade<Options, Required<Options>>(
      misconfigured,
      undefined,
      fallback,
    );

    expect(resolved).toEqual(fallback);
    expect("containd" in resolved).toBe(false);
  });
});
