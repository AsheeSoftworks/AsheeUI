/**
 * Provider-level checks for configuration validation (M3, `U-4`).
 *
 * These prove the wiring rather than the rules: the unit rules live in
 * `config/validate-config.test.ts`, and this file shows that the provider
 * applies them while rendering.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AsheeUIProvider } from "./AsheeUIProvider";
import type { ExternalConfig } from "./config/config";
import {
  THEME_SCRIPT_ID,
  THEME_VARS_STYLE_ID,
} from "./scripts/AsheeThemeScript";
import { expectHydrationClean, render, renderToServerString } from "./test";

/** Test helper: invalid configurations are the point, so typing is bypassed. */
const asOptions = (value: unknown) => ({
  config: value as ExternalConfig,
});

describe("AsheeUIProvider configuration validation", () => {
  it("renders a valid configuration", () => {
    expect(() =>
      renderToServerString(
        <span>ok</span>,
        asOptions({ defaultTheme: "dark" }),
      ),
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

describe("AsheeUIProvider pre-paint theme", () => {
  beforeEach(() => {
    document.getElementById(THEME_VARS_STYLE_ID)?.remove();
    document.documentElement.className = "";
  });

  it("renders the pre-paint script into the server output", () => {
    const markup = renderToServerString(<span>ok</span>, {
      config: { defaultTheme: "dark" },
    });

    expect(markup).toContain(`id="${THEME_SCRIPT_ID}"`);
    expect(markup).toContain(THEME_VARS_STYLE_ID);
  });

  it("applies the theme variables on a client-only render", () => {
    // A client-only render never runs the pre-paint script, because React does
    // not execute a script it creates, so the provider has to apply the
    // variables itself or the components resolve their colours to nothing.
    const { unmount } = render(
      <AsheeUIProvider config={{ defaultTheme: "dark" }}>
        <span>ok</span>
      </AsheeUIProvider>,
    );

    const style = document.getElementById(THEME_VARS_STYLE_ID);

    expect(style).not.toBeNull();
    expect(style?.textContent).toContain("--ashee-background");
    expect(style?.textContent).toContain(".theme-dark");
    expect(document.documentElement.classList.contains("theme-dark")).toBe(
      true,
    );

    unmount();
  });

  it("leaves the pre-paint script out of a client-only render", () => {
    // The element could never run there, so rendering it would add dead markup
    // and React reports it.
    const { unmount } = render(
      <AsheeUIProvider>
        <span>ok</span>
      </AsheeUIProvider>,
    );

    expect(document.getElementById(THEME_SCRIPT_ID)).toBeNull();

    unmount();
  });

  it("keeps the server script and hydrates cleanly", () => {
    expectHydrationClean(<span>ok</span>, { config: { defaultTheme: "dark" } });

    // The script stayed in the markup, and the variables are present.
    expect(document.getElementById(THEME_VARS_STYLE_ID)).not.toBeNull();
  });
});
