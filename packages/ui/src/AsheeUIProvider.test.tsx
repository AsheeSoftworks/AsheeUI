/**
 * Provider-level checks for configuration validation (M3, `U-4`).
 *
 * These prove the wiring rather than the rules: the unit rules live in
 * `config/validate-config.test.ts`, and this file shows that the provider
 * applies them while rendering.
 */

import { describe, expect, it, vi } from "vitest";
import type { ExternalConfig } from "./config/config";
import { renderToServerString } from "./test";

/** Test helper: invalid configurations are the point, so typing is bypassed. */
const asOptions = (value: unknown) => ({
  config: value as ExternalConfig,
});

describe("AsheeUIProvider configuration validation", () => {
  it("renders a valid configuration", () => {
    expect(() =>
      renderToServerString(<span>ok</span>, asOptions({ defaultTheme: "dark" })),
    ).not.toThrow();
  });

  it("fails visibly when a value is invalid", () => {
    expect(() =>
      renderToServerString(
        <span>ok</span>,
        asOptions({ defaultVariant: "primry" }),
      ),
    ).toThrowError(/defaultVariant: "primry" is not a valid value/);
  });

  it("warns about unknown keys in development without failing the render", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    renderToServerString(<span>ok</span>, asOptions({ bogus: true }));

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain(
      "[asheeui] bogus: unknown key",
    );
  });
});
