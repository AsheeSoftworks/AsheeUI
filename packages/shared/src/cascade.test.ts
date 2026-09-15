/**
 * Tests for the shared cascade.
 *
 * The cascade is the one rule both platforms must agree on, so the tests state the
 * precedence and the edge cases that differ between a value being absent and a value
 * being deliberately false.
 */

import { describe, expect, it } from "vitest";
import { resolveCascade, resolveConfigCascade } from "./cascade";

describe("resolveCascade", () => {
  it("prefers the instance value, then the section, then the global default", () => {
    expect(resolveCascade("ghost", "solid", "faded", "bordered")).toBe("ghost");
    expect(resolveCascade(undefined, "solid", "faded", "bordered")).toBe(
      "solid",
    );
    expect(resolveCascade(undefined, undefined, "faded", "bordered")).toBe(
      "faded",
    );
    expect(resolveCascade(undefined, undefined, undefined, "bordered")).toBe(
      "bordered",
    );
  });

  it("treats false as a decision rather than an absence", () => {
    expect(resolveCascade(false, true, true, true)).toBe(false);
    expect(resolveCascade(0, 4, 4, 4)).toBe(0);
    expect(resolveCascade("", "md", "md", "md")).toBe("");
  });
});

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

  it("resolves every key of the fallback in one call", () => {
    const resolved = resolveConfigCascade<Options, Required<Options>>(
      { align: "center" },
      { spacing: "lg" },
      fallback,
    );

    expect(resolved).toEqual({
      align: "center",
      spacing: "lg",
      contained: true,
    });
  });

  it("keeps an explicit false from the instance over a true section value", () => {
    const resolved = resolveConfigCascade<Options, Required<Options>>(
      { contained: false },
      { contained: true },
      fallback,
    );

    expect(resolved.contained).toBe(false);
  });

  it("ignores a key the fallback does not declare", () => {
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
