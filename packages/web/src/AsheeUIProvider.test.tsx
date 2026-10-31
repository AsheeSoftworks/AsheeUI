/**
 * Provider-level checks for configuration validation (M3, `U-4`).
 *
 * These prove the wiring rather than the rules: the unit rules live in
 * `config/validate-config.test.ts`, and this file shows that the provider
 * applies them while rendering.
 */

import { assertValidConfig, type ExternalConfig } from "@asheeui/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AsheeUIProvider } from "./AsheeUIProvider";
import {
  THEME_SCRIPT_ID,
  THEME_VARS_STYLE_ID,
} from "./scripts/AsheeThemeScript";
import {
  THEME_STORAGE_KEY,
  themeController,
} from "./theme/controller";
import { useTheme } from "./theme/useTheme";
import {
  act,
  expectHydrationClean,
  render,
  renderToServerString,
} from "./test";

/** Test helper: invalid configurations are the point, so typing is bypassed. */
const asOptions = (value: unknown) => ({
  config: value as ExternalConfig,
});

/**
 * The one invalid configuration both renderers are tested against.
 *
 * It is a shared object in the sense that matters: the same key, the same wrong value, and the same
 * expected rejection — because both providers call the same `assertValidConfig`.
 */
const INVALID_CONFIG = {
  defaultVariant: "primry",
} as unknown as ExternalConfig;

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

  it("rejects the same object the device rejects, with the one message core states", () => {
    // B09: the device's resolver calls `assertValidConfig` too, so an invalid shared configuration
    // fails identically on either platform. The expected message is produced by that function here
    // rather than restated, so the two sides cannot drift.
    let expected = "";
    try {
      assertValidConfig(INVALID_CONFIG);
    } catch (error) {
      expected = (error as Error).message;
    }

    expect(() =>
      renderToServerString(<span>ok</span>, asOptions(INVALID_CONFIG)),
    ).toThrowError(expected);
  });

  it("warns about unknown keys in development without failing the render", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    renderToServerString(<span>ok</span>, asOptions({ bogus: true }));

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain(
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

describe("AsheeUIProvider runtime themes", () => {
  beforeEach(() => {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.className = "";
    document.getElementById(THEME_VARS_STYLE_ID)?.remove();
  });

  it("registers a runtime theme, lists it and applies it", () => {
    let captured: ReturnType<typeof useTheme> | undefined;

    function Probe() {
      captured = useTheme();
      return <span>ok</span>;
    }

    const { unmount } = render(
      <AsheeUIProvider
        config={{ defaultTheme: "light" }}
        themes={{
          ocean: { extends: "dark", primary: "#0ea5e9" },
        }}>
        <Probe />
      </AsheeUIProvider>,
    );

    expect(captured?.availableThemes).toContain("ocean");

    const style = document.getElementById(THEME_VARS_STYLE_ID);
    expect(style?.textContent).toContain(".theme-ocean");
    expect(style?.textContent).toContain("--ashee-primary: #0ea5e9");

    act(() => themeController.setTheme("ocean"));

    expect(document.documentElement.classList.contains("theme-ocean")).toBe(true);
    expect(captured?.resolvedTheme).toBe("ocean");

    unmount();
  });

  it("removes a runtime theme and falls back when its selection is withdrawn", () => {
    function Probe() {
      return <span>ok</span>;
    }

    const { rerender, unmount } = render(
      <AsheeUIProvider
        config={{ defaultTheme: "light" }}
        themes={{ ocean: { extends: "dark", primary: "#0ea5e9" } }}>
        <Probe />
      </AsheeUIProvider>,
    );

    act(() => themeController.setTheme("ocean"));
    expect(document.documentElement.classList.contains("theme-ocean")).toBe(true);

    rerender(
      <AsheeUIProvider config={{ defaultTheme: "light" }} themes={{}}>
        <Probe />
      </AsheeUIProvider>,
    );

    expect(themeController.getAvailableThemes()).not.toContain("ocean");
    expect(themeController.getSelection()).toBe("light");
    expect(document.documentElement.classList.contains("theme-ocean")).toBe(false);

    const style = document.getElementById(THEME_VARS_STYLE_ID);
    expect(style?.textContent).not.toContain(".theme-ocean");

    unmount();
  });

  it("resolves a runtime theme that extends another runtime theme", () => {
    const markup = renderToServerString(<span>ok</span>, {
      config: { defaultTheme: "light" },
      themes: {
        base: { extends: "dark", background: "#0b0b12" },
        accent: { extends: "base", primary: "#8b5cf6" },
      },
    });

    expect(markup).toContain(".theme-accent");
    expect(markup).toContain("--ashee-background: #0b0b12");
    expect(markup).toContain("--ashee-primary: #8b5cf6");
  });

  it("keeps the configured definition when a runtime override is removed", () => {
    const { rerender, unmount } = render(
      <AsheeUIProvider
        config={{
          color: { midnight: { extends: "dark", primary: "#111111" } },
          defaultTheme: "light",
        }}
        themes={{ midnight: { extends: "dark", primary: "#222222" } }}>
        <span>ok</span>
      </AsheeUIProvider>,
    );

    let style = document.getElementById(THEME_VARS_STYLE_ID);
    expect(style?.textContent).toContain("--ashee-primary: #222222");

    rerender(
      <AsheeUIProvider
        config={{
          color: { midnight: { extends: "dark", primary: "#111111" } },
          defaultTheme: "light",
        }}>
        <span>ok</span>
      </AsheeUIProvider>,
    );

    style = document.getElementById(THEME_VARS_STYLE_ID);
    expect(style?.textContent).toContain("--ashee-primary: #111111");

    unmount();
  });
});
